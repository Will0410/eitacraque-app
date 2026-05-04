import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { ClipStatus } from '@eitacraque/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { GrokClient } from './grok.client';

@Injectable()
export class AnalysesService {
  private readonly logger = new Logger(AnalysesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly grok: GrokClient,
  ) {}

  async queueAnalysis(clipId: string): Promise<void> {
    // MVP: roda inline. Em produção: enfileirar em BullMQ (queue 'ai-analysis')
    setImmediate(() => {
      this.runAnalysis(clipId).catch((err) => {
        this.logger.error(`Falha ao analisar clip ${clipId}`, err);
        this.prisma.clip
          .update({ where: { id: clipId }, data: { status: ClipStatus.FAILED } })
          .catch(() => undefined);
      });
    });
  }

  async runAnalysis(clipId: string): Promise<void> {
    const clip = await this.prisma.clip.findUnique({ where: { id: clipId } });
    if (!clip || !clip.muxPlaybackId) return;

    const result = await this.grok.analyzeClip({
      playbackId: clip.muxPlaybackId,
      clipType: clip.clipType,
      position: clip.position,
    });

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const analysis = await tx.aiAnalysis.upsert({
        where: { clipId: clip.id },
        create: {
          clipId: clip.id,
          summary: result.summary,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          overallScore: result.overallScore,
          modelVersion: result.modelVersion,
          rawResponse: result.raw as object,
        },
        update: {
          summary: result.summary,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          overallScore: result.overallScore,
          modelVersion: result.modelVersion,
          rawResponse: result.raw as object,
        },
      });

      await tx.aiAttributeScore.deleteMany({ where: { analysisId: analysis.id } });
      await tx.aiAttributeScore.createMany({
        data: result.attributeScores.map((a) => ({
          analysisId: analysis.id,
          attribute: a.attribute,
          score: a.score,
        })),
      });

      await tx.clip.update({ where: { id: clip.id }, data: { status: ClipStatus.READY } });
    });
  }

  async getForClip(clipId: string) {
    const clip = await this.prisma.clip.findUnique({
      where: { id: clipId },
      include: {
        aiAnalysis: { include: { attributeScores: true } },
        ratings: true,
      },
    });
    if (!clip) throw new NotFoundException('Lance não encontrado');

    const scoutRatings = await this.prisma.communityRating.findMany({
      where: { clipId, user: { accountType: 'SCOUT' } },
    });

    const allScores = clip.ratings.map((r: typeof clip.ratings[0]) => r.score);
    const scoutScores = scoutRatings.map((r: typeof scoutRatings[0]) => r.score);
    const avg = (xs: number[]) => (xs.length ? xs.reduce((a: number, b: number) => a + b, 0) / xs.length : 0);

    return {
      ai: clip.aiAnalysis
        ? {
            id: clip.aiAnalysis.id,
            clipId: clip.aiAnalysis.clipId,
            summary: clip.aiAnalysis.summary,
            strengths: clip.aiAnalysis.strengths,
            weaknesses: clip.aiAnalysis.weaknesses,
            attributeScores: clip.aiAnalysis.attributeScores.map((a: typeof clip.aiAnalysis.attributeScores[0]) => ({
              attribute: a.attribute,
              score: a.score,
            })),
            overallScore: clip.aiAnalysis.overallScore,
            modelVersion: clip.aiAnalysis.modelVersion,
            generatedAt: clip.aiAnalysis.generatedAt.toISOString(),
          }
        : null,
      community: {
        clipId,
        averageScore: Number(avg(allScores).toFixed(2)),
        ratingsCount: allScores.length,
        scoutWeightedAverage: Number(avg(scoutScores).toFixed(2)),
      },
    };
  }

  async rate(user: AuthenticatedUser, clipId: string, score: number, comment?: string) {
    if (score < 0 || score > 10) throw new BadRequestException('Nota precisa estar entre 0 e 10');
    return this.prisma.communityRating.upsert({
      where: { clipId_userId: { clipId, userId: user.id } },
      create: { clipId, userId: user.id, score, comment },
      update: { score, comment },
    });
  }
}
