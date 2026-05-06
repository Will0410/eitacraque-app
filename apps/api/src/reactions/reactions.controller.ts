import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionsController {
  constructor(private readonly service: ReactionsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateReactionDto) {
    const userId = (req.user as any).sub;
    return this.service.create(userId, dto);
  }

  @Get('analysis/:analysisId')
  findByAnalysis(@Param('analysisId') analysisId: string) {
    return this.service.findByAnalysis(analysisId);
  }

  @Delete('analysis/:analysisId')
  remove(@Req() req: Request, @Param('analysisId') analysisId: string) {
    const userId = (req.user as any).sub;
    return this.service.delete(userId, analysisId);
  }
}
