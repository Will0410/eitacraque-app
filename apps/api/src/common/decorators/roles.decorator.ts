import { SetMetadata } from '@nestjs/common';
import type { AccountType } from '@eitacraque/shared';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountType[]) => SetMetadata(ROLES_KEY, roles);
