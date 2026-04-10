import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import { useAuth } from '@/store/authStore';
import AuthLayout from '@/components/common/AuthLayout';
import { Field } from '@/components/common/UI';
import { getError } from '@/utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await authApi.register(form);
      setAuth(data.data.user, data.data.accessToken);
      toast.success(`Welcome to CineBook, ${data.data.user.firstName}!`);
      navigate('/');
    } catch (e) { toast.error(getError(e)); }
    finally { setLoading(false); }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <AuthLayout title="Create account." subtitle="Join CineBook and start booking your favourite films today."
      footer={<>Already have an account? <Link to="/login" className="text-wine font-600 hover:underline">Sign in →</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name"><input className="input" placeholder="John" value={form.firstName} onChange={set('firstName')} required autoFocus /></Field>
          <Field label="Last Name"><input className="input" placeholder="Doe" value={form.lastName} onChange={set('lastName')} required /></Field>
        </div>
        <Field label="Email address"><input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set('email')} required /></Field>
        <Field label="Phone (optional)"><input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} /></Field>
        <Field label="Password">
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="Min 6 characters"
              value={form.password} onChange={set('password')} required />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal transition-colors">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <p className="text-xs text-charcoal-500">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <><Loader2 size={15} className="animate-spin" />Creating account…</> : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
}
