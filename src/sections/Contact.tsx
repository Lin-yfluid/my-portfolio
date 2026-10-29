/** 联系区块 —— 邮箱复制 + 社交链接 + 表单（zod 校验 + Toast 反馈） */
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Copy, Send, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/common/BrandIcons';
import { profileApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import { contactSchema } from '@/api/schemas';
import { toast } from '@/components/common/Toast';
import type { Profile } from '@/api/types';

const socialIcons = { github: GithubIcon, linkedin: LinkedinIcon, twitter: TwitterIcon, email: Mail };

export function Contact() {
  const [profile, setProfile] = useState<Profile>(() => profileApi.get(defaultProfile));
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setProfile(profileApi.get(defaultProfile));
  }, []);

  const copyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success('邮箱已复制到剪贴板');
    } catch {
      toast.error('复制失败，请手动复制');
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error('请检查表单填写');
      return;
    }
    setErrors({});
    setSubmitting(true);
    // 模拟提交（无后端）；真实场景可替换为 Formspree fetch
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: '', email: '', message: '' });
      toast.success('发送成功！我会尽快回复你');
    }, 800);
  };

  const field = (key: keyof typeof form, label: string, type: 'input' | 'textarea' = 'input') => (
    <div>
      <label htmlFor={`contact-${key}`} className="mb-1.5 block text-sm font-medium">
        {label} <span className="text-red-600">*</span>
      </label>
      {type === 'input' ? (
        <input
          id={`contact-${key}`}
          type={key === 'email' ? 'email' : 'text'}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full rounded-lg border border-[var(--rule)] bg-[var(--bg2)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
        />
      ) : (
        <textarea
          id={`contact-${key}`}
          rows={5}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full resize-y rounded-lg border border-[var(--rule)] bg-[var(--bg2)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
        />
      )}
      {errors[key] && (
        <p id={`contact-${key}-error`} className="mt-1 text-xs text-red-600">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <section id="contact" className="scroll-mt-20 py-20">
      <div className="container-site">
        <h2 className="section-title">联系我</h2>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* 左侧：邮箱 + 社交 */}
          <div className="space-y-6">
            <p className="text-[var(--muted)]">
              有合作机会或技术交流？随时联系我，我会尽快回复。
            </p>

            <button
              type="button"
              onClick={copyEmail}
              className="card flex w-full items-center justify-between p-4 text-left"
              aria-label="复制邮箱地址"
            >
              <span className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--accent)]" />
                <span className="text-sm">{profile.email}</span>
              </span>
              <Copy size={16} className="text-[var(--muted)]" />
            </button>

            <div className="flex gap-3">
              {profile.socials.map(s => {
                const Icon = socialIcons[s.platform as keyof typeof socialIcons];
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rule)] text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {Icon ? <Icon size={18} /> : <span className="text-xs">{s.label}</span>}
                  </a>
                );
              })}
            </div>
          </div>

          {/* 右侧：表单 */}
          <form onSubmit={handleSubmit} className="card space-y-4 p-6" noValidate>
            {field('name', '姓名')}
            {field('email', '邮箱')}
            {field('message', '消息', 'textarea')}
            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              <Send size={16} />
              {submitting ? '发送中…' : '发送消息'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
