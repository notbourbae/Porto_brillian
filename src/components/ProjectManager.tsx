import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Sparkles, LogOut, Key, Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { Profile, Experience } from '../types';

interface ProjectManagerProps {
  profile: Profile;
  onUpdateProfile: (profile: Profile) => void;
  onResetDefaults: () => void;
  onLogout?: () => void;
  experiences: Experience[];
  onUpdateExperiences: (exps: Experience[]) => void;
}

export default function ProjectManager({
  profile,
  onUpdateProfile,
  onResetDefaults,
  onLogout,
  experiences,
  onUpdateExperiences
}: ProjectManagerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'experiences' | 'contact' | 'security'>('profile');

  // Tab 1: Profile & About Me local state
  const [profName, setProfName] = useState(profile.name);
  const [profRole, setProfRole] = useState(profile.role);
  const [profLocation, setProfLocation] = useState(profile.location);
  const [profAvatar, setProfAvatar] = useState(profile.avatarUrl);
  const [profBio, setProfBio] = useState(profile.bio);
  const [profAbout1, setProfAbout1] = useState(profile.aboutParagraph1 || '');
  const [profAbout2, setProfAbout2] = useState(profile.aboutParagraph2 || '');
  const [profAboutQuote, setProfAboutQuote] = useState(profile.aboutQuote || '');

  // Tab 2: Skills local state
  const [profSkill1Title, setProfSkill1Title] = useState(profile.skillCat1Title || '');
  const [profSkill1Desc, setProfSkill1Desc] = useState(profile.skillCat1Desc || '');
  const [profSkill1Tags, setProfSkill1Tags] = useState(profile.skillCat1Tags || '');

  const [profSkill2Title, setProfSkill2Title] = useState(profile.skillCat2Title || '');
  const [profSkill2Desc, setProfSkill2Desc] = useState(profile.skillCat2Desc || '');
  const [profSkill2Tags, setProfSkill2Tags] = useState(profile.skillCat2Tags || '');

  const [profSkill3Title, setProfSkill3Title] = useState(profile.skillCat3Title || '');
  const [profSkill3Desc, setProfSkill3Desc] = useState(profile.skillCat3Desc || '');
  const [profSkill3Tags, setProfSkill3Tags] = useState(profile.skillCat3Tags || '');

  // Tab 3: Experiences Manager local state
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [expMajor, setExpMajor] = useState('');

  // Tab 4: Contact & Socials local state
  const [profEmail, setProfEmail] = useState(profile.email);
  const [profContactTitle, setProfContactTitle] = useState(profile.contactTitle || '');
  const [profContactDesc, setProfContactDesc] = useState(profile.contactDesc || '');
  const [profGithub, setProfGithub] = useState(profile.github || '');
  const [profInstagram, setProfInstagram] = useState(profile.instagram || '');
  const [profTiktok, setProfTiktok] = useState(profile.tiktok || '');

  // Tab 5: Password local state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notif, setNotif] = useState<string | null>(null);

  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  // Sync state values when profile prop updates
  useEffect(() => {
    setProfName(profile.name);
    setProfRole(profile.role);
    setProfLocation(profile.location);
    setProfAvatar(profile.avatarUrl);
    setProfBio(profile.bio);
    setProfAbout1(profile.aboutParagraph1 || '');
    setProfAbout2(profile.aboutParagraph2 || '');
    setProfAboutQuote(profile.aboutQuote || '');

    setProfSkill1Title(profile.skillCat1Title || '');
    setProfSkill1Desc(profile.skillCat1Desc || '');
    setProfSkill1Tags(profile.skillCat1Tags || '');

    setProfSkill2Title(profile.skillCat2Title || '');
    setProfSkill2Desc(profile.skillCat2Desc || '');
    setProfSkill2Tags(profile.skillCat2Tags || '');

    setProfSkill3Title(profile.skillCat3Title || '');
    setProfSkill3Desc(profile.skillCat3Desc || '');
    setProfSkill3Tags(profile.skillCat3Tags || '');

    setProfEmail(profile.email);
    setProfContactTitle(profile.contactTitle || '');
    setProfContactDesc(profile.contactDesc || '');
    setProfGithub(profile.github || '');
    setProfInstagram(profile.instagram || '');
    setProfTiktok(profile.tiktok || '');
  }, [profile]);

  // Handle forms save
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: profName,
      role: profRole,
      location: profLocation,
      avatarUrl: profAvatar,
      bio: profBio,
      aboutParagraph1: profAbout1,
      aboutParagraph2: profAbout2,
      aboutQuote: profAboutQuote
    });
    triggerNotif('Profil & data Tentang Saya berhasil diperbarui!');
  };

  const handleSkillsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      skillCat1Title: profSkill1Title,
      skillCat1Desc: profSkill1Desc,
      skillCat1Tags: profSkill1Tags,
      skillCat2Title: profSkill2Title,
      skillCat2Desc: profSkill2Desc,
      skillCat2Tags: profSkill2Tags,
      skillCat3Title: profSkill3Title,
      skillCat3Desc: profSkill3Desc,
      skillCat3Tags: profSkill3Tags
    });
    triggerNotif('Spektrum skill berhasil diperbarui!');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      email: profEmail,
      contactTitle: profContactTitle,
      contactDesc: profContactDesc,
      github: profGithub,
      instagram: profInstagram,
      tiktok: profTiktok
    });
    triggerNotif('Info Kontak & Tautan Sosial berhasil diperbarui!');
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

  // Experiences sub-handlers
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole || !expCompany || !expPeriod || !expDescription) {
      alert('Mohon lengkapi semua bidang riwayat.');
      return;
    }

    if (editingExpId) {
      // Edit mode
      const updated = experiences.map(exp => 
        exp.id === editingExpId 
          ? { id: exp.id, role: expRole, company: expCompany, period: expPeriod, description: expDescription, major: expMajor || undefined }
          : exp
      );
      onUpdateExperiences(updated);
      triggerNotif('Riwayat pendidikan berhasil diperbarui!');
      setEditingExpId(null);
    } else {
      // Add mode
      const newExp: Experience = {
        id: `edu-${Date.now()}`,
        role: expRole,
        company: expCompany,
        period: expPeriod,
        description: expDescription,
        major: expMajor || undefined
      };
      onUpdateExperiences([...experiences, newExp]);
      triggerNotif('Riwayat pendidikan berhasil ditambahkan!');
    }

    // Reset input fields
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpDescription('');
    setExpMajor('');
  };

  const handleStartEditExp = (exp: Experience) => {
    setEditingExpId(exp.id);
    setExpRole(exp.role);
    setExpCompany(exp.company);
    setExpPeriod(exp.period);
    setExpDescription(exp.description);
    setExpMajor(exp.major || '');
  };

  const handleDeleteExp = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat pendidikan ini?')) return;
    const filtered = experiences.filter(exp => exp.id !== id);
    onUpdateExperiences(filtered);
    triggerNotif('Riwayat pendidikan berhasil dihapus!');
    if (editingExpId === id) {
      setEditingExpId(null);
      setExpRole('');
      setExpCompany('');
      setExpPeriod('');
      setExpDescription('');
      setExpMajor('');
    }
  };

  const handleCancelEditExp = () => {
    setEditingExpId(null);
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpDescription('');
    setExpMajor('');
  };

  const handleResetClick = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang semua data website ke contoh bawaan? Seluruh perubahan kustom akan hilang.')) {
      onResetDefaults();
      triggerNotif('Seluruh data disetel ulang ke contoh bawaan.');
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
          <p className="font-mono text-[11px] text-brand-on-surface-variant tracking-wide mt-1 uppercase">
            Sistem kustomisasi real-time untuk memperbarui seluruh konten website Anda
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

      {/* Tabs Selector Navigation */}
      <div className="flex flex-wrap border-b border-white/5 gap-2 pb-4">
        {[
          { id: 'profile', label: 'Profil & Tentang Saya' },
          { id: 'skills', label: 'Spektrum Skill' },
          { id: 'experiences', label: 'Riwayat Pendidikan' },
          { id: 'contact', label: 'Kontak & Medsos' },
          { id: 'security', label: 'Keamanan Admin' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id !== 'experiences') {
                handleCancelEditExp();
              }
            }}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-sm border transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-brand-secondary border-brand-secondary text-black font-bold'
                : 'bg-transparent border-white/10 text-brand-on-surface-variant hover:border-white/35 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications banner */}
      {notif && (
        <div className="bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary p-3 rounded-sm flex items-center gap-2.5 font-sans text-xs animate-pulse">
          <Check className="w-4 h-4 shrink-0" />
          <span>{notif}</span>
        </div>
      )}

      {/* Dynamic Tab Body Render */}
      <div className="pt-2">

        {/* ----------------- TAB 1: PROFILE & ABOUT ME ----------------- */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Pekerjaan / Peran Utama
                </label>
                <input
                  type="text"
                  value={profRole}
                  onChange={(e) => setProfRole(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={profLocation}
                  onChange={(e) => setProfLocation(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  URL Foto Profil
                </label>
                <input
                  type="text"
                  value={profAvatar}
                  onChange={(e) => setProfAvatar(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Biografi Singkat (Tampil di Hero Banner)
                </label>
                <textarea
                  value={profBio}
                  onChange={(e) => setProfBio(e.target.value)}
                  rows={2}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2 pt-4 border-t border-white/5">
                <h4 className="font-sans font-bold text-sm text-white">Bagian Cerita: Tentang Saya</h4>
                <p className="font-mono text-[9px] text-brand-on-surface-variant uppercase">Sesuaikan teks cerita narasi di bagian "Tentang Saya" (About Me)</p>
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Paragraf Pertama Tentang Saya
                </label>
                <textarea
                  value={profAbout1}
                  onChange={(e) => setProfAbout1(e.target.value)}
                  rows={3}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Paragraf Kedua Tentang Saya
                </label>
                <textarea
                  value={profAbout2}
                  onChange={(e) => setProfAbout2(e.target.value)}
                  rows={3}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Kutipan Filosofis / Quote (Di bagian bawah cerita)
                </label>
                <textarea
                  value={profAboutQuote}
                  onChange={(e) => setProfAboutQuote(e.target.value)}
                  rows={2}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-secondary hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              Simpan Perubahan Profil
            </button>
          </form>
        )}

        {/* ----------------- TAB 2: SPEKTRUM SKILL ----------------- */}
        {activeTab === 'skills' && (
          <form onSubmit={handleSkillsSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Skill 1 Card */}
              <div className="p-5 bg-brand-surface-lowest rounded-md border border-white/5 space-y-4">
                <div className="font-sans font-bold text-sm text-brand-secondary border-b border-white/5 pb-2 uppercase tracking-wider">
                  Skill Card 1 (Tampilan Desain)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Judul Card 1
                    </label>
                    <input
                      type="text"
                      value={profSkill1Title}
                      onChange={(e) => setProfSkill1Title(e.target.value)}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Keahlian / Tags (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={profSkill1Tags}
                      onChange={(e) => setProfSkill1Tags(e.target.value)}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                      placeholder="e.g. FIGMA, UI/UX, DESIGN SYSTEM"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Deskripsi Ringkas
                    </label>
                    <textarea
                      value={profSkill1Desc}
                      onChange={(e) => setProfSkill1Desc(e.target.value)}
                      rows={2}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Skill 2 Card */}
              <div className="p-5 bg-brand-surface-lowest rounded-md border border-white/5 space-y-4">
                <div className="font-sans font-bold text-sm text-brand-secondary border-b border-white/5 pb-2 uppercase tracking-wider">
                  Skill Card 2 (Tampilan Pengembangan)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Judul Card 2
                    </label>
                    <input
                      type="text"
                      value={profSkill2Title}
                      onChange={(e) => setProfSkill2Title(e.target.value)}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Keahlian / Tags (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={profSkill2Tags}
                      onChange={(e) => setProfSkill2Tags(e.target.value)}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                      placeholder="e.g. REACT, TYPESCRIPT, LINUX"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Deskripsi Ringkas
                    </label>
                    <textarea
                      value={profSkill2Desc}
                      onChange={(e) => setProfSkill2Desc(e.target.value)}
                      rows={2}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Skill 3 Card */}
              <div className="p-5 bg-brand-surface-lowest rounded-md border border-white/5 space-y-4">
                <div className="font-sans font-bold text-sm text-brand-secondary border-b border-white/5 pb-2 uppercase tracking-wider">
                  Skill Card 3 (Tampilan Jaringan)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Judul Card 3
                    </label>
                    <input
                      type="text"
                      value={profSkill3Title}
                      onChange={(e) => setProfSkill3Title(e.target.value)}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Keahlian / Tags (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={profSkill3Tags}
                      onChange={(e) => setProfSkill3Tags(e.target.value)}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                      placeholder="e.g. CISCO, MIKROTIK, MONITORING"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                      Deskripsi Ringkas
                    </label>
                    <textarea
                      value={profSkill3Desc}
                      onChange={(e) => setProfSkill3Desc(e.target.value)}
                      rows={2}
                      className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none resize-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-secondary hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              Simpan Spektrum Skill
            </button>
          </form>
        )}

        {/* ----------------- TAB 3: EXPERIENCES TIMELINE ----------------- */}
        {activeTab === 'experiences' && (
          <div className="space-y-8">
            {/* Experience editor form */}
            <form onSubmit={handleSaveExperience} className="p-5 bg-brand-surface-lowest rounded-md border border-white/10 space-y-4">
              <div className="font-sans font-bold text-sm text-brand-secondary border-b border-white/5 pb-2 flex items-center justify-between">
                <span>{editingExpId ? 'EDIT DATA PENDIDIKAN / PENGALAMAN' : 'TAMBAH RIWAYAT BARU'}</span>
                {editingExpId && (
                  <button
                    type="button"
                    onClick={handleCancelEditExp}
                    className="font-mono text-[9px] uppercase px-2 py-1 border border-white/10 hover:border-white/30 text-brand-on-surface-variant rounded-sm cursor-pointer"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                    Pendidikan / Peran (e.g. Sekolah Menengah Kejuruan)
                  </label>
                  <input
                    type="text"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    placeholder="Contoh: Sekolah Menengah Kejuruan"
                    className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                    Instansi / Sekolah (e.g. SMKN 1 Doko)
                  </label>
                  <input
                    type="text"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="Contoh: SMKN 1 Doko"
                    className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                    Periode Waktu (e.g. 2021 — 2024)
                  </label>
                  <input
                    type="text"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                    placeholder="Contoh: 2021 — 2024"
                    className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                    Program Keahlian / Jurusan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={expMajor}
                    onChange={(e) => setExpMajor(e.target.value)}
                    placeholder="Contoh: Teknik Komputer dan Jaringan"
                    className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1.5 md:col-span-2">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                    Deskripsi Singkat Pengalaman
                  </label>
                  <textarea
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    rows={2}
                    placeholder="Tulis penjelasan singkat mengenai pencapaian dan hal yang dipelajari..."
                    className="bg-brand-surface border border-white/10 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-xs font-sans outline-none resize-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-brand-secondary hover:bg-emerald-400 text-black font-mono text-[10px] font-bold uppercase rounded-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{editingExpId ? 'SIMPAN PERUBAHAN RIWAYAT' : 'TAMBAH RIWAYAT TIMELINE'}</span>
              </button>
            </form>

            {/* List of existing experiences */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] uppercase text-brand-on-surface-variant tracking-widest font-bold">
                DAFTAR TIMELINE AKTIF ({experiences.length})
              </h4>

              {experiences.length === 0 ? (
                <div className="text-center py-6 bg-brand-surface-lowest text-brand-on-surface-variant font-sans text-xs border border-white/5 rounded-sm">
                  Belum ada riwayat pendidikan yang terdaftar. Tambahkan di atas!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-brand-surface-lowest border border-white/10 p-4 rounded-sm flex justify-between items-start gap-3 hover:border-brand-secondary/35 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-brand-secondary tracking-widest font-semibold block">
                          {exp.period}
                        </span>
                        <h5 className="font-sans font-bold text-sm text-white">
                          {exp.role}
                        </h5>
                        <p className="font-sans text-xs text-brand-on-surface-variant font-medium">
                          {exp.company} {exp.major ? `(${exp.major})` : ''}
                        </p>
                        <p className="font-sans text-[11px] text-brand-on-surface-variant/80 line-clamp-2 leading-relaxed font-light">
                          {exp.description}
                        </p>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditExp(exp)}
                          className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/10 hover:text-brand-secondary rounded-sm transition-all text-brand-on-surface-variant cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExp(exp.id)}
                          className="p-1.5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 hover:text-red-400 rounded-sm transition-all text-brand-on-surface-variant cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: CONTACT & SOCIALS ----------------- */}
        {activeTab === 'contact' && (
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Email Hubungi / Kontak Utama
                </label>
                <input
                  type="email"
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Judul Kontak (Saran & Kritik)
                </label>
                <input
                  type="text"
                  value={profContactTitle}
                  onChange={(e) => setProfContactTitle(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  Deskripsi Ajakan Kontak (Saran & Kritik)
                </label>
                <textarea
                  value={profContactDesc}
                  onChange={(e) => setProfContactDesc(e.target.value)}
                  rows={2}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2 pt-4 border-t border-white/5">
                <h4 className="font-sans font-bold text-sm text-white">Tautan Media Sosial</h4>
                <p className="font-mono text-[9px] text-brand-on-surface-variant uppercase">Masukkan url profil media sosial Anda untuk dipasang di footer & kontak</p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  URL GitHub (notbourbae / desipoetibril)
                </label>
                <input
                  type="url"
                  value={profGithub}
                  onChange={(e) => setProfGithub(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  URL Instagram (brillian_d.k)
                </label>
                <input
                  type="url"
                  value={profInstagram}
                  onChange={(e) => setProfInstagram(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                  URL TikTok (_brilliand)
                </label>
                <input
                  type="url"
                  value={profTiktok}
                  onChange={(e) => setProfTiktok(e.target.value)}
                  className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-secondary hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              Simpan Info Kontak & Medsos
            </button>
          </form>
        )}

        {/* ----------------- TAB 5: ADMIN SECURITY ----------------- */}
        {activeTab === 'security' && (
          <div className="space-y-4 max-w-md">
            <div>
              <h4 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
                <Key className="w-4 h-4 text-brand-secondary" />
                Ubah Kata Sandi Admin
              </h4>
              <p className="font-mono text-[10px] text-brand-on-surface-variant uppercase tracking-wider mt-0.5">
                Amankan hak akses dasbor utama Anda secara lokal
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-brand-on-surface-variant">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
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
                    className="bg-brand-surface-lowest border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-2 px-3 text-sm font-sans transition-colors duration-300 outline-none"
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
        )}

      </div>
    </div>
  );
}
