import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionType } from '@prisma/client';

@Injectable()
export class ReactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReactionDto) {
    const analysis = await this.prisma.aiAnalysis.findUnique({
      where: { id: dto.analysisId },
    });
    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    const existing = await this.prisma.reaction.findUnique({
      where: {
        analysisId_userId: { analysisId: dto.analysisId, userId },
      },
    });
    if (existing) {
      throw new ConflictException('User already reacted to this analysis');
    }

    return this.prisma.reaction.create({
      data: {
        analysisId: dto.analysisId,
        userId,
        type: dto.type as ReactionType,
      },
    });
  }

  async findByAnalysis(analysisId: string) {
    return this.prisma.reaction.findMany({
      where: { analysisId },
      include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
  }

  async delete(userId: string, analysisId: string) {
    return this.prisma.reaction.deleteMany({
      where: { analysisId, userId },
    });
  }
}
