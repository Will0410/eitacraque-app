import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FeedTab } from '@eitacraque/shared';
import { CurrentUser, type AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { FeedService } from './feed.service';

@ApiTags('feed')
@ApiBearerAuth()
@Controller('feed')
export class FeedController {
  constructor(private readonly feed: FeedService) {}

  @Public()
  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query('tab', new DefaultValuePipe(FeedTab.FOR_YOU)) tab: FeedTab,
    @Query('cursor') cursor?: string,
  ) {
    return this.feed.list(user?.id ?? null, tab, cursor);
  }
}
