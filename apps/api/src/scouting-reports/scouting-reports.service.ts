import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoutingReportDto } from './dto/create-scouting-report.dto';

@Injectable()
export class ScoutingReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(scoutId: string, dto: CreateScoutingReportDto) {
    const athlete = await this.prisma.user.findUnique({
      where: { id: dto.athleteId },
    });
    if (!athlete) {
      throw new NotFoundException('Athlete not found');
    }
    if (athlete.accountType !== 'ATHLETE') {
      throw new ForbiddenException('User is not an athlete');
    }

    // Verify scout belongs to a ScoutProfile
    const scoutProfile = await this.prisma.scoutProfile.findUnique({
      where: { userId: scoutId },
    });
    if (!scoutProfile) {
      throw new NotFoundException('Scout profile not found');
    }

    // Check if analysis exists and belongs to the clip
    if (dto.analysisId) {
      const analysis = await this.prisma.aiAnalysis.findUnique({
        where: { id: dto.analysisId },
      });
      if (!analysis) {
        throw new NotFoundException('Analysis not found');
      }
    }

    const report = await this.prisma.scoutingReport.create({
      data: {
        scoutId,
        athleteId: dto.athleteId,
        analysisId: dto.analysisId,
        overallScore: dto.overallScore,
        position: dto.position,
        potential: dto.potential,
        recommendation: dto.recommendation,
        strengths: dto.strengths ?? [],
        weaknesses: dto.weaknesses ?? [],
        summary: dto.summary,
      },
      include: {
        scout: {
          select: { user: { select: { displayName: true, avatarUrl: true } }, organizationName, regions },
        },
      },
    });

    return report;
  }

  async findByAthlete(athleteId: string) {
    return this.prisma.scoutingReport.findMany({
      where: { athleteId },
      orderBy: { createdAt: 'desc' },
      include: {
        scout: {
          select: { user: { select: { id: true, displayName: true, avatarUrl: true } }, organizationName },
        },
        analysis: {
          select: { id: true, overallScore: true, strengths: true, weaknesses: true, summary: true },
        },
      },
    });
  }

  async findByScout(scoutId: string) {
    return this.prisma.scoutingReport.findMany({
      where: { scoutId },
      orderBy: { createdAt: 'desc' },
      include: {
        athlete: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.scoutingReport.findUnique({
      where: { id },
      include: {
        scout: {
          select: {
            user: { select: { displayName: true, avatarUrl: true } },
            organizationName,
          },
        },
        athlete: { select: { id: true, displayName: true, avatarUrl: true } },
        analysis: true,
      },
    });
  }
}
