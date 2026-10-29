/** 技能管理 —— 增删改 */
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { skillsApi } from '@/api/client';
import { defaultSkills } from '@/data/defaultSkills';
import { skillSchema } from '@/api/schemas';
import { toast } from '@/components/common/Toast';
import type { Skill } from '@/api/types';

const emptySkill: Omit<Skill, 'id'> = { category: '', name: '', icon: 'code', level: 2 };
const iconOptions = ['code', 'atom', 'palette', 'layers', 'server', 'braces', 'git-branch', 'box', 'pen-tool', 'database', 'cloud', 'terminal', 'globe', 'smartphone', 'zap', 'cpu'];

export function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(emptySkill);
  const [error, setError] = useState('');

  useEffect(() => {
    setSkills(skillsApi.list(defaultSkills));
  }, []);

  const startEdit = (s: Skill): void => {
    setEditing(s);
    setForm({ category: s.category, name: s.name, icon: s.icon, level: s.level });
    setError('');
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const parsed = skillSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '请检查输入');
      return;
    }
    const updated = skillsApi.upsert({ ...form, id: editing?.id ?? '' }, defaultSkills);
    setSkills(updated);
    setEditing(null);
    setForm(emptySkill);
    setError('');
    toast.success(editing ? '技能已更新' : '技能已添加');
  };

  const handleDelete = (id: string): void => {
    if (!window.confirm('确定删除该技能？此操作不可恢复。')) return;
    setSkills(skillsApi.remove(id, defaultSkills));
    toast.success('已删除');
  };

  const inputCls = 'w-full rounded-lg border border-[var(--rule)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]';

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">技能管理</h1>

      {/* 编辑/新增表单 */}
      <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-5">
        <h2 className="font-semibold">{editing ? '编辑技能' : '新增技能'}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="sk-cat" className="mb-1 block text-xs text-[var(--muted)]">分类</label>
            <input id="sk-cat" className={inputCls} value={form.category} placeholder="如：前端" onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="sk-name" className="mb-1 block text-xs text-[var(--muted)]">名称</label>
            <input id="sk-name" className={inputCls} value={form.name} placeholder="如：React" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="sk-icon" className="mb-1 block text-xs text-[var(--muted)]">图标</label>
            <select id="sk-icon" className={inputCls} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
              {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sk-level" className="mb-1 block text-xs text-[var(--muted)]">熟练度</label>
            <select id="sk-level" className={inputCls} value={form.level} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) as 1 | 2 | 3 }))}>
              <option value={1}>熟悉</option>
              <option value={2}>掌握</option>
              <option value={3}>精通</option>
            </select>
          </div>
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editing ? <Save size={16} /> : <Plus size={16} />}
            {editing ? '保存修改' : '添加'}
          </button>
          {editing && (
            <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm(emptySkill); }}>
              <X size={16} /> 取消
            </button>
          )}
        </div>
      </form>

      {/* 列表 */}
      <div className="card divide-y divide-[var(--rule)]">
        {skills.map(s => (
          <div key={s.id} className="flex items-center gap-4 p-4">
            <span className="rounded bg-[var(--rule)] px-2 py-0.5 text-xs text-[var(--muted)]">{s.category}</span>
            <span className="flex-1 font-medium">{s.name}</span>
            <span className="text-xs text-[var(--muted)]">{['', '熟悉', '掌握', '精通'][s.level]}</span>
            <button type="button" onClick={() => startEdit(s)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--rule)] hover:text-[var(--accent)]" aria-label={`编辑 ${s.name}`}>
              <Pencil size={16} />
            </button>
            <button type="button" onClick={() => handleDelete(s.id)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--rule)] hover:text-red-600" aria-label={`删除 ${s.name}`}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {skills.length === 0 && <p className="p-6 text-center text-sm text-[var(--muted)]">暂无技能，点击上方添加</p>}
      </div>
    </div>
  );
}
