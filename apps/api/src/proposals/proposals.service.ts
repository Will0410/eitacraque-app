import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clubId: string, dto: CreateProposalDto) {
    const athlete = await this.prisma.user.findUnique({
      where: { id: dto.athleteId },
    });
    if (!athlete || athlete.accountType !== 'ATHLETE') {
      throw new NotFoundException('Athlete not found');
    }

    let scoutId: string | undefined;
    if (dto.meetingCode) {
      const meeting = await this.prisma.meeting.findUnique({
        where: { meetingCode: dto.meetingCode },
      });
      if (!meeting) throw new NotFoundException('Meeting not found');
      if (meeting.athleteId !== dto.athleteId) {
        throw new ForbiddenException('Meeting does not belong to this athlete');
      }
      scoutId = meeting.scoutId;
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month expiry default

    return this.prisma.proposal.create({
      data: {
        clubId,
        athleteId: dto.athleteId,
        scoutId,
        category: dto.category,
        durationMonths: dto.durationMonths,
        monthlyValueCents: dto.monthlyValueCents,
        message: dto.message,
        expiresAt,
      },
      include: {
        athlete: { select: { id: true, displayName: true, avatarUrl: true } },
        scout: { include: { user: { select: { displayName: true } } } },
      },
    });
  }

  async findByAthlete(athleteId: string) {
    return this.prisma.proposal.findMany({
      where: { athleteId },
      orderBy: { createdAt: 'desc' },
      include: {
        club: { select: { id: true, displayName: true, avatarUrl: true } },
        scout: { include: { user: { select: { displayName: true } } } },
      },
    });
  }

  async findByClub(clubId: string) {
    return this.prisma.proposal.findMany({
      where: { clubId },
      orderBy: { createdAt: 'desc' },
      include: {
        athlete: { select: { id: true, displayName: true, avatarUrl: true } },
        scout: { include: { user: { select: { displayName: true } } } },
      },
    });
  }

  async updateStatus(proposalId: string, userId: string, status: 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN') {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
    });
    if (!proposal) throw new NotFoundException('Proposal not found');

    // Only athlete can accept/reject, club can withdraw
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      if (proposal.athleteId !== userId) {
        throw new ForbiddenException('Only athlete can respond');
      }
    } else if (status === 'WITHDRAWN') {
      if (proposal.clubId !== userId) {
        throw new ForbiddenException('Only club can withdraw');
      }
    }

    return this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
    });
  }
}
