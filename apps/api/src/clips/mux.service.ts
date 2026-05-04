import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mux from '@mux/mux-node';

export interface MuxDirectUpload {
  id: string;
  url: string;
}

@Injectable()
export class MuxService {
  private readonly logger = new Logger(MuxService.name);
  private client: Mux | null = null;

  constructor(private readonly config: ConfigService) {}

  private getClient(): Mux {
    if (this.client) return this.client;
    const tokenId = this.config.get<string>('MUX_TOKEN_ID');
    const tokenSecret = this.config.get<string>('MUX_TOKEN_SECRET');
    if (!tokenId || !tokenSecret) {
      throw new Error('MUX_TOKEN_ID/MUX_TOKEN_SECRET ausentes — configure .env');
    }
    this.client = new Mux({ tokenId, tokenSecret });
    return this.client;
  }

  async createDirectUpload(corsOrigin: string): Promise<MuxDirectUpload> {
    const client = this.getClient();
    const upload = await client.video.uploads.create({
      cors_origin: corsOrigin,
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'baseline',
        max_resolution_tier: '1080p',
      },
    });
    return { id: upload.id, url: upload.url };
  }

  async getAssetByUploadId(uploadId: string) {
    const client = this.getClient();
    const upload = await client.video.uploads.retrieve(uploadId);
    if (!upload.asset_id) return null;
    return client.video.assets.retrieve(upload.asset_id);
  }

  verifyWebhookSignature(rawBody: string, header: string | undefined): boolean {
    const secret = this.config.get<string>('MUX_WEBHOOK_SECRET');
    if (!secret || !header) {
      this.logger.warn('Webhook MUX sem assinatura — configure MUX_WEBHOOK_SECRET');
      return false;
    }
    // TODO: implementar verificação real com HMAC-SHA256
    // Por enquanto, aceita qualquer webhook com secret configurada
    this.logger.debug(`Webhook MUX recebido de ${header.substring(0, 20)}...`);
    return true;
  }
}
