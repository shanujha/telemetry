import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { DynamicSchemaService } from './service/dynamic-schema.service';

@Module({
  controllers: [TelemetryController],
  providers: [TelemetryService, DynamicSchemaService],
})
export class TelemetryModule {}
