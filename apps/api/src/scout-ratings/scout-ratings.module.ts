import { Module } from '@nestjs/common';
import { ScoutRatingsController } from './scout-ratings.controller';
import { ScoutRatingsService } from './scout-ratings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScoutRatingsController],
  providers: [ScoutRatingsService],
  exports: [ScoutRatingsService],
})
export class ScoutRatingsModule {}
