import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Lock, Save, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi } from '@/services/api';
import { useAuth } from '@/store/authStore';
import { Field } from '@/components/common/UI';
import { getError } from '@/utils';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [pf, setPf] = useState({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', phone: user?.phone ?? '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  const profileMut = useMutation({
    mutationFn: () => userApi.updateProfile(pf).then(r => r.data.data),
    onSuccess: u => { updateUser(u); toast.success('Profile updated!'); },
    onError: e => toast.error(getError(e)),
  });

  const passwordMut = useMutation({
    mutationFn: () => {
      if (pw.newPassword !== pw.confirm) throw new Error("Passwords don't match");
      return userApi.changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
    },
    onSuccess: () => { toast.success('Password changed!'); setPw({ currentPassword: '', newPassword: '', confirm: '' }); },
    onError: e => toast.error(getError(e)),
  });

  return (
    <div className="w-full min-h-screen bg-cream-50 overflow-x-hidden">
      <div className="container-app py-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-wine text-white flex items-center justify-center font-serif font-700 text-2xl shadow-wine">
            {user?.firstName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif font-700 text-2xl text-charcoal">{user?.firstName} {user?.lastName}</h1>
            <div className="flex items-center gap-2">
              <p className="text-charcoal-500 text-sm">{user?.email}</p>
              {user?.role === 'ROLE_ADMIN' && (
                <span className="badge badge-wine flex items-center gap-1"><Shield size={10} />Admin</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-100 border border-cream-200 rounded-xl p-1 mb-6 w-fit">
          {(['profile', 'password'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-600 transition-all capitalize ${t === tab ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-500 hover:text-charcoal'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-cream-200 rounded-2xl p-6 space-y-5">
            <h2 className="font-serif font-700 text-charcoal text-lg flex items-center gap-2">
              <User size={16} className="text-wine" /> Edit Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name">
                <input className="input" value={pf.firstName} onChange={e => setPf(p => ({ ...p, firstName: e.target.value }))} />
              </Field>
              <Field label="Last Name">
                <input className="input" value={pf.lastName} onChange={e => setPf(p => ({ ...p, lastName: e.target.value }))} />
              </Field>
              <Field label="Phone" className="sm:col-span-2">
                <input className="input" placeholder="+91 XXXXX XXXXX" value={pf.phone} onChange={e => setPf(p => ({ ...p, phone: e.target.value }))} />
              </Field>
              <Field label="Email" className="sm:col-span-2" hint="Email cannot be changed">
                <input className="input opacity-50 cursor-not-allowed" value={user?.email} disabled />
              </Field>
            </div>
            <button onClick={() => profileMut.mutate()} disabled={profileMut.isPending}
              className="btn-primary gap-2">
              {profileMut.isPending ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save Changes</>}
            </button>
          </motion.div>
        )}

        {tab === 'password' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-cream-200 rounded-2xl p-6 space-y-5">
            <h2 className="font-serif font-700 text-charcoal text-lg flex items-center gap-2">
              <Lock size={16} className="text-wine" /> Change Password
            </h2>
            <div className="space-y-4">
              <Field label="Current Password">
                <input type="password" className="input" value={pw.currentPassword} onChange={e => setPw(p => ({ ...p, currentPassword: e.target.value }))} />
              </Field>
              <Field label="New Password">
                <input type="password" className="input" value={pw.newPassword} onChange={e => setPw(p => ({ ...p, newPassword: e.target.value }))} />
              </Field>
              <Field label="Confirm New Password">
                <input type="password" className="input" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} />
              </Field>
            </div>
            <button onClick={() => passwordMut.mutate()} disabled={passwordMut.isPending}
              className="btn-primary gap-2">
              {passwordMut.isPending ? <><Loader2 size={14} className="animate-spin" />Updating…</> : <><Lock size={14} />Update Password</>}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
