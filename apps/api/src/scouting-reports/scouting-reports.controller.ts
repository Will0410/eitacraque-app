import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ScoutingReportsService } from './scouting-reports.service';
import { CreateScoutingReportDto } from './dto/create-scouting-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('scouting-reports')
@UseGuards(JwtAuthGuard)
export class ScoutingReportsController {
  constructor(private readonly service: ScoutingReportsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateScoutingReportDto) {
    const scoutId = (req.user as any).sub;
    return this.service.create(scoutId, dto);
  }

  @Get('athlete/:athleteId')
  findByAthlete(@Param('athleteId', ParseUUIDPipe) athleteId: string) {
    return this.service.findByAthlete(athleteId);
  }

  @Get('scout/:scoutId')
  findByScout(@Param('scoutId', ParseUUIDPipe) scoutId: string) {
    return this.service.findByScout(scoutId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }
}
