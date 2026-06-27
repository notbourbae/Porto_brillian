import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface ContactFormProps {
  onSendMessage: (msg: Message) => Promise<void>;
}

export default function ContactForm({ onSendMessage }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Mohon isi semua kolom yang diperlukan.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      name,
      email,
      message,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ' - ' + new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
      })
    };

    try {
      await onSendMessage(newMessage);
      setSubmitted(true);
      setError(null);
      // Reset fields
      setName('');
      setEmail('');
      setMessage('');

      // Clear success message after some seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err?.message || 'Gagal mengirim pesan ke database. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#161616] border border-white/5 rounded-md p-6 sm:p-8" id="contact-form-container">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary">
            <Check className="w-6 h-6 animate-bounce" />
          </div>
          <h4 className="font-sans font-bold text-lg text-white">
            Pesan Terkirim!
          </h4>
          <p className="font-sans text-sm text-brand-on-surface-variant max-w-sm leading-relaxed">
            Terima kasih! Pesan dan masukan Anda telah kami simpan dengan aman.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="font-sans font-black text-xl text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-brand-secondary" />
            Hubungi atau Beri Masukan
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-sm flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Underline Style Input - Name */}
          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-brand-on-surface-variant font-bold">
              NAMA LENGKAP
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#121212] border border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-3 px-4 text-sm font-sans rounded-sm transition-all duration-300 outline-none placeholder:font-mono placeholder:text-xs placeholder:text-brand-on-surface-variant/30"
              placeholder="Contoh: Aria Pratama"
              required
            />
          </div>

          {/* Underline Style Input - Email */}
          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-brand-on-surface-variant font-bold">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#121212] border border-white/10 hover:border-white/20 focus:border-brand-secondary text-white py-3 px-4 text-sm font-sans rounded-sm transition-all duration-300 outline-none placeholder:font-mono placeholder:text-xs placeholder:text-brand-on-surface-variant/30"
              placeholder="Contoh: hello@domain.com"
              required
            />
          </div>

          {/* Fully Recessed Dark Textarea */}
          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-brand-on-surface-variant font-bold">
              MASUKAN ATAU PESAN
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="bg-[#121212] border border-white/10 hover:border-white/20 focus:border-brand-secondary rounded-sm text-white py-3 px-4 text-sm font-sans transition-all duration-300 outline-none resize-none placeholder:font-mono placeholder:text-xs placeholder:text-brand-on-surface-variant/30"
              placeholder="Tulis kritik, saran, masukan atau pesan kolaborasi Anda di sini..."
              required
            />
          </div>

           <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 text-black font-mono text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
              isSubmitting ? "bg-brand-secondary/50 cursor-not-allowed" : "bg-brand-secondary hover:bg-emerald-400 cursor-pointer"
            }`}
            id="btn-send-message"
          >
            <span>{isSubmitting ? "MENGIRIM..." : "KIRIM PESAN ▷"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
