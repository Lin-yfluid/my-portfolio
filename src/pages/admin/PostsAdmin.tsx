/** 博客管理 —— 列表 + 新建/编辑（Markdown 实时预览）+ 删除（二次确认） */
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { postsApi } from '@/api/client';
import { postSchema } from '@/api/schemas';
import { toast } from '@/components/common/Toast';
import type { Post } from '@/api/types';

const emptyForm = {
  title: '', slug: '', excerpt: '', tagsInput: '',
  date: new Date().toISOString().slice(0, 10), content: '',
};

export function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPosts(postsApi.list([]).sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const startEdit = (p: Post): void => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt,
      tagsInput: p.tags.join(', '), date: p.date, content: p.content,
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const payload = {
      title: form.title, slug: form.slug, excerpt: form.excerpt,
      date: form.date,
      tags: form.tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      cover: '',
      content: form.content,
    };
    const parsed = postSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '请检查输入');
      return;
    }
    const updated = postsApi.upsert({ ...payload, id: editing?.id ?? '' }, []);
    setPosts(updated.sort((a, b) => b.date.localeCompare(a.date)));
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
    setError('');
    toast.success(editing ? '文章已更新' : '文章已发布');
  };

  const handleDelete = (id: string): void => {
    if (!window.confirm('确定删除该文章？此操作不可恢复。')) return;
    setPosts(postsApi.remove(id, []));
    toast.success('已删除');
  };

  const inputCls = 'w-full rounded-lg border border-[var(--rule)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">博客管理</h1>
        <button type="button" className="btn btn-primary" onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus size={16} /> 写文章
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '编辑文章' : '写文章'}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[var(--muted)] hover:text-[var(--ink)]" aria-label="关闭表单">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="po-title" className="mb-1 block text-xs text-[var(--muted)]">标题 *</label>
              <input id="po-title" className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="po-slug" className="mb-1 block text-xs text-[var(--muted)]">Slug *</label>
              <input id="po-slug" className={inputCls} value={form.slug} placeholder="my-post" onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="po-excerpt" className="mb-1 block text-xs text-[var(--muted)]">摘要 *</label>
              <input id="po-excerpt" className={inputCls} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="po-tags" className="mb-1 block text-xs text-[var(--muted)]">标签（逗号分隔）</label>
              <input id="po-tags" className={inputCls} value={form.tagsInput} placeholder="前端, React" onChange={e => setForm(f => ({ ...f, tagsInput: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="po-date" className="mb-1 block text-xs text-[var(--muted)]">日期 *</label>
              <input id="po-date" type="date" className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>

          {/* Markdown 编辑器 + 实时预览切换 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="po-content" className="block text-xs text-[var(--muted)]">正文（Markdown）*</label>
              <button type="button" className="text-xs text-[var(--accent)] hover:underline" onClick={() => setShowPreview(v => !v)}>
                {showPreview ? '返回编辑' : '预览'}
              </button>
            </div>
            {showPreview ? (
              <div className="markdown-body rounded-lg border border-[var(--rule)] bg-[var(--bg)] p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {form.content || '*暂无内容*'}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea id="po-content" rows={14} className={`${inputCls} font-mono`} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            )}
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> {editing ? '保存修改' : '发布文章'}
          </button>
        </form>
      )}

      <div className="card divide-y divide-[var(--rule)]">
        {posts.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.title}</p>
              <p className="truncate text-xs text-[var(--muted)]">{p.slug} · {p.date}</p>
            </div>
            <button type="button" onClick={() => startEdit(p)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--rule)] hover:text-[var(--accent)]" aria-label={`编辑 ${p.title}`}>
              <Pencil size={16} />
            </button>
            <button type="button" onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--rule)] hover:text-red-600" aria-label={`删除 ${p.title}`}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="p-6 text-center text-sm text-[var(--muted)]">暂无文章</p>}
      </div>
    </div>
  );
}
