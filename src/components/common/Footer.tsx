/** 页脚 */
import { useEffect, useState } from 'react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/common/BrandIcons';
import { profileApi, settingsApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import type { Profile, SiteSettings } from '@/api/types';

const iconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
};

export function Footer() {
  const [profile, setProfile] = useState<Profile>(() => profileApi.get(defaultProfile));
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setProfile(profileApi.get(defaultProfile));
    setSettings(settingsApi.get({
      accentColor: '#5B8CFF',
      siteTitle: 'Portfolio',
      copyrightYear: new Date().getFullYear(),
    }));
  }, []);

  return (
    <footer className="relative z-10 border-t border-[var(--rule)] mt-20 py-12">
      <div className="container-site flex flex-col items-center gap-6">
        {/* 社交链接 */}
        <div className="flex items-center gap-4">
          {profile.socials.map((s, i) => {
            const Icon = iconMap[s.platform as keyof typeof iconMap];
            if (!Icon) return null;
            return (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="rounded-full p-3 border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        {/* 版权 */}
        <p className="text-sm text-[var(--muted)]">
          © {settings?.copyrightYear ?? new Date().getFullYear()} {settings?.siteTitle ?? 'Portfolio'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
