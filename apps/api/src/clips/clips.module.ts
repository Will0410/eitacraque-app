import { Module } from '@nestjs/common';
import { AnalysesModule } from '../analyses/analyses.module';
import { ClipsController } from './clips.controller';
import { ClipsService } from './clips.service';
import { MuxService } from './mux.service';

@Module({
  imports: [AnalysesModule],
  controllers: [ClipsController],
  providers: [ClipsService, MuxService],
  exports: [ClipsService],
})
export class ClipsModule {}
