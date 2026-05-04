import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { AccountType } from '@eitacraque/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  accountType: AccountType;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
