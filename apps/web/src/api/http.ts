import axios, { AxiosError } from 'axios';

const ACCESS_KEY = 'ec.accessToken';
const REFRESH_KEY = 'ec.refreshToken';

export const tokenStorage = {
  get access() { return localStorage.getItem(ACCESS_KEY); },
  get refresh() { return localStorage.getItem(REFRESH_KEY); },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? 'http://localhost:3333'}/api/v1`,
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.access;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as (typeof err.config & { _retried?: boolean }) | undefined;
    if (err.response?.status === 401 && original && !original._retried && tokenStorage.refresh) {
      original._retried = true;
      refreshing ??= refreshAccessToken().finally(() => {
        refreshing = null;
      });
      const fresh = await refreshing;
      if (fresh) {
        original.headers!.Authorization = `Bearer ${fresh}`;
        return http(original);
      }
    }
    throw err;
  },
);

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post(`${http.defaults.baseURL}/auth/refresh`, {
      refreshToken: tokenStorage.refresh,
    });
    tokenStorage.set(res.data.accessToken, res.data.refreshToken);
    return res.data.accessToken;
  } catch {
    tokenStorage.clear();
    return null;
  }
}
