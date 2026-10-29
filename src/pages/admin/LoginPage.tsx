/** 后台登录页 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { loginSchema } from '@/api/schemas';

export function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '请检查输入');
      return;
    }
    const ok = await login(form.username, form.password);
    if (ok) {
      navigate('/admin', { replace: true });
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 inline-block h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
          <h1 className="text-xl font-bold">后台登录</h1>
          <p className="mt-1 text-xs text-[var(--muted)]">默认账号 admin / admin123</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium">用户名</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full rounded-lg border border-[var(--rule)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">密码</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full rounded-lg border border-[var(--rule)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary w-full">
            <LogIn size={16} /> 登录
          </button>
        </form>
      </div>
    </div>
  );
}
