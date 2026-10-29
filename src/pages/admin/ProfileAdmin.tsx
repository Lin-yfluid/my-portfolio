/** 个人信息管理 */
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Save } from 'lucide-react';
import { profileApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import { toast } from '@/components/common/Toast';
import type { Profile } from '@/api/types';

export function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile>(() => profileApi.get(defaultProfile));

  useEffect(() => {
    setProfile(profileApi.get(defaultProfile));
  }, []);

  const update = (key: keyof Profile, value: string): void => {
    setProfile(p => ({ ...p, [key]: value }));
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    profileApi.set(profile);
    toast.success('个人信息已保存');
  };

  const inputCls = 'w-full rounded-lg border border-[var(--rule)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]';

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">个人信息</h1>
      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label htmlFor="p-name" className="mb-1.5 block text-sm font-medium">姓名</label>
          <input id="p-name" className={inputCls} value={profile.name} onChange={e => update('name', e.target.value)} />
        </div>
        <div>
          <label htmlFor="p-title" className="mb-1.5 block text-sm font-medium">职位</label>
          <input id="p-title" className={inputCls} value={profile.title} onChange={e => update('title', e.target.value)} />
        </div>
        <div>
          <label htmlFor="p-bio" className="mb-1.5 block text-sm font-medium">一句话介绍</label>
          <input id="p-bio" className={inputCls} value={profile.bio} onChange={e => update('bio', e.target.value)} />
        </div>
        <div>
          <label htmlFor="p-email" className="mb-1.5 block text-sm font-medium">邮箱</label>
          <input id="p-email" type="email" className={inputCls} value={profile.email} onChange={e => update('email', e.target.value)} />
        </div>
        <div>
          <label htmlFor="p-about" className="mb-1.5 block text-sm font-medium">详细介绍</label>
          <textarea id="p-about" rows={5} className={inputCls} value={profile.about} onChange={e => update('about', e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">
          <Save size={16} /> 保存
        </button>
      </form>
    </div>
  );
}
