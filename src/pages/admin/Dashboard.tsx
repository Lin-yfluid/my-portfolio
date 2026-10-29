/** 后台仪表盘 —— 内容统计概览 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Wrench, FolderKanban, FileText } from 'lucide-react';
import { skillsApi, projectsApi, postsApi, profileApi } from '@/api/client';
import { defaultSkills } from '@/data/defaultSkills';
import { defaultProjects } from '@/data/defaultProjects';
import { defaultProfile } from '@/data/defaultProfile';

export function Dashboard() {
  const [stats, setStats] = useState({ skills: 0, projects: 0, posts: 0, name: '' });

  useEffect(() => {
    setStats({
      skills: skillsApi.list(defaultSkills).length,
      projects: projectsApi.list(defaultProjects).length,
      posts: postsApi.list([]).length,
      name: profileApi.get(defaultProfile).name,
    });
  }, []);

  const cards = [
    { label: '技能', count: stats.skills, icon: Wrench, to: '/admin/skills' },
    { label: '项目', count: stats.projects, icon: FolderKanban, to: '/admin/projects' },
    { label: '博客文章', count: stats.posts, icon: FileText, to: '/admin/posts' },
    { label: '个人信息', count: null, icon: User, to: '/admin/profile' },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">欢迎回来，{stats.name}</h1>
      <p className="mb-8 text-sm text-[var(--muted)]">这里是站点内容的统计概览</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to} className="card p-6 hover:no-underline">
              <Icon size={24} className="mb-3 text-[var(--accent)]" />
              <p className="text-3xl font-bold text-[var(--ink)]">{c.count ?? '—'}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{c.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
