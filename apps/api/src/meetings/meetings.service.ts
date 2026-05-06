import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingStatus } from '@prisma/client';
import { MeetingStatus } from '@eitacraque/shared';

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(scoutId: string, dto: CreateMeetingDto) {
    const athlete = await this.prisma.user.findUnique({ where: { id: dto.athleteId } });
    if (!athlete) throw new NotFoundException('Athlete not found');

    // If proposalId is provided, verify it belongs to athlete and scout
    if (dto.proposalId) {
      const proposal = await this.prisma.proposal.findUnique({
        where: { id: dto.proposalId },
      });
      if (!proposal) throw new NotFoundException('Proposal not found');
      // Ensure scout is assigned to proposal
      if (proposal.scoutId !== scoutId) {
        throw new ForbiddenException('Scout not assigned to this proposal');
      }
    }

    // Check if meeting code already exists
    const existingCode = await this.prisma.meeting.findUnique({
      where: { meetingCode: dto.meetingCode },
    });
    if (existingCode) {
      throw new BadRequestException('Meeting code already in use');
    }

    return this.prisma.meeting.create({
      data: {
        scoutId,
        athleteId: dto.athleteId,
        proposalId: dto.proposalId,
        meetingCode: dto.meetingCode,
        status: MeetingStatus.PENDING,
        scheduledFor: new Date(dto.scheduledFor),
        location: dto.location,
        notes: dto.notes,
      },
      include: { scout: true, athlete: true },
    });
  }

  async findByScout(scoutId: string) {
    return this.prisma.meeting.findMany({
      where: { scoutId },
      orderBy: { scheduledFor: 'desc' },
      include: { scout: true, athlete: true, proposal: true },
    });
  }

  async findByAthlete(athleteId: string) {
    return this.prisma.meeting.findMany({
      where: { athleteId },
      orderBy: { scheduledFor: 'desc' },
      include: { scout: true, athlete: true, proposal: true },
    });
  }

  async confirm(meetingId: string, userId: string, status: MeetingStatus) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    if (!meeting) throw new NotFoundException('Meeting not found');

    // Determine if userId is scout or athlete
    const isScout = meeting.scoutId === userId;
    const isAthlete = meeting.athleteId === userId;

    if (!isScout && !isAthlete) {
      throw new ForbiddenException('Not a participant');
    }

    const updateData: any = {};
    if (isScout) {
      updateData.scoutConfirmed = status === MeetingStatus.CONFIRMED;
    }
    if (isAthlete) {
      updateData.athleteConfirmed = status === MeetingStatus.CONFIRMED;
    }
    updateData.status = status;

    return this.prisma.meeting.update({
      where: { id: meetingId },
      data: updateData,
      include: { scout: true, athlete: true },
    });
  }

  async complete(meetingId: string, userId: string, actualEndAt?: Date) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting) throw new NotFoundException('Meeting not found');
    if (meeting.scoutId !== userId && meeting.athleteId !== userId) {
      throw new ForbiddenException('Not a participant');
    }
    return this.prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: MeetingStatus.COMPLETED,
        actualEndAt: actualEndAt ?? new Date(),
      },
    });
  }
}
