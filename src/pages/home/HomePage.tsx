/** 首页 —— devfolio 风格组合：Hero → About → Skills → Education → Projects → Blog → Contact，滚动入场动画 */
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Skills } from '@/sections/Skills';
import { Education } from '@/sections/Education';
import { Projects } from '@/sections/Projects';
import { BlogSection } from '@/sections/Blog';
import { Contact } from '@/sections/Contact';
import { useReveal } from '@/hooks/useReveal';

export function HomePage() {
  useReveal();

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Education />
      <Projects />
      <BlogSection />
      <Contact />
    </>
  );
}
