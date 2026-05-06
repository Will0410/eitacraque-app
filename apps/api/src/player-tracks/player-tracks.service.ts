import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerTrackDto } from './dto/create-player-track.dto';

@Injectable()
export class PlayerTracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(scoutId: string, dto: CreatePlayerTrackDto) {
    const athlete = await this.prisma.user.findUnique({
      where: { id: dto.athleteId },
    });
    if (!athlete || athlete.accountType !== 'ATHLETE') {
      throw new NotFoundException('Athlete not found');
    }

    const scoutProfile = await this.prisma.scoutProfile.findUnique({
      where: { userId: scoutId },
    });
    if (!scoutProfile) {
      throw new ForbiddenException('Only scouts can track players');
    }

    // Upsert: if already exists, update lastSeenAt and other fields
    const existing = await this.prisma.playerTrack.findUnique({
      where: { scoutId_athleteId: { scoutId, athleteId: dto.athleteId } },
    });

    if (existing) {
      return this.prisma.playerTrack.update({
        where: { scoutId_athleteId: { scoutId, athleteId: dto.athleteId } },
        data: {
          lastSeenAt: new Date(),
          notes: dto.notes ?? existing.notes,
          tags: dto.tags ?? existing.tags,
          potential: dto.potential ?? existing.potential,
          priority: dto.priority ?? existing.priority,
        },
        include: { athlete: true, scout: true },
      });
    }

    return this.prisma.playerTrack.create({
      data: {
        scoutId,
        athleteId: dto.athleteId,
        notes: dto.notes,
        tags: dto.tags ?? [],
        potential: dto.potential,
        priority: dto.priority ?? 3,
      },
      include: { athlete: true, scout: true },
    });
  }

  async findMyTracks(scoutId: string) {
    return this.prisma.playerTrack.findMany({
      where: { scoutId },
      orderBy: { lastSeenAt: 'desc' },
      include: { athlete: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
  }

  async findAthleteTracks(athleteId: string) {
    return this.prisma.playerTrack.findMany({
      where: { athleteId },
      orderBy: { priority: 'desc' },
      include: { scout: { include: { user: true } } },
    });
  }

  async remove(scoutId: string, athleteId: string) {
    return this.prisma.playerTrack.deleteMany({
      where: { scoutId, athleteId },
    });
  }
}
