import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { MeetingStatus } from '@prisma/client';
import { MeetingStatus } from '@eitacraque/shared';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private readonly service: MeetingsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateMeetingDto) {
    const scoutId = (req.user as any).sub;
    // Ensure only scouts can create meetings
    return this.service.create(scoutId, dto);
  }

  @Get('my-scout')
  myScoutMeetings(@Req() req: Request) {
    const scoutId = (req.user as any).sub;
    return this.service.findByScout(scoutId);
  }

  @Get('my-athlete')
  myAthleteMeetings(@Req() req: Request) {
    const athleteId = (req.user as any).sub;
    return this.service.findByAthlete(athleteId);
  }

  @Put(':id/confirm')
  confirm(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string, @Body() body: { status: MeetingStatus }) {
    const userId = (req.user as any).sub;
    return this.service.confirm(id, userId, body.status);
  }

  @Put(':id/complete')
  complete(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    const userId = (req.user as any).sub;
    return this.service.complete(id, userId);
  }
}
