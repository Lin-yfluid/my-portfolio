/** 滚动入场 hook —— 观察 .reveal 元素，进入视口时加 .revealed */
import { useEffect } from 'react';

export function useReveal(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
