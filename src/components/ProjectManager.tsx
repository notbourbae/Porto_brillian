import React, { useState } from 'react';
import { Check, RotateCcw, Sparkles, LogOut, Key } from 'lucide-react';
import { Profile } from '../types';

interface ProjectManagerProps {
  profile: Profile;
  onUpdateProfile: (profile: Profile) => void;
  onResetDefaults: () => void;
  onLogout?: () => void;
}

export default function ProjectManager({
  profile,
  onUpdateProfile,
  onResetDefaults,
  onLogout
}: ProjectManagerProps) {
  // Profile local state
  const [profName, setProfName] = useState(profile.name);
  const [profRole, setProfRole] = useState(profile.role);
  const [profLocation, setProfLocation] = useState(profile.location);
  const [profBio, setProfBio] = useState(profile.bio);
  const [profEmail, setProfEmail] = useState(profile.email);
  const [profAvatar, setProfAvatar] = useState(profile.avatarUrl);

  // Password local state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notif, setNotif] = useState<string | null>(null);

  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: profName,
      role: profRole,
      location: profLocation,
      bio: profBio,
      email: profEmail,
      avatarUrl: profAvatar
    });
    triggerNotif('Profil berhasil diperbarui secara lokal!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert('Kata sandi minimal harus terdiri dari 4 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
      return;
    }
    localStorage.setItem('ethereal_admin_password', newPassword);
    setNewPassword('');
    setConfirmPassword('');
    triggerNotif('Kata sandi admin berhasil diperbarui!');
  };

  const handleResetClick = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang profil ke contoh bawaan? Seluruh perubahan lokal akan hilang.')) {
      onResetDefaults();
      // Sync local states
      setTimeout(() => {
        setProfName(profile.name);
        setProfRole(profile.role);
        setProfLocation(profile.location);
        setProfBio(profile.bio);
        setProfEmail(profile.email);
        setProfAvatar(profile.avatarUrl);
        triggerNotif('Data disetel ulang ke contoh bawaan.');
      }, 50);
    }
  };

  return (
    <div className="bg-brand-surface-low border border-white/5 rounded-lg p-6 md:p-8 space-y-6" id="portfolio-workspace">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h3 className="font-sans font-bold text-xl text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-secondary" />
            Studio Workspace Editor
          </h3>
          <p className="font-mono text-[11px] text-brand-on-surface-variant tracking-wide mt-1">
            SESUAIKAN PORTFOLIO INI SECARA REAL-TIME DENGAN DATA ANDA
          </p>
        </div>

        {/* Actions Container */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="font-mono text-[11px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
              id="btn-admin-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar Admin
            </button>
          )}

          <button
            type="button"
            onClick={handleResetClick}
            className="font-mono text-[11px] bg-white/5 hover:bg-brand-secondary/15 hover:text-brand-secondary border border-white/10 text-brand-on-surface-variant px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            id="btn-reset-workspace"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Setel Ulang Contoh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notif && (
        <div className="bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary p-3 rounded-sm flex items-center gap-2.5 font-sans text-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span>{notif}</span>
        </div>
      )}

      {/* Profile Form Container */}
      <div className="pt-2">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Name */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="bg-brand-surface-lowest border-b border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none placeholder:font-mono placeholder:text-xs"
                placeholder="Ketik nama Anda..."
                required
              />
            </div>

            {/* Profile Role */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                Pekerjaan / Peran Utama
              </label>
              <input
                type="text"
                value={profRole}
                onChange={(e) => setProfRole(e.target.value)}
                className="bg-brand-surface-lowest border-b border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                placeholder="e.g. Design Engineer & Architect"
                required
              />
            </div>

            {/* Profile Location */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                Lokasi
              </label>
              <input
                type="text"
                value={profLocation}
                onChange={(e) => setProfLocation(e.target.value)}
                className="bg-brand-surface-lowest border-b border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                placeholder="e.g. Jakarta, Indonesia"
                required
              />
            </div>

            {/* Contact Email */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                Email Kontak
              </label>
              <input
                type="email"
                value={profEmail}
                onChange={(e) => setProfEmail(e.target.value)}
                className="bg-brand-surface-lowest border-b border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                placeholder="e.g. hello@yourdomain.com"
                required
              />
            </div>

            {/* Profile Avatar Image URL */}
            <div className="flex flex-col space-y-1.5 md:col-span-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                URL Foto Profil (Hotlink)
              </label>
              <input
                type="text"
                value={profAvatar}
                onChange={(e) => setProfAvatar(e.target.value)}
                className="bg-brand-surface-lowest border-b border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                placeholder="https://images.unsplash.com/photo-... atau /src/assets/..."
                required
              />
            </div>

            {/* Bio Description */}
            <div className="flex flex-col space-y-1.5 md:col-span-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                Biografi Singkat (Tampil di Bagian Atas)
              </label>
              <textarea
                value={profBio}
                onChange={(e) => setProfBio(e.target.value)}
                rows={3}
                className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none resize-none"
                placeholder="Tulis biografi ringkas..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-secondary hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            id="btn-save-profile-edit"
          >
            Simpan Perubahan Profil
          </button>
        </form>
      </div>

      {/* Admin Password Change Form */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        <div>
          <h4 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
            <Key className="w-4 h-4 text-brand-secondary" />
            Ubah Kata Sandi Admin
          </h4>
          <p className="font-mono text-[10px] text-brand-on-surface-variant uppercase tracking-wider mt-0.5">
            AMANKAN HAK AKSES DASBOR UTAMA ANDA
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-brand-surface-lowest border-b border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                placeholder="Minimal 4 karakter"
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-brand-surface-lowest border-b border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                placeholder="Ketik ulang kata sandi"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-white/5 hover:bg-brand-secondary/15 hover:text-brand-secondary border border-white/10 text-brand-on-surface-variant font-mono text-[10px] uppercase rounded-sm transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            Perbarui Kata Sandi
          </button>
        </form>
      </div>
    </div>
  );
}
