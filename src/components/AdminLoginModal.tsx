import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess
}: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const savedPassword = localStorage.getItem('ethereal_admin_password') || 'admin123';

    // Simulate standard authentication delay for premium feel
    setTimeout(() => {
      if (password === savedPassword) {
        onLoginSuccess();
        setPassword('');
        setError('');
        onClose();
      } else {
        setError('Kata sandi yang Anda masukkan salah. Silakan coba lagi.');
      }
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-md bg-[#131617] border border-white/10 rounded-lg p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
      >
        {/* Subtle accent gradient bar */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand-secondary via-emerald-500 to-teal-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-on-surface-variant hover:text-white p-1 rounded-sm transition-colors duration-200 cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center mb-4 border border-brand-secondary/20">
            <Lock className="w-5 h-5 text-brand-secondary" />
          </div>
          <h3 className="font-sans font-bold text-xl text-white tracking-tight">
            Akses Administrator
          </h3>
          <p className="font-sans text-xs text-brand-on-surface-variant mt-2 leading-relaxed max-w-xs">
            Masukkan kata sandi administrator untuk mengaktifkan real-time kustomisasi portfolio.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-brand-on-surface-variant font-bold">
              KATA SANDI ADMIN
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                autoFocus
                className="w-full bg-[#1c1f21] border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-3 pl-4 pr-12 text-sm font-sans transition-all duration-300 outline-none placeholder:text-brand-on-surface-variant/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-on-surface-variant/70 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-sm text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isSubmitting || !password}
              className={`w-full py-3 bg-brand-secondary hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-sans font-medium text-sm rounded-sm transition-all duration-300 relative flex items-center justify-center cursor-pointer ${
                isSubmitting ? 'animate-pulse' : ''
              }`}
            >
              {isSubmitting ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
            </button>
            
            {/* Standard instruction clue */}
            <div className="text-center pt-2 border-t border-white/5">
              <span className="font-mono text-[9px] text-emerald-400/70 tracking-wide uppercase">
                💡 Demo Mode: Kata sandi adalah <code className="text-white bg-white/5 px-1 py-0.5 rounded">admin123</code>
              </span>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
