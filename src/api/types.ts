/** 所有数据类型定义 —— 前后台共享 */

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'wechat' | 'email' | 'custom';
  url: string;
  label: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  org: string;
  startDate: string; // YYYY-MM
  endDate: string | null; // null 表示至今
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  about: string;
  email: string;
  socials: SocialLink[];
  experiences: TimelineItem[];
  education: TimelineItem[];
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  icon: string;
  level: 1 | 2 | 3; // 1=熟悉 2=掌握 3=精通
  desc?: string; // 一句话描述（前台展示用）
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  content: string; // Markdown
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  date: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  cover?: string;
  content: string; // Markdown
}

export interface SiteSettings {
  accentColor: string;
  siteTitle: string;
  copyrightYear: number;
}

export interface AdminUser {
  username: string;
  // 密码存 hash（模拟），不存明文
  passwordHash: string;
}

export interface AuthToken {
  token: string;
  expiresAt: number; // timestamp ms
}
