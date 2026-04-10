import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import { useAuth } from '@/store/authStore';
import AuthLayout from '@/components/common/AuthLayout';
import { Field } from '@/components/common/UI';
import { getError } from '@/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const from = (location.state as { from?: string })?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      setAuth(data.data.user, data.data.accessToken);
      toast.success(`Welcome back, ${data.data.user.firstName}!`);
      navigate(from, { replace: true });
    } catch (e) { toast.error(getError(e)); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back." subtitle="Sign in to access your bookings and continue your cinematic journey."
      footer={<>Don't have an account? <Link to="/register" className="text-wine font-600 hover:underline">Create one →</Link>
        <br/><Link to="/admin-register" className="text-charcoal-400 hover:text-wine text-xs transition-colors mt-2 inline-block">Admin registration</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email address">
          <input type="email" className="input" placeholder="you@example.com" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required autoFocus />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="Your password"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal transition-colors">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
          {loading ? <><Loader2 size={15} className="animate-spin" />Signing in…</> : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
}
