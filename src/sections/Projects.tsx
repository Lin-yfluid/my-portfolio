/** Projects —— devfolio 风格：交替左右大卡片（图/文互换），滚动入场 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/common/BrandIcons';
import { projectsApi } from '@/api/client';
import { defaultProjects } from '@/data/defaultProjects';
import type { Project } from '@/api/types';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(() => projectsApi.list(defaultProjects));
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(projectsApi.list(defaultProjects));
  }, []);

  return (
    <section id="projects" className="scroll-mt-20 py-20">
      <div className="container-site">
        <h2 className="section-title reveal">项目展示</h2>

        <div className="space-y-14">
          {projects.map((p, i) => {
            const flip = i % 2 === 1; // 奇数项图文互换
            return (
              <div
                key={p.id}
                className={`reveal ${i % 2 === 1 ? 'reveal-d1' : ''}`}
              >
                <div className="card group grid overflow-hidden md:grid-cols-2">
                  {/* 封面区 */}
                  <div
                    className={`relative flex min-h-56 items-center justify-center bg-gradient-to-br from-[var(--surface)] to-[var(--bg2)] ${flip ? 'md:order-2' : ''}`}
                  >
                    {p.cover ? (
                      <img src={p.cover} alt={`${p.title} 封面`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <FolderKanban size={56} className="text-[var(--accent)] opacity-70 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                    )}
                    {/* 序号水印 */}
                    <span className="absolute bottom-3 right-4 font-mono text-5xl font-bold text-[var(--accent)] opacity-10" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* 文字区 */}
                  <div className={`p-7 md:p-9 ${flip ? 'md:order-1' : ''}`}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                      精选项目 · {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3
                      className="mb-3 cursor-pointer text-xl font-bold transition-colors group-hover:text-[var(--accent)] md:text-2xl"
                      onClick={() => navigate(`/project/${p.slug}`)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/project/${p.slug}`); } }}
                      tabIndex={0}
                      role="link"
                      aria-label={`查看项目详情 ${p.title}`}
                    >
                      {p.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>

                    {/* 技术标签流 */}
                    <div className="mb-6 flex flex-wrap gap-2">
                      {p.tags.map(tag => (
                        <span key={tag} className="rounded-full bg-[var(--surface)] px-3 py-1 font-mono text-xs text-[var(--muted)]">
                          {tag} +
                        </span>
                      ))}
                    </div>

                    {/* 按钮组 */}
                    <div className="flex flex-wrap gap-3">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline !py-2 !text-xs" onClick={e => e.stopPropagation()}>
                          <GithubIcon size={14} /> 源码
                        </a>
                      )}
                      {p.demoUrl && (
                        <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline !py-2 !text-xs">
                          在线演示
                        </a>
                      )}
                      <button type="button" className="btn btn-primary !py-2 !text-xs" onClick={() => navigate(`/project/${p.slug}`)}>
                        查看详情 <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
