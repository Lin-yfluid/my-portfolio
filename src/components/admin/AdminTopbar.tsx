/** 后台顶栏 */
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--rule)] bg-[var(--bg2)] px-4 md:px-8">
      <h1 className="text-lg font-semibold">后台管理</h1>
      <Link
        to="/"
        className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
      >
        <ArrowLeft size={16} />
        返回前台
      </Link>
    </header>
  );
}
