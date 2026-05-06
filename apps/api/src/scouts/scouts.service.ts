import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicProfile(userId: string) {
    const profile = await this.prisma.scoutProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    });
    if (!profile) {
      throw new NotFoundException('Scout profile not found');
    }
    return profile;
  }

  async getPublicWithRatings(userId: string) {
    const [profile, ratings] = await Promise.all([
      this.getPublicProfile(userId),
      this.prisma.scoutRating.findMany({
        where: { scoutId: userId },
        include: {
          rater: {
            select: { id: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const avg = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      ...profile,
      averageRating: avg,
      ratingCount: ratings.length,
      ratings,
    };
  }
}
