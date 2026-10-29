/** 后台侧边栏 */
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Wrench,
  FolderKanban,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const menuItems = [
  { to: '/admin', label: '仪表盘', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: '个人信息', icon: User },
  { to: '/admin/skills', label: '技能管理', icon: Wrench },
  { to: '/admin/projects', label: '项目管理', icon: FolderKanban },
  { to: '/admin/posts', label: '博客管理', icon: FileText },
  { to: '/admin/settings', label: '站点设置', icon: Settings },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore(s => s.logout);

  const handleLogout = (): void => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-[var(--rule)] bg-[var(--bg2)] hidden lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-[var(--rule)] px-6">
        <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
        <span className="font-bold">后台管理</span>
      </div>

      {/* 菜单 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-[var(--accent)] text-white'
                        : 'text-[var(--muted)] hover:bg-[var(--rule)] hover:text-[var(--ink)]',
                    ].join(' ')
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 退出按钮 */}
      <div className="border-t border-[var(--rule)] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--rule)] hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </div>
    </aside>
  );
}
