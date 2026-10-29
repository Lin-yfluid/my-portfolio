/** 统一 API 客户端 —— localStorage 实现，可替换 */
import type { Profile, Skill, Project, Post, SiteSettings, AuthToken } from './types';

const PREFIX = 'pf_';

function genId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
}

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

function remove(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

/** 首次初始化 —— 仅当 key 不存在时写入默认值 */
function init<T>(key: string, value: T): void {
  if (!localStorage.getItem(PREFIX + key)) set(key, value);
}

// ========== Profile ==========
export const profileApi = {
  get: (fallback: Profile): Profile => get<Profile>('profile', fallback),
  set: (data: Profile) => set('profile', data),
  init: (data: Profile) => init('profile', data),
};

// ========== Skills ==========
export const skillsApi = {
  list: (fallback: Skill[]): Skill[] => get<Skill[]>('skills', fallback),
  init: (data: Skill[]) => init('skills', data),
  setAll: (data: Skill[]) => set('skills', data),
  upsert: (item: Skill, fallback: Skill[]): Skill[] => {
    const list = skillsApi.list(fallback);
    const idx = list.findIndex(s => s.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push({ ...item, id: item.id || genId() });
    set('skills', list);
    return list;
  },
  remove: (id: string, fallback: Skill[]): Skill[] => {
    const list = skillsApi.list(fallback).filter(s => s.id !== id);
    set('skills', list);
    return list;
  },
};

// ========== Projects ==========
export const projectsApi = {
  list: (fallback: Project[]): Project[] => get<Project[]>('projects', fallback),
  init: (data: Project[]) => init('projects', data),
  setAll: (data: Project[]) => set('projects', data),
  getBySlug: (slug: string, fallback: Project[]): Project | undefined =>
    projectsApi.list(fallback).find(p => p.slug === slug),
  upsert: (item: Project, fallback: Project[]): Project[] => {
    const list = projectsApi.list(fallback);
    const idx = list.findIndex(p => p.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push({ ...item, id: item.id || genId() });
    set('projects', list);
    return list;
  },
  remove: (id: string, fallback: Project[]): Project[] => {
    const list = projectsApi.list(fallback).filter(p => p.id !== id);
    set('projects', list);
    return list;
  },
};

// ========== Posts ==========
export const postsApi = {
  list: (fallback: Post[]): Post[] => get<Post[]>('posts', fallback),
  init: (data: Post[]) => init('posts', data),
  setAll: (data: Post[]) => set('posts', data),
  getBySlug: (slug: string, fallback: Post[]): Post | undefined =>
    postsApi.list(fallback).find(p => p.slug === slug),
  upsert: (item: Post, fallback: Post[]): Post[] => {
    const list = postsApi.list(fallback);
    const idx = list.findIndex(p => p.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push({ ...item, id: item.id || genId() });
    set('posts', list);
    return list;
  },
  remove: (id: string, fallback: Post[]): Post[] => {
    const list = postsApi.list(fallback).filter(p => p.id !== id);
    set('posts', list);
    return list;
  },
};

// ========== Settings ==========
export const settingsApi = {
  get: (fallback: SiteSettings): SiteSettings => get<SiteSettings>('settings', fallback),
  set: (data: SiteSettings) => set('settings', data),
  init: (data: SiteSettings) => init('settings', data),
};

// ========== Auth ==========
export const authApi = {
  getToken: (): AuthToken | null => {
    const raw = localStorage.getItem(PREFIX + 'token');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthToken;
    } catch {
      return null;
    }
  },
  setToken: (token: AuthToken): void => set('token', token),
  clearToken: (): void => remove('token'),
  isTokenValid: (): boolean => {
    const t = authApi.getToken();
    return !!t && t.expiresAt > Date.now();
  },
};
