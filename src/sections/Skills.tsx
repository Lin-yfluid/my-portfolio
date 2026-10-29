/** Skills —— 分类卡片网格：统计条 + 分类卡（图标 + 描述 + 熟练度进度条） */
import { useEffect, useState } from 'react';
import {
  Atom, Code, Palette, Layers, Server, Braces, GitBranch, Box, PenTool, Wrench,
  Database, Cloud, Terminal, Globe, Smartphone, Zap, Cpu, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { skillsApi } from '@/api/client';
import { defaultSkills } from '@/data/defaultSkills';
import type { Skill } from '@/api/types';

const iconMap: Record<string, LucideIcon> = {
  atom: Atom, code: Code, palette: Palette, layers: Layers, server: Server,
  braces: Braces, 'git-branch': GitBranch, box: Box, 'pen-tool': PenTool,
  database: Database, cloud: Cloud, terminal: Terminal, globe: Globe,
  smartphone: Smartphone, zap: Zap, cpu: Cpu,
};

const levelLabels = ['', '熟悉', '掌握', '精通'] as const;
const levelPct: Record<number, string> = { 1: '40%', 2: '70%', 3: '95%' };

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>(() => skillsApi.list(defaultSkills));

  useEffect(() => {
    setSkills(skillsApi.list(defaultSkills));
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const stats = [
    { num: `${skills.length}`, label: '项技能' },
    { num: `${Object.keys(grouped).length}`, label: '大方向' },
    { num: '6', label: '年实战' },
  ];

  return (
    <section id="skills" className="scroll-mt-20 py-20">
      <div className="container-site">
        <h2 className="section-title reveal">技能与技术</h2>

        {/* 统计条 */}
        <div className="reveal mb-10 grid grid-cols-3 gap-4 sm:max-w-lg">
          {stats.map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-3xl font-extrabold text-[var(--accent)]">{s.num}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 分类卡片网格 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([category, list], gi) => (
            <div key={category} className={`reveal ${['', 'reveal-d1', 'reveal-d2'][gi % 3]}`}>
              <div className="card h-full p-6">
                {/* 卡头 */}
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="flex items-center gap-2.5 font-bold">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)]">
                      <Wrench size={16} />
                    </span>
                    {category}
                  </h3>
                  <span className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                    {list.length} 项
                  </span>
                </div>

                {/* 技能条目 */}
                <ul className="space-y-4">
                  {list.map(skill => {
                    const Icon = iconMap[skill.icon] ?? Code;
                    return (
                      <li key={skill.id} className="group/item">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--rule)] text-[var(--accent)] transition-colors group-hover/item:bg-[var(--accent)] group-hover/item:text-white">
                            <Icon size={14} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="truncate text-sm font-semibold">{skill.name}</p>
                              <span className="shrink-0 text-xs text-[var(--muted)]">{levelLabels[skill.level]}</span>
                            </div>
                            {skill.desc && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">{skill.desc}</p>
                            )}
                            {/* 熟练度进度条 */}
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--rule)]" role="img" aria-label={`${skill.name} 熟练度 ${levelLabels[skill.level]}`}>
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-[width] duration-700"
                                style={{ width: levelPct[skill.level] ?? '50%' }}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 底部注脚 */}
        <p className="reveal mt-8 flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
          <Sparkles size={14} className="text-[var(--accent)]" />
          持续学习中：目前正深入 AI 应用工程与大模型集成
        </p>
      </div>
    </section>
  );
}
