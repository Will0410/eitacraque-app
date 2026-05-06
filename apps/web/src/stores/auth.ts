import { defineStore } from 'pinia';
import type { User, AuthTokens, LoginRequest, RegisterRequest } from '@eitacraque/shared';
import { authApi } from '@/api/auth';
import { tokenStorage } from '@/api/http';

interface State {
  user: User | null;
  ready: boolean;
}

const USER_KEY = 'ec.user';

export const useAuthStore = defineStore('auth', {
  state: (): State => ({ user: null, ready: false }),

  getters: {
    isAuthenticated: (s) => !!s.user,
    token: (s) => tokenStorage.access,
  },

  actions: {
    hydrate() {
      if (this.ready) return;
      const raw = localStorage.getItem(USER_KEY);
      if (raw && tokenStorage.access) {
        try {
          this.user = JSON.parse(raw);
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }
      this.ready = true;
    },

    async login(payload: LoginRequest) {
      const data = await authApi.login(payload);
      this.persist(data);
    },

    async register(payload: RegisterRequest) {
      const data = await authApi.register(payload);
      this.persist(data);
    },

    async logout() {
      const refresh = tokenStorage.refresh;
      if (refresh) {
        await authApi.logout(refresh).catch(() => undefined);
      }
      this.user = null;
      tokenStorage.clear();
      localStorage.removeItem(USER_KEY);
    },

    persist({ user, tokens }: { user: User; tokens: AuthTokens }) {
      this.user = user;
      tokenStorage.set(tokens.accessToken, tokens.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
  },
});
