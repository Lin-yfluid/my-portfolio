/** 前台主布局 —— 星空背景 + 导航 + Footer + Outlet */
import { Outlet } from 'react-router-dom';
import { StarField } from '@/components/common/StarField';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ToastHost } from '@/components/common/Toast';

export function MainLayout() {
  return (
    <div className="relative min-h-screen">
      {/* 星空背景 —— fixed 定位，不占布局 */}
      <StarField />

      {/* 导航 */}
      <Navbar />

      {/* 主内容 */}
      <main className="relative z-10 pt-16">
        <Outlet />
      </main>

      {/* 页脚 */}
      <Footer />

      {/* 全局 Toast */}
      <ToastHost />
    </div>
  );
}
