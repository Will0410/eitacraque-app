import { Module } from '@nestjs/common';
import { PlayerTracksController } from './player-tracks.controller';
import { PlayerTracksService } from './player-tracks.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerTracksController],
  providers: [PlayerTracksService],
  exports: [PlayerTracksService],
})
export class PlayerTracksModule {}
