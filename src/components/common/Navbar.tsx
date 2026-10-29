/** 吸顶毛玻璃导航 */
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrolled } from '@/hooks/useScroll';
import { profileApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import type { Profile } from '@/api/types';

const navItems = [
  { label: '首页', to: '/' },
  { label: '关于', to: '/#about' },
  { label: '技能', to: '/#skills' },
  { label: '项目', to: '/#projects' },
  { label: '博客', to: '/blog' },
  { label: '联系', to: '/#contact' },
];

export function Navbar() {
  const scrolled = useScrolled(20);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>(() =>
    profileApi.get(defaultProfile),
  );

  useEffect(() => {
    setProfile(profileApi.get(defaultProfile));
  }, []);

  const handleNavClick = (to: string): void => {
    setMobileOpen(false);
    if (to.startsWith('/#')) {
      // 锚点滚动
      navigate('/');
      const id = to.slice(2);
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      navigate(to);
    }
  };

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass shadow-lg shadow-black/5'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="container-site flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2 text-lg font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
        >
          <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] accent-glow" />
          <span>{profile.name}</span>
        </button>

        {/* 桌面端导航 */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map(item => {
            const isHashLink = item.to.startsWith('/#');
            const isActive = !isHashLink && window.location.hash.startsWith(`#${item.to}`);
            return (
              <li key={item.to}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.to)}
                  className={[
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* 移动端汉堡 */}
        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-[var(--ink)] hover:bg-[var(--rule)]"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* 移动端菜单 */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-[var(--rule)]">
          <ul className="container-site flex flex-col py-4 gap-1">
            {navItems.map(item => (
              <li key={item.to}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.to)}
                  className="w-full rounded-lg px-4 py-3 text-left text-[var(--ink)] hover:bg-[var(--rule)]"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

// NavLink 避免未使用警告
export const _navLink = NavLink;
