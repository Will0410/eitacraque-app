import { Injectable } from '@nestjs/common';
import { ClipStatus, FeedTab } from '@eitacraque/shared';
import { PrismaService } from '../prisma/prisma.service';

const PAGE_SIZE = 20;
const TRENDING_WINDOW_HOURS = 72;

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async list(viewerId: string | null, tab: FeedTab, cursor?: string) {
    const baseWhere = { status: ClipStatus.READY };

    let whereExtra: Record<string, unknown> = {};
    if (tab === FeedTab.FOLLOWING && viewerId) {
      const follows = await this.prisma.follow.findMany({
        where: { followerId: viewerId },
        select: { followedId: true },
      });
      whereExtra = { athleteId: { in: follows.map((f) => f.followedId) } };
    }
    if (tab === FeedTab.TRENDING) {
      whereExtra = {
        createdAt: { gte: new Date(Date.now() - TRENDING_WINDOW_HOURS * 3600 * 1000) },
      };
    }

    const clips = await this.prisma.clip.findMany({
      where: { ...baseWhere, ...whereExtra },
      include: {
        athlete: { select: { id: true, displayName: true, avatarUrl: true } },
        aiAnalysis: { select: { overallScore: true } },
        ratings: { select: { score: true } },
      },
      orderBy:
        tab === FeedTab.TRENDING
          ? [{ likes: 'desc' }, { views: 'desc' }, { createdAt: 'desc' }]
          : [{ createdAt: 'desc' }],
      take: PAGE_SIZE + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = clips.slice(0, PAGE_SIZE).map((clip) => {
      const ratings = clip.ratings.map((r) => r.score);
      const communityAverage = ratings.length
        ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
        : null;
      return {
        clip: {
          id: clip.id,
          athleteId: clip.athleteId,
          title: clip.title,
          description: clip.description,
          clipType: clip.clipType,
          position: clip.position,
          matchDate: clip.matchDate?.toISOString() ?? null,
          opponent: clip.opponent,
          muxAssetId: clip.muxAssetId,
          muxPlaybackId: clip.muxPlaybackId,
          durationSeconds: clip.durationSeconds,
          status: clip.status,
          views: clip.views,
          likes: clip.likes,
          createdAt: clip.createdAt.toISOString(),
        },
        athlete: clip.athlete,
        aiOverallScore: clip.aiAnalysis?.overallScore ?? null,
        communityAverage,
        thumbnailUrl: clip.thumbnailUrl,
      };
    });

    return {
      items,
      nextCursor: clips.length > PAGE_SIZE ? clips[PAGE_SIZE].id : null,
    };
  }
}
