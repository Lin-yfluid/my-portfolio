/** Education —— devfolio 风格：居中教育卡片 */
import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { profileApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import type { Profile } from '@/api/types';

export function Education() {
  const [profile, setProfile] = useState<Profile>(() => profileApi.get(defaultProfile));

  useEffect(() => {
    setProfile(profileApi.get(defaultProfile));
  }, []);

  return (
    <section id="education" className="scroll-mt-20 py-20">
      <div className="container-site">
        <h2 className="section-title reveal">教育背景</h2>

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {profile.education.map((edu, i) => (
            <div key={edu.id} className={`reveal ${i === 1 ? 'reveal-d1' : ''}`}>
              <div className="card h-full p-7 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--accent)]">
                  <GraduationCap size={26} />
                </span>
                <h3 className="mb-1 text-lg font-bold">{edu.title}</h3>
                <p className="mb-3 text-sm font-medium text-[var(--accent)]">{edu.org}</p>
                <p className="mb-4 text-xs text-[var(--muted)]">
                  {edu.startDate} — {edu.endDate ?? '至今'}
                </p>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
