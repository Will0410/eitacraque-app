import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ScoutRatingsService } from './scout-ratings.service';
import { CreateScoutRatingDto } from './dto/create-scout-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('scout-ratings')
@UseGuards(JwtAuthGuard)
export class ScoutRatingsController {
  constructor(private readonly service: ScoutRatingsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateScoutRatingDto) {
    const raterId = (req.user as any).sub;
    return this.service.create(raterId, dto);
  }

  @Get('scout/:scoutId')
  findByScout(@Param('scoutId') scoutId: string) {
    return this.service.findByScout(scoutId);
  }
}
