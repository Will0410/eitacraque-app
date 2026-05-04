import { Module } from '@nestjs/common';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { GrokClient } from './grok.client';

@Module({
  controllers: [AnalysesController],
  providers: [AnalysesService, GrokClient],
  exports: [AnalysesService],
})
export class AnalysesModule {}
