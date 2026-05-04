import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AnalysesService } from './analyses.service';
import { RateClipDto } from './dto/rate-clip.dto';

@ApiTags('analyses')
@ApiBearerAuth()
@Controller('clips/:clipId')
export class AnalysesController {
  constructor(private readonly analyses: AnalysesService) {}

  @Public()
  @Get('analysis')
  get(@Param('clipId', ParseUUIDPipe) clipId: string) {
    return this.analyses.getForClip(clipId);
  }

  @Post('rate')
  rate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clipId', ParseUUIDPipe) clipId: string,
    @Body() dto: RateClipDto,
  ) {
    return this.analyses.rate(user, clipId, dto.score, dto.comment);
  }
}
