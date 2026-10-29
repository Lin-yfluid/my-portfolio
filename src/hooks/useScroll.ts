/** 滚动相关 hooks */
import { useEffect, useState } from 'react';

export function useScrollY(): number {
  const [y, setY] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY : 0,
  );
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}

export function useScrolled(threshold = 20): boolean {
  return useScrollY() > threshold;
}
