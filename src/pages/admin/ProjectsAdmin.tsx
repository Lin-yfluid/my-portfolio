/** 项目管理 —— 列表 + 新建/编辑（Markdown）+ 删除（二次确认） */
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { projectsApi } from '@/api/client';
import { defaultProjects } from '@/data/defaultProjects';
import { projectSchema } from '@/api/schemas';
import { toast } from '@/components/common/Toast';
import type { Project } from '@/api/types';

const emptyForm = {
  title: '', slug: '', description: '', cover: '',
  tagsInput: '', githubUrl: '', demoUrl: '',
  date: new Date().toISOString().slice(0, 10), content: '',
};

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setProjects(projectsApi.list(defaultProjects));
  }, []);

  const startEdit = (p: Project): void => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, description: p.description, cover: p.cover,
      tagsInput: p.tags.join(', '), githubUrl: p.githubUrl ?? '', demoUrl: p.demoUrl ?? '',
      date: p.date, content: p.content,
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const payload = {
      title: form.title, slug: form.slug, description: form.description,
      cover: form.cover || 'https://placehold.co/800x450/111827/5B8CFF?text=Project',
      content: form.content,
      tags: form.tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: form.githubUrl, demoUrl: form.demoUrl, date: form.date,
    };
    const parsed = projectSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '请检查输入');
      return;
    }
    const updated = projectsApi.upsert({ ...payload, cover: payload.cover, id: editing?.id ?? '' }, defaultProjects);
    setProjects(updated);
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
    setError('');
    toast.success(editing ? '项目已更新' : '项目已创建');
  };

  const handleDelete = (id: string): void => {
    if (!window.confirm('确定删除该项目？此操作不可恢复。')) return;
    setProjects(projectsApi.remove(id, defaultProjects));
    toast.success('已删除');
  };

  const inputCls = 'w-full rounded-lg border border-[var(--rule)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">项目管理</h1>
        <button type="button" className="btn btn-primary" onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}>
          <Plus size={16} /> 新建项目
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? '编辑项目' : '新建项目'}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[var(--muted)] hover:text-[var(--ink)]" aria-label="关闭表单">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pj-title" className="mb-1 block text-xs text-[var(--muted)]">标题 *</label>
              <input id="pj-title" className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="pj-slug" className="mb-1 block text-xs text-[var(--muted)]">Slug（URL 标识）*</label>
              <input id="pj-slug" className={inputCls} value={form.slug} placeholder="my-project" onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pj-desc" className="mb-1 block text-xs text-[var(--muted)]">一句话描述 *</label>
              <input id="pj-desc" className={inputCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="pj-tags" className="mb-1 block text-xs text-[var(--muted)]">标签（逗号分隔）*</label>
              <input id="pj-tags" className={inputCls} value={form.tagsInput} placeholder="React, TypeScript" onChange={e => setForm(f => ({ ...f, tagsInput: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="pj-date" className="mb-1 block text-xs text-[var(--muted)]">日期 *</label>
              <input id="pj-date" type="date" className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="pj-github" className="mb-1 block text-xs text-[var(--muted)]">GitHub 链接</label>
              <input id="pj-github" className={inputCls} value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="pj-demo" className="mb-1 block text-xs text-[var(--muted)]">演示链接</label>
              <input id="pj-demo" className={inputCls} value={form.demoUrl} onChange={e => setForm(f => ({ ...f, demoUrl: e.target.value }))} />
            </div>
          </div>

          <div>
            <label htmlFor="pj-content" className="mb-1 block text-xs text-[var(--muted)]">详情内容（Markdown）*</label>
            <textarea id="pj-content" rows={10} className={`${inputCls} font-mono`} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> {editing ? '保存修改' : '创建项目'}
          </button>
        </form>
      )}

      <div className="card divide-y divide-[var(--rule)]">
        {projects.map(p => (
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
        {projects.length === 0 && <p className="p-6 text-center text-sm text-[var(--muted)]">暂无项目</p>}
      </div>
    </div>
  );
}
