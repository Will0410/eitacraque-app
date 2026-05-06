import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoutRatingDto } from './dto/create-scout-rating.dto';

@Injectable()
export class ScoutRatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(raterId: string, dto: CreateScoutRatingDto) {
    const scout = await this.prisma.user.findUnique({
      where: { id: dto.scoutId },
    });
    if (!scout || scout.accountType !== 'SCOUT') {
      throw new NotFoundException('Scout not found');
    }

    if (dto.scoutId === raterId) {
      throw new BadRequestException('You cannot rate yourself');
    }

    const existing = await this.prisma.scoutRating.findUnique({
      where: { scoutId_raterId: { scoutId: dto.scoutId, raterId } },
    });
    if (existing) {
      throw new BadRequestException('You have already rated this scout');
    }

    const rating = await this.prisma.scoutRating.create({
      data: {
        scoutId: dto.scoutId,
        raterId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: { scout: { select: { id: true, displayName: true, avatarUrl: true } } },
    });

    // Recalculate scout average rating
    await this.updateScoutRating(dto.scoutId);
    return rating;
  }

  async updateScoutRating(scoutId: string) {
    const ratings = await this.prisma.scoutRating.findMany({
      where: { scoutId },
    });
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    const count = ratings.length;

    await this.prisma.scoutProfile.update({
      where: { userId: scoutId },
      data: { rating: avg, ratingCount: count },
    });
  }

  async findByScout(scoutId: string) {
    return this.prisma.scoutRating.findMany({
      where: { scoutId },
      include: {
        rater: { select: { id: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
