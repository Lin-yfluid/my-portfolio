/** 路由配置 —— Hash 路由 + 后台守卫 */
import { createHashRouter, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { MainLayout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/home/HomePage';
import { ProjectDetail } from '@/pages/project/ProjectDetail';
import { BlogList } from '@/pages/blog/BlogList';
import { BlogDetail } from '@/pages/blog/BlogDetail';
import { LoginPage } from '@/pages/admin/LoginPage';
import { Dashboard } from '@/pages/admin/Dashboard';
import { ProfileAdmin } from '@/pages/admin/ProfileAdmin';
import { SkillsAdmin } from '@/pages/admin/SkillsAdmin';
import { ProjectsAdmin } from '@/pages/admin/ProjectsAdmin';
import { PostsAdmin } from '@/pages/admin/PostsAdmin';
import { SettingsAdmin } from '@/pages/admin/SettingsAdmin';
import { App } from '@/App';

/** 后台路由守卫 —— 未登录跳转登录页 */
function ProtectedAdmin({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

export const router = createHashRouter([
  {
    path: '/',
    element: (
      <>
        <App />
        <MainLayout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'project/:slug', element: <ProjectDetail /> },
      { path: 'blog', element: <BlogList /> },
      { path: 'blog/:slug', element: <BlogDetail /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      {
        path: '',
        element: <ProtectedAdmin>{<Dashboard />}</ProtectedAdmin>,
      },
      {
        path: 'profile',
        element: <ProtectedAdmin>{<ProfileAdmin />}</ProtectedAdmin>,
      },
      {
        path: 'skills',
        element: <ProtectedAdmin>{<SkillsAdmin />}</ProtectedAdmin>,
      },
      {
        path: 'projects',
        element: <ProtectedAdmin>{<ProjectsAdmin />}</ProtectedAdmin>,
      },
      {
        path: 'posts',
        element: <ProtectedAdmin>{<PostsAdmin />}</ProtectedAdmin>,
      },
      {
        path: 'settings',
        element: <ProtectedAdmin>{<SettingsAdmin />}</ProtectedAdmin>,
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
