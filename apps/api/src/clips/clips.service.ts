import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountType, ClipStatus } from '@eitacraque/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AnalysesService } from '../analyses/analyses.service';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator';
import type { CreateClipDto } from './dto/create-clip.dto';
import { MuxService } from './mux.service';

@Injectable()
export class ClipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mux: MuxService,
    private readonly analyses: AnalysesService,
    private readonly config: ConfigService,
  ) {}

  async createUpload(user: AuthenticatedUser, dto: CreateClipDto) {
    if (user.accountType !== AccountType.ATHLETE) {
      throw new ForbiddenException('Somente atletas podem subir lances');
    }

    const corsOrigin = this.config.get<string>('WEB_ORIGIN', 'http://localhost:5173').split(',')[0];
    const upload = await this.mux.createDirectUpload(corsOrigin);

    const clip = await this.prisma.clip.create({
      data: {
        athleteId: user.id,
        title: dto.title,
        description: dto.description ?? null,
        clipType: dto.clipType,
        position: dto.position ?? null,
        matchDate: dto.matchDate ? new Date(dto.matchDate) : null,
        opponent: dto.opponent ?? null,
        status: ClipStatus.UPLOADING,
        muxUploadId: upload.id,
      },
    });

    return {
      clip: this.toClipDto(clip),
      muxUploadUrl: upload.url,
      muxUploadId: upload.id,
    };
  }

  async finalize(user: AuthenticatedUser, muxUploadId: string) {
    const clip = await this.prisma.clip.findUnique({ where: { muxUploadId } });
    if (!clip) throw new NotFoundException('Upload não encontrado');
    if (clip.athleteId !== user.id) throw new ForbiddenException();

    const asset = await this.mux.getAssetByUploadId(muxUploadId);
    if (!asset) {
      return this.toClipDto(clip);
    }

    const playbackId = asset.playback_ids?.[0]?.id ?? null;
    const updated = await this.prisma.clip.update({
      where: { id: clip.id },
      data: {
        muxAssetId: asset.id,
        muxPlaybackId: playbackId,
        durationSeconds: asset.duration ? Math.round(asset.duration) : null,
        thumbnailUrl: playbackId ? `https://image.mux.com/${playbackId}/thumbnail.jpg` : null,
        status: ClipStatus.ANALYZING,
      },
    });

    void this.analyses.queueAnalysis(updated.id);
    return this.toClipDto(updated);
  }

  async findById(id: string) {
    const clip = await this.prisma.clip.findUnique({
      where: { id },
      include: {
        athlete: true,
        aiAnalysis: { include: { attributeScores: true } },
        ratings: true,
      },
    });
    if (!clip) throw new NotFoundException('Lance não encontrado');
    return clip;
  }

  private toClipDto(clip: {
    id: string;
    athleteId: string;
    title: string;
    description: string | null;
    clipType: any;
    position: any;
    matchDate: Date | null;
    opponent: string | null;
    muxAssetId: string | null;
    muxPlaybackId: string | null;
    durationSeconds: number | null;
    status: any;
    views: number;
    likes: number;
    createdAt: Date;
  }) {
    return {
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
    };
  }
}
