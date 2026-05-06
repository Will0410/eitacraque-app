import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '@prisma/client';

@Controller('proposals')
@UseGuards(JwtAuthGuard)
export class ProposalsController {
  constructor(
    private readonly service: ProposalsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateProposalDto) {
    const clubId = (req.user as any).sub;
    return this.service.create(clubId, dto);
  }

  @Get('my-received')
  myReceived(@Req() req: Request) {
    const athleteId = (req.user as any).sub;
    return this.service.findByAthlete(athleteId);
  }

  @Get('my-sent')
  mySent(@Req() req: Request) {
    const clubId = (req.user as any).sub;
    return this.service.findByClub(clubId);
  }

  @Get('me')
  async my(@Req() req: Request) {
    const userId = (req.user as any).sub;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { accountType: true },
    });
    if (!user) throw new Error('User not found');
    return this.service.findMy(userId, user.accountType);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { status: 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' },
  ) {
    const userId = (req.user as any).sub;
    return this.service.updateStatus(id, userId, body.status);
  }
}
