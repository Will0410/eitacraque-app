import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser, type AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ClipsService } from './clips.service';
import { CreateClipDto } from './dto/create-clip.dto';
import { MuxService } from './mux.service';

@ApiTags('clips')
@ApiBearerAuth()
@Controller('clips')
export class ClipsController {
  constructor(
    private readonly clips: ClipsService,
    private readonly mux: MuxService,
  ) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateClipDto) {
    return this.clips.createUpload(user, dto);
  }

  @Post(':muxUploadId/finalize')
  finalize(
    @CurrentUser() user: AuthenticatedUser,
    @Param('muxUploadId') muxUploadId: string,
  ) {
    return this.clips.finalize(user, muxUploadId);
  }

  @Public()
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.clips.findById(id);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('webhooks/mux')
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('mux-signature') signature: string,
  ) {
    const raw = req.rawBody?.toString('utf8') ?? '';
    if (!this.mux.verifyWebhookSignature(raw, signature)) return;
    // TODO: enfileirar processamento idempotente do evento (asset.ready, asset.errored)
  }
}
