import { Controller, Get, Param, ParseUUIDPipe, Public } from '@nestjs/common';
import { ScoutsService } from './scouts.service';

@Controller('scouts')
export class ScoutsController {
  constructor(private readonly service: ScoutsService) {}

  @Public()
  @Get(':id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getPublicProfile(id);
  }

  @Public()
  @Get(':id/with-ratings')
  async getProfileWithRatings(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getPublicWithRatings(id);
  }
}
