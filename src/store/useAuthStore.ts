/** 认证状态 store —— Zustand + persist middleware */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/client';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

// 默认管理员账号 —— 生产环境必须替换为真实后端验证
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  // "admin123" 的 base64（仅模拟，生产用 bcrypt）
  passwordHash: 'YWRtaW46YWRtaW4xMjM=',
};

function hashCredentials(username: string, password: string): string {
  return btoa(`${username}:${password}`);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: authApi.isTokenValid(),
      username: null,

      login: async (username, password) => {
        const hash = hashCredentials(username, password);
        if (hash === DEFAULT_CREDENTIALS.passwordHash && username === DEFAULT_CREDENTIALS.username) {
          const token = {
            token: crypto.randomUUID?.() ?? Math.random().toString(36),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
          };
          authApi.setToken(token);
          set({ isAuthenticated: true, username });
          return true;
        }
        return false;
      },

      logout: () => {
        authApi.clearToken();
        set({ isAuthenticated: false, username: null });
      },

      checkAuth: () => {
        const valid = authApi.isTokenValid();
        set({ isAuthenticated: valid });
      },
    }),
    { name: 'pf_auth' },
  ),
);
