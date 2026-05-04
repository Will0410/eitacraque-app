import type { AccountType, User } from '../index.js';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  accountType: AccountType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
