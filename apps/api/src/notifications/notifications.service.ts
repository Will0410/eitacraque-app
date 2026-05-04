import { Injectable } from '@nestjs/common';
import type { NotificationKind } from '@eitacraque/shared';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, unreadOnly = false, cursor?: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { readAt: null } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 21,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const items = notifications.slice(0, 20);
    return {
      items,
      nextCursor: notifications.length > 20 ? notifications[20].id : null,
    };
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async push(userId: string, kind: NotificationKind, title: string, body: string, payload: Record<string, unknown> = {}) {
    return this.prisma.notification.create({
      data: { userId, kind, title, body, payload: payload as Prisma.InputJsonValue },
    });
  }
}
