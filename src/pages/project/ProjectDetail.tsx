/** 项目详情页 —— Markdown 渲染 + 外链 */
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/common/BrandIcons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { projectsApi } from '@/api/client';
import { defaultProjects } from '@/data/defaultProjects';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsApi.getBySlug(slug, defaultProjects) : undefined;

  if (!project) return <Navigate to="/" replace />;

  return (
    <article className="container-site py-16">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={16} /> 返回首页
      </Link>

      <header className="mb-10">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{project.title}</h1>
        <p className="mb-4 text-[var(--muted)]">{project.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <time className="text-sm text-[var(--muted)]">{project.date}</time>
          {project.tags.map(tag => (
            <span key={tag} className="rounded-full border border-[var(--rule)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <GithubIcon size={16} /> 源码
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <ExternalLink size={16} /> 在线演示
            </a>
          )}
        </div>
      </header>

      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {project.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
