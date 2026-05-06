import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
 import { AnalysesModule } from './analyses/analyses.module';
 import { AuthModule } from './auth/auth.module';
 import { ClipsModule } from './clips/clips.module';
 import { FeedModule } from './feed/feed.module';
 import { NotificationsModule } from './notifications/notifications.module';
 import { PrismaModule } from './prisma/prisma.module';
 import { UsersModule } from './users/users.module';
 import { ReactionsModule } from './reactions/reactions.module';
 import { ScoutRatingsModule } from './scout-ratings/scout-ratings.module';
 import { ScoutingReportsModule } from './scouting-reports/scouting-reports.module';
 import { PlayerTracksModule } from './player-tracks/player-tracks.module';
 import { MeetingsModule } from './meetings/meetings.module';
 import { ProposalsModule } from './proposals/proposals.module';

@Module({
   imports: [
     ConfigModule.forRoot({
       isGlobal: true,
       cache: true,
       envFilePath: ['../../.env', '.env'],
     }),
     ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
     PrismaModule,
     AuthModule,
     UsersModule,
     ClipsModule,
     AnalysesModule,
     FeedModule,
     NotificationsModule,
     ReactionsModule,
     ScoutRatingsModule,
     ScoutingReportsModule,
     PlayerTracksModule,
     MeetingsModule,
     ProposalsModule,
   ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
