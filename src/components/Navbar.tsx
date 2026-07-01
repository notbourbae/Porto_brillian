import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { Profile } from '../types';

interface NavbarProps {
  profile: Profile;
  onScrollTo: (sectionId: string) => void;
  activeSection: string;
  isWorkspaceOpen: boolean;
  onToggleWorkspace: () => void;
}

export default function Navbar({
  profile,
  onScrollTo,
  activeSection,
  isWorkspaceOpen,
  onToggleWorkspace
}: NavbarProps) {
  const [timeStr, setTimeStr] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setTimeStr(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Tentang Saya', target: 'about' },
    { label: 'Skill', target: 'skills' },
    { label: 'Pengalaman', target: 'pengalaman' },
    { label: 'Masukan', target: 'contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#101415]/70 backdrop-blur-lg border-b border-white/5 py-4 shadow-lg shadow-black/15' 
        : 'bg-[#101415]/40 backdrop-blur-md border-b border-white/5 py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Name */}
        <div 
          onClick={() => onScrollTo('hero')} 
          className="cursor-pointer group flex flex-col justify-center"
          id="nav-logo"
        >
          <span className="font-sans font-black tracking-[0.18em] text-lg sm:text-xl md:text-2xl text-white group-hover:text-brand-secondary transition-colors duration-300 uppercase">
            {profile.name}
          </span>
        </div>

        {/* Navigation Anchors */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => onScrollTo(link.target)}
              className={`font-sans text-xs md:text-sm font-medium transition-all duration-300 relative py-1 hover:text-white cursor-pointer ${
                activeSection === link.target ? 'text-brand-secondary font-semibold' : 'text-brand-on-surface-variant'
              }`}
              id={`btn-nav-${link.target}`}
            >
              {link.label}
              {activeSection === link.target && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-secondary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Action Items */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => onScrollTo('contact')}
            className="inline-flex px-5 py-2.5 bg-brand-secondary hover:bg-emerald-400 text-black font-sans text-xs md:text-sm font-medium rounded-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            id="btn-nav-direct-contact"
          >
            Hubungi Saya
          </button>

          <button
            onClick={onToggleWorkspace}
            className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 rounded-md border transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
              isWorkspaceOpen 
                ? 'bg-brand-secondary/15 border-brand-secondary text-brand-secondary' 
                : 'bg-transparent border-white/10 text-brand-on-surface-variant hover:border-brand-secondary hover:text-brand-secondary'
            }`}
            title="Buka panel kustomisasi real-time"
            id="btn-workspace-toggle"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Editor</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
