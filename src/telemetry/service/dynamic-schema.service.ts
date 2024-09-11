import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DynamicSchemaService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    isValidDate(dateString: string): boolean {
        // Regular expression to match common date formats (e.g., YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, etc.)
        const dateRegex = /^\d{4}[-/]\d{2}[-/]\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3}Z)?)?$/;
        return dateRegex.test(dateString) && !isNaN(Date.parse(dateString));
    }

    async createSchemaFromBody(body: any, tableName: string, debug: Boolean) {
        const columns = Object.keys(body).map(key => {
            const value = body[key];
            if (typeof value === 'number') {
                return `${key} NUMERIC`;
            } else if (value instanceof Date || (typeof value === 'string' && this.isValidDate(value))) {
                return `${key} TIMESTAMP`;
            } else if (typeof value === 'boolean') {
                return `${key} BOOLEAN`;
            } else {
                return `${key} VARCHAR`;
            }
        });
        // Check if the table exists
        const tableExistsQuery = `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${tableName}')`;
        const tableExists = await this.dataSource.query(tableExistsQuery);

        if (tableExists[0].exists) {
            // Table exists, alter it to add new columns
            const existingColumnsQuery = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`;
            const existingColumns = await this.dataSource.query(existingColumnsQuery);
            const existingColumnNames = existingColumns.map(col => col.column_name);

            const newColumns = columns.filter(col => !existingColumnNames.includes(col.split(' ')[0]));

            if (newColumns.length > 0) {
                const alterQuery = `ALTER TABLE ${tableName} ${newColumns.map(col => `ADD COLUMN IF NOT EXISTS ${col}`).join(', ')}`;
                await this.dataSource.query(alterQuery);
            }
        } else {
            // Table doesn't exist, create it
            const createQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(', ')})`;
            await this.dataSource.query(createQuery);
        }
        const columnNames = Object.keys(body);
        const orderedValues = Object.values(body)
        let message = 'Logged';
        const insertQuery = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columnNames.map((_, index) => `$${index + 1}`).join(', ')});`;
        try {
            await this.dataSource.query(insertQuery, orderedValues);
            message = "Logged Successfully!"
        } catch (error) {
            console.error('Error inserting data:', error);
            console.log('Insert query:', insertQuery);
            console.log('Ordered values:', orderedValues);
            message = "Failed to log"
            throw new Error(`Failed to insert data: ${error.message}`);
        }


        // console.log(Object.keys(body).map((key: any, index: number) => body[key]));
        // return { message: 'Schema created successfully', query: insertQuery };
        const response = { message, query: debug ? insertQuery : undefined, orderedValues: debug ? orderedValues : undefined}
        return response;
    }
}

