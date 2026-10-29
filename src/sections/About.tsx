/** About —— devfolio 风格：左文右卡（头像+社交+按钮），下方保留经历时间线 */
import { useEffect, useState } from 'react';
import { Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { profileApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/common/BrandIcons';
import type { Profile, TimelineItem } from '@/api/types';

const socialIcons = { github: GithubIcon, linkedin: LinkedinIcon, twitter: TwitterIcon };

function Timeline({ items, icon }: { items: TimelineItem[]; icon: 'work' | 'edu' }) {
  const Icon = icon === 'work' ? Briefcase : GraduationCap;
  return (
    <ol className="relative ml-3 border-l border-[var(--rule)]">
      {items.map(item => (
        <li key={item.id} className="mb-8 ml-8 last:mb-0">
          <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--bg2)] text-[var(--accent)]">
            <Icon size={14} />
          </span>
          <div className="card p-5">
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-semibold text-[var(--ink)]">{item.title}</h4>
              <time className="text-xs text-[var(--muted)]">
                {item.startDate} — {item.endDate ?? '至今'}
              </time>
            </div>
            <p className="mb-2 text-sm text-[var(--accent)]">{item.org}</p>
            <p className="text-sm text-[var(--muted)]">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function About() {
  const [profile, setProfile] = useState<Profile>(() => profileApi.get(defaultProfile));

  useEffect(() => {
    setProfile(profileApi.get(defaultProfile));
  }, []);

  return (
    <section id="about" className="scroll-mt-20 py-20">
      <div className="container-site">
        <h2 className="section-title reveal">关于我</h2>

        {/* 左文右卡 */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="reveal">
            <p className="whitespace-pre-line leading-relaxed text-[var(--muted)]">
              {profile.about}
            </p>
          </div>

          {/* 右侧个人卡 */}
          <div className="reveal reveal-d1">
            <div className="card mx-auto max-w-sm p-8 text-center">
              <div className="mx-auto mb-5 h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--bg2)] accent-glow">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={`${profile.name} 的头像`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-5xl font-bold text-white">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="mb-1 text-xl font-bold">{profile.name}</h3>
              <p className="mb-5 text-sm text-[var(--accent)]">{profile.title}</p>

              <div className="mb-6 flex items-center justify-center gap-3">
                {profile.socials.map(s => {
                  const Icon = socialIcons[s.platform as keyof typeof socialIcons];
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--rule)] text-[var(--muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {Icon ? <Icon size={16} /> : <span className="text-xs">{s.label}</span>}
                    </a>
                  );
                })}
              </div>

              <a href="#projects" className="btn btn-primary w-full">
                View My Work <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* 经历时间线 */}
        <div className="mt-16">
          <div className="reveal">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <Briefcase size={18} className="text-[var(--accent)]" /> 工作经历
            </h3>
            <Timeline items={profile.experiences} icon="work" />
          </div>
        </div>
      </div>
    </section>
  );
}
