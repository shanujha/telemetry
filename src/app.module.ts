import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryModule } from './telemetry/telemetry.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [TelemetryModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dev_user',
    password: 'dev_password',
    database: 'development_db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // Note: Disable this in production
  }), UserModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
