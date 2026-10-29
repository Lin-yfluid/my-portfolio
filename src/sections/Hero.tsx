/** Hero —— devfolio 风格：大标题问候 + 技能徽章条 + 双 CTA + 社交行 */
import { useEffect, useState } from 'react';
import { Mail, FileDown, ArrowRight } from 'lucide-react';
import { profileApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/common/BrandIcons';
import type { Profile } from '@/api/types';

const socialIcons = { github: GithubIcon, linkedin: LinkedinIcon, twitter: TwitterIcon };

function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Hero() {
  const [profile, setProfile] = useState<Profile>(() => profileApi.get(defaultProfile));

  useEffect(() => {
    setProfile(profileApi.get(defaultProfile));
  }, []);

  const badges = ['Unity 3D', 'Blender', 'VR 虚拟展馆', 'Vue 3', '大模型微调', '物联网工程'];

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center">
      <div className="container-site py-24 text-center">
        {/* 问候大标题 */}
        <p className="reveal reveal-d1 mb-4 text-lg font-medium text-[var(--accent)]">
          你好，欢迎来到我的数字花园 🌱
        </p>
        <h1 className="reveal reveal-d1 mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          你好，我是 <span className="accent-text">{profile.name}</span> 👋
        </h1>

        {/* 徽章条：职位与关键词胶囊 */}
        <div className="reveal reveal-d2 mb-8 flex flex-wrap items-center justify-center gap-2.5">
          {badges.map(b => (
            <span key={b} className="badge">{b}</span>
          ))}
        </div>

        <p className="reveal reveal-d2 mx-auto mb-10 max-w-2xl text-[var(--muted)] md:text-lg">
          {profile.bio}。热爱把想法变成产品，也乐于分享一路踩坑的经验。
        </p>

        {/* CTA */}
        <div className="reveal reveal-d3 mb-12 flex flex-wrap items-center justify-center gap-4">
          <button type="button" className="btn btn-primary" onClick={() => scrollTo('contact')}>
            <Mail size={18} /> 联系我 →
          </button>
          <a className="btn btn-outline" href="/assets/resume.pdf" download>
            <FileDown size={18} /> 下载简历 →
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => scrollTo('projects')}>
            看看我的作品 <ArrowRight size={16} />
          </button>
        </div>

        {/* 社交图标行 */}
        <div className="reveal reveal-d3 flex items-center justify-center gap-4">
          {profile.socials.map(s => {
            const Icon = socialIcons[s.platform as keyof typeof socialIcons];
            return (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--bg2)] text-[var(--muted)] transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {Icon ? <Icon size={18} /> : <span className="text-xs">{s.label}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
