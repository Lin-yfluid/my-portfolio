/** zod 校验 schema —— 前后台表单共享 */
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名').max(32),
  password: z.string().min(1, '请输入密码').max(64),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const contactSchema = z.object({
  name: z.string().min(1, '请输入姓名').max(50),
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  message: z.string().min(1, '请输入消息内容').max(1000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const skillSchema = z.object({
  category: z.string().min(1, '请输入分类'),
  name: z.string().min(1, '请输入技能名称').max(50),
  icon: z.string().min(1, '请选择图标'),
  level: z.number().int().min(1).max(3),
});
export type SkillInput = z.infer<typeof skillSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, '请输入标题').max(100),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug 只能含小写字母、数字、-'),
  description: z.string().min(1).max(200),
  cover: z.string().url('请输入有效图片 URL'),
  content: z.string().min(1, '请输入 Markdown 内容'),
  tags: z.array(z.string().min(1)).min(1, '至少一个标签'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式 YYYY-MM-DD'),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const postSchema = z.object({
  title: z.string().min(1, '请输入标题').max(100),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug 只能含小写字母、数字、-'),
  excerpt: z.string().min(1).max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式 YYYY-MM-DD'),
  tags: z.array(z.string().min(1)),
  cover: z.string().url().optional().or(z.literal('')),
  content: z.string().min(1, '请输入 Markdown 内容'),
});
export type PostInput = z.infer<typeof postSchema>;
