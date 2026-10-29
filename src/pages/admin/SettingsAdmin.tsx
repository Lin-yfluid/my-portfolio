/** 站点设置 —— 强调色、站点标题 */
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Save } from 'lucide-react';
import { settingsApi } from '@/api/client';
import { toast } from '@/components/common/Toast';
import type { SiteSettings } from '@/api/types';

const defaultSettings: SiteSettings = {
  accentColor: '#5B8CFF',
  siteTitle: 'Portfolio',
  copyrightYear: new Date().getFullYear(),
};

export function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    setSettings(settingsApi.get(defaultSettings));
  }, []);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    settingsApi.set(settings);
    // 动态应用强调色
    document.documentElement.style.setProperty('--accent', settings.accentColor);
    document.title = `${settings.siteTitle} · 个人展示`;
    toast.success('设置已保存，刷新页面后完全生效');
  };

  const inputCls = 'w-full rounded-lg border border-[var(--rule)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]';

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">站点设置</h1>
      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label htmlFor="st-title" className="mb-1.5 block text-sm font-medium">站点标题</label>
          <input id="st-title" className={inputCls} value={settings.siteTitle} onChange={e => setSettings(s => ({ ...s, siteTitle: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="st-accent" className="mb-1.5 block text-sm font-medium">强调色</label>
          <div className="flex items-center gap-3">
            <input
              id="st-accent"
              type="color"
              value={settings.accentColor}
              onChange={e => setSettings(s => ({ ...s, accentColor: e.target.value }))}
              className="h-10 w-16 cursor-pointer rounded-lg border border-[var(--rule)] bg-transparent"
            />
            <span className="font-mono text-sm text-[var(--muted)]">{settings.accentColor}</span>
          </div>
        </div>
        <div>
          <label htmlFor="st-year" className="mb-1.5 block text-sm font-medium">版权年份</label>
          <input id="st-year" type="number" className={inputCls} value={settings.copyrightYear} onChange={e => setSettings(s => ({ ...s, copyrightYear: Number(e.target.value) }))} />
        </div>
        <button type="submit" className="btn btn-primary">
          <Save size={16} /> 保存设置
        </button>
      </form>
    </div>
  );
}
