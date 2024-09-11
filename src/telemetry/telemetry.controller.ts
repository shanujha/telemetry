import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { UpdateTelemetryDto } from './dto/update-telemetry.dto';
import { DynamicSchemaService } from './service/dynamic-schema.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService, private readonly dynamicSchemaService: DynamicSchemaService) {}

  @Get()
  list() {
    return this.telemetryService.findAll();
  }

  @Post()
  async log(@Body() body: any, @Query() query: any) {
    const tableName = body.type;
    const debug = query.debug === 'true';
    const response = await this.dynamicSchemaService.createSchemaFromBody(body.log, tableName, debug);
    return response;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.telemetryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTelemetryDto: UpdateTelemetryDto) {
  //   return this.telemetryService.update(+id, updateTelemetryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.telemetryService.remove(+id);
  // }
}
