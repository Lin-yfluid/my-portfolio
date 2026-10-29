/** 全局 Toast —— 简单发布订阅实现 */
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error';
interface ToastMsg { id: number; type: ToastType; text: string }

let pushToast: ((type: ToastType, text: string) => void) | null = null;

/** 任意位置调用：toast.success('已复制') */
export const toast = {
  success: (text: string) => pushToast?.('success', text),
  error: (text: string) => pushToast?.('error', text),
};

export function ToastHost() {
  const [list, setList] = useState<ToastMsg[]>([]);

  useEffect(() => {
    pushToast = (type, text) => {
      const id = Date.now() + Math.random();
      setList(prev => [...prev, { id, type, text }]);
      setTimeout(() => setList(prev => prev.filter(t => t.id !== id)), 3000);
    };
    return () => { pushToast = null; };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2" role="status" aria-live="polite">
      {list.map(t => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[var(--rule)] bg-[var(--bg2)] px-4 py-2.5 text-sm shadow-lg shadow-black/10"
        >
          {t.type === 'success'
            ? <CheckCircle2 size={16} className="text-green-400" />
            : <XCircle size={16} className="text-red-600" />}
          {t.text}
        </div>
      ))}
    </div>
  );
}
