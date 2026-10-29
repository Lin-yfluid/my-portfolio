/** 博客列表页 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '@/api/client';
import type { Post } from '@/api/types';

export function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(postsApi.list([]).sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  return (
    <div className="container-site py-16">
      <h1 className="section-title">博客</h1>

      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">暂无文章</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(p => (
            <li key={p.id}>
              <Link to={`/blog/${p.slug}`} className="card block p-6 hover:no-underline">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold text-[var(--ink)]">{p.title}</h2>
                  <time className="text-xs text-[var(--muted)]">{p.date}</time>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">{p.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-[var(--rule)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
