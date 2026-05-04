import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountType, Attribute } from '@eitacraque/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAthleteProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        athleteProfile: { include: { clubHistory: { orderBy: { startDate: 'desc' } } } },
        clips: {
          where: { status: 'READY' },
          orderBy: { createdAt: 'desc' },
          take: 6,
          include: { aiAnalysis: { include: { attributeScores: true } } },
        },
      },
    });

    if (!user || user.accountType !== AccountType.ATHLETE || !user.athleteProfile) {
      throw new NotFoundException('Atleta não encontrado');
    }

    const radar = this.aggregateRadar(user.clips);

    return {
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
      },
      profile: {
        userId: user.athleteProfile.userId,
        position: user.athleteProfile.position,
        secondaryPosition: user.athleteProfile.secondaryPosition,
        dominantFoot: user.athleteProfile.dominantFoot,
        birthDate: user.athleteProfile.birthDate?.toISOString() ?? null,
        heightCm: user.athleteProfile.heightCm,
        weightKg: user.athleteProfile.weightKg,
        category: user.athleteProfile.category,
        city: user.athleteProfile.city,
        state: user.athleteProfile.state,
        bio: user.athleteProfile.bio,
        overallRating: user.athleteProfile.overallRating,
        nationalPercentile: user.athleteProfile.nationalPercentile,
        scoutVisits: user.athleteProfile.scoutVisits,
      },
      radar,
      recentClipsCount: user.clips.length,
    };
  }

  private aggregateRadar(
    clips: Array<{ aiAnalysis: { attributeScores: Array<{ attribute: Attribute; score: number }> } | null }>,
  ) {
    const totals = new Map<Attribute, { sum: number; n: number }>();
    for (const clip of clips) {
      if (!clip.aiAnalysis) continue;
      for (const a of clip.aiAnalysis.attributeScores) {
        const cur = totals.get(a.attribute) ?? { sum: 0, n: 0 };
        cur.sum += a.score;
        cur.n += 1;
        totals.set(a.attribute, cur);
      }
    }
    return Array.from(totals.entries()).map(([attribute, { sum, n }]) => ({
      attribute,
      score: Number((sum / n).toFixed(2)),
    }));
  }
}
