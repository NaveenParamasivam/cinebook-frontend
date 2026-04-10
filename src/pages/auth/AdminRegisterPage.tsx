import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Shield, AlertTriangle, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import { useAuth } from '@/store/authStore';
import AuthLayout from '@/components/common/AuthLayout';
import { Field } from '@/components/common/UI';
import { getError } from '@/utils';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', adminSecret: '' });
  const [showPw, setShowPw] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.registerAdmin(form);
      setAuth(data.data.user, data.data.accessToken);
      toast.success(`Admin account created! Welcome, ${data.data.user.firstName}`);
      navigate('/admin');
    } catch (e) { toast.error(getError(e)); }
    finally { setLoading(false); }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <AuthLayout title="Admin Setup." subtitle="Create an administrator account using your backend secret key."
      footer={<><Link to="/login" className="text-wine font-600 hover:underline">← Back to login</Link></>}>
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
        <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-700 text-xs leading-relaxed">
          Requires <code className="bg-amber-100 px-1 rounded font-mono">ADMIN_REGISTRATION_SECRET</code> from your backend <code className="bg-amber-100 px-1 rounded font-mono">.env</code> file.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name"><input className="input" value={form.firstName} onChange={set('firstName')} required autoFocus /></Field>
          <Field label="Last Name"><input className="input" value={form.lastName} onChange={set('lastName')} required /></Field>
        </div>
        <Field label="Email"><input type="email" className="input" value={form.email} onChange={set('email')} required /></Field>
        <Field label="Password">
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} className="input pr-11" value={form.password} onChange={set('password')} required />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <div className="border-t border-cream-200 pt-4">
          <Field label="Admin Secret Key">
            <div className="relative">
              <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine" />
              <input type={showKey ? 'text' : 'password'} className="input pl-9 pr-11 border-wine/30 focus:border-wine"
                placeholder="ADMIN_REGISTRATION_SECRET" value={form.adminSecret} onChange={set('adminSecret')} required />
              <button type="button" onClick={() => setShowKey(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal">
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2">
          {loading ? <><Loader2 size={15} className="animate-spin" />Creating…</> : <><Shield size={14} />Create Admin Account</>}
        </button>
      </form>
    </AuthLayout>
  );
}
