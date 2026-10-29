/** 全局 App 组件 —— 注入默认数据到 localStorage */
import { profileApi, skillsApi, projectsApi, postsApi, settingsApi } from '@/api/client';
import { defaultProfile } from '@/data/defaultProfile';
import { defaultSkills } from '@/data/defaultSkills';
import { defaultProjects } from '@/data/defaultProjects';
import type { Post } from '@/api/types';

// Vite glob 加载 posts/*.md —— 编译时自动扫描，新增 MD 自动包含
const postsModules = import.meta.glob('/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseMdToPost(path: string, content: string): Post {
  const fileName = path.split('/').pop()?.replace('.md', '') ?? 'untitled';
  // 简单 front-matter 解析
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
  let title = fileName;
  let date = new Date().toISOString().slice(0, 10);
  let tags: string[] = [];
  let body = content;

  if (fmMatch) {
    const fm = fmMatch[1] ?? '';
    body = fmMatch[2] ?? content;
    const titleMatch = fm.match(/^title:\s*(.+)$/m);
    const dateMatch = fm.match(/^date:\s*(.+)$/m);
    const tagsMatch = fm.match(/^tags:\s*\[(.+?)\]/m);
    if (titleMatch?.[1]) title = titleMatch[1].trim().replace(/['"]/g, '');
    if (dateMatch?.[1]) date = dateMatch[1].trim();
    if (tagsMatch?.[1]) {
      tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
    }
  }

  // 从正文第一行提取标题（如果没 front-matter）
  if (title === fileName) {
    const h1 = body.match(/^#\s+(.+)$/m);
    if (h1?.[1]) title = h1[1].trim();
  }

  // 生成摘要
  const excerpt = body
    .replace(/^#.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`\[\]()]/g, '')
    .trim()
    .slice(0, 120) + '...';

  const slug = fileName.toLowerCase().replace(/[^a-z0-9-]+/g, '-');

  return {
    id: `post-${slug}`,
    slug,
    title,
    excerpt,
    date,
    tags: tags.length > 0 ? tags : ['技术'],
    content: body,
  };
}

/** 数据引导 —— 模块加载即执行，保证首屏渲染前 localStorage 已是新数据 */
function bootstrapData(): void {
  // 数据版本机制：默认内容升级时，自动覆盖 localStorage 里的旧演示数据
  const DATA_VERSION = 'content-v8-20261029';
  if (localStorage.getItem('pf_dataver') !== DATA_VERSION) {
    profileApi.set(defaultProfile);
    skillsApi.setAll(defaultSkills);
    projectsApi.setAll(defaultProjects);
    postsApi.setAll([]); // 清空旧博客缓存，下面以 posts/*.md 为准重新注入
    localStorage.setItem('pf_dataver', DATA_VERSION);
  }

  // 博客：posts/*.md 编译时打包，与后台新增的文章合并（MD 文件优先）
  const mdPosts = Object.entries(postsModules).map(([path, content]) =>
    parseMdToPost(path, content as string),
  );
  const stored = postsApi.list([]);
  const mdSlugSet = new Set(mdPosts.map(p => p.slug));
  postsApi.setAll([...mdPosts, ...stored.filter(p => !mdSlugSet.has(p.slug))]);

  // 默认设置
  settingsApi.init({
    accentColor: '#5B8CFF',
    siteTitle: 'Portfolio',
    copyrightYear: new Date().getFullYear(),
  });
}

bootstrapData();

export function App(): null {
  return null;
}
