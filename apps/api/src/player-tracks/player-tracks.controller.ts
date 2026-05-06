import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PlayerTracksService } from './player-tracks.service';
import { CreatePlayerTrackDto } from './dto/create-player-track.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('player-tracks')
@UseGuards(JwtAuthGuard)
export class PlayerTracksController {
  constructor(private readonly service: PlayerTracksService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreatePlayerTrackDto) {
    const scoutId = (req.user as any).sub;
    return this.service.create(scoutId, dto);
  }

  @Get('my')
  findMy(@Req() req: Request) {
    const scoutId = (req.user as any).sub;
    return this.service.findMyTracks(scoutId);
  }

  @Get('athlete/:athleteId')
  findByAthlete(@Param('athleteId', ParseUUIDPipe) athleteId: string) {
    return this.service.findAthleteTracks(athleteId);
  }

  @Delete('athlete/:athleteId')
  remove(@Req() req: Request, @Param('athleteId', ParseUUIDPipe) athleteId: string) {
    const scoutId = (req.user as any).sub;
    return this.service.remove(scoutId, athleteId);
  }
}
