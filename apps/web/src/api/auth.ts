import type { AuthResponse, LoginRequest, RegisterRequest } from '@eitacraque/shared';
import { http } from './http';

export const authApi = {
  register: (payload: RegisterRequest) =>
    http.post<AuthResponse>('/auth/register', payload).then((r) => r.data),

  login: (payload: LoginRequest) =>
    http.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  logout: (refreshToken: string) =>
    http.post('/auth/logout', { refreshToken }).then((r) => r.data),
};
