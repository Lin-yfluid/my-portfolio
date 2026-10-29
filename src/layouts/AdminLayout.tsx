/** 后台管理布局 —— 侧边栏 + 顶栏 + Outlet */
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { ToastHost } from '@/components/common/Toast';

export function AdminLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const path = window.location.hash;
  const isLoginPage = path.includes('/admin/login');

  // 登录页不需要侧边栏和顶栏
  if (isLoginPage) {
    return <Outlet />;
  }

  // 未登录访问非登录页 → 跳转
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  );
}
