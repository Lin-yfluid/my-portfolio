/** 默认 Skills 数据 —— 4 大分类 18 项技能（分类名用英文） */
import type { Skill } from '@/api/types';

export const defaultSkills: Skill[] = [
  // Frontend & Development
  { id: 'sk-1', category: '前端与开发', name: 'Vue 3', icon: 'layers', level: 2, desc: '组合式 API，简历网站与后台页面开发' },
  { id: 'sk-2', category: '前端与开发', name: 'Vite', icon: 'cpu', level: 2, desc: '项目构建、打包产物与静态部署' },
  { id: 'sk-3', category: '前端与开发', name: 'HTML / CSS / JS', icon: 'code', level: 2, desc: '页面布局、响应式与交互实现' },
  { id: 'sk-4', category: '前端与开发', name: 'Python', icon: 'terminal', level: 2, desc: '训练脚本、数据处理与接口联调' },
  { id: 'sk-5', category: '前端与开发', name: 'MySQL', icon: 'database', level: 2, desc: '建库建表、关系设计与查询优化' },
  // VR & 3D Modeling
  { id: 'sk-6', category: 'VR 与三维建模', name: 'Unity 3D', icon: 'box', level: 3, desc: '虚拟展馆场景搭建、灯光与漫游交互' },
  { id: 'sk-7', category: 'VR 与三维建模', name: 'C# Scripting', icon: 'braces', level: 2, desc: '第一人称漫游、展品点选与讲解逻辑' },
  { id: 'sk-8', category: 'VR 与三维建模', name: 'Blender Modeling', icon: 'pen-tool', level: 3, desc: '文物纹样、展品三维建模与 UV 展开' },
  { id: 'sk-9', category: 'VR 与三维建模', name: 'Material & Rendering', icon: 'palette', level: 2, desc: '纹样贴图、PBR 材质与场景布光' },
  { id: 'sk-10', category: 'VR 与三维建模', name: 'Model Optimization', icon: 'zap', level: 2, desc: '减面与贴图压缩，保障引擎内流畅' },
  // Core Fundamentals
  { id: 'sk-11', category: '专业基础', name: 'C', icon: 'code', level: 2, desc: '指针、内存管理与算法实现' },
  { id: 'sk-12', category: '专业基础', name: 'Java', icon: 'server', level: 2, desc: '面向对象编程与课程项目实践' },
  { id: 'sk-13', category: '专业基础', name: 'Embedded Systems', icon: 'cpu', level: 2, desc: '单片机与物联网感知层实践' },
  { id: 'sk-14', category: '专业基础', name: 'Computer Networks', icon: 'globe', level: 2, desc: 'TCP/IP、HTTP 与接口调试' },
  // LLM Applications
  { id: 'sk-15', category: '大模型应用', name: 'Model Pretraining', icon: 'atom', level: 1, desc: '下一 token 预测、学习率调度与混合精度' },
  { id: 'sk-16', category: '大模型应用', name: 'LoRA Fine-tuning', icon: 'cloud', level: 2, desc: '轻量化微调、角色模型训练与效果评估' },
  { id: 'sk-17', category: '大模型应用', name: 'SFT Fine-tuning', icon: 'git-branch', level: 2, desc: '指令微调、loss 曲线与效果验证' },
  { id: 'sk-18', category: '大模型应用', name: 'AI-Assisted Dev', icon: 'smartphone', level: 2, desc: '需求梳理、代码生成与问题排查' },
];
