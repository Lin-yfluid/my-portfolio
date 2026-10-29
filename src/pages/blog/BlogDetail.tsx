/** 博客详情页 —— Markdown 渲染 + 代码高亮 + 自动 TOC */
import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { postsApi } from '@/api/client';

interface TocItem { level: number; text: string; id: string }

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w一-龥]+/g, '-').replace(/^-+|-+$/g, '');
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postsApi.getBySlug(slug, []) : undefined;

  // 从 Markdown 提取 H2/H3 生成 TOC
  const toc = useMemo<TocItem[]>(() => {
    if (!post) return [];
    const items: TocItem[] = [];
    for (const line of post.content.split('\n')) {
      const m = line.match(/^(#{2,3})\s+(.+)$/);
      const level = m?.[1];
      const text = m?.[2];
      if (level && text) items.push({ level: level.length, text: text.trim(), id: slugify(text.trim()) });
    }
    return items;
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="container-site py-16">
      <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={16} /> 返回博客列表
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
        <article>
          <header className="mb-8">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <time>{post.date}</time>
              {post.tags.map(tag => (
                <span key={tag} className="rounded-full bg-[var(--rule)] px-2.5 py-0.5 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  return <h2 id={slugify(text)}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const text = String(children);
                  return <h3 id={slugify(text)}>{children}</h3>;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* TOC */}
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-24 rounded-xl border border-[var(--rule)] bg-[var(--bg2)] p-4" aria-label="文章目录">
              <p className="mb-3 text-sm font-semibold">目录</p>
              <ul className="space-y-1.5 text-sm">
                {toc.map(item => (
                  <li key={item.id} style={{ paddingLeft: item.level === 3 ? '1rem' : 0 }}>
                    <a
                      href={`#${item.id}`}
                      className="text-[var(--muted)] hover:text-[var(--accent)]"
                      onClick={e => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
