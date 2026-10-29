/** 博客区块（首页展示最新 3 篇 + 查看全部入口） */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { postsApi } from '@/api/client';
import type { Post } from '@/api/types';

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const list = postsApi.list([]).sort((a, b) => b.date.localeCompare(a.date));
    setPosts(list.slice(0, 3));
  }, []);

  return (
    <section id="blog" className="scroll-mt-20 py-20">
      <div className="container-site">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="section-title !mb-0">博客</h2>
          <Link to="/blog" className="flex items-center gap-1 text-sm text-[var(--accent)] hover:underline">
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(p => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="card block p-6 hover:no-underline">
              <time className="text-xs text-[var(--muted)]">{p.date}</time>
              <h3 className="mt-2 mb-2 font-semibold text-[var(--ink)]">{p.title}</h3>
              <p className="mb-4 text-sm text-[var(--muted)] line-clamp-3">{p.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-[var(--rule)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
