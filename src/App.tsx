import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Mail, Github, Linkedin, MessageSquare, Trash2, ArrowUpRight, Compass, Check, Sliders, Sparkles, ChevronDown, Paintbrush, Code2, Server, Instagram, Video, Star, ShieldCheck, Quote, ThumbsUp } from 'lucide-react';
import { Project, Profile, Experience, Message } from './types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_EXPERIENCES } from './data';

import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import ProjectManager from './components/ProjectManager';
import ExperienceTimeline from './components/ExperienceTimeline';
import ContactForm from './components/ContactForm';
import AdminLoginModal from './components/AdminLoginModal';
import ActiveBackground from './components/ActiveBackground';

// Helper to parse and render styled text with premium gradients and styles dynamically
const renderHeroHeading = (text: string) => {
  if (!text) return null;

  // Split by newlines first
  const lines = text.split('\n');
  const keywordRegex = /(harmoni|teknologi|tekonlogi|berdampak|desain|seni|digital|creative|modern|impact)/i;

  return lines.map((line, lineIdx) => {
    // Look for format markers like {text} or **text**
    const markerRegex = /(\{[^{}]+\}|\*\*[^*]+\*\*)/g;
    const parts = line.split(markerRegex);
    
    const hasFormatting = parts.some(p => (p.startsWith('{') && p.endsWith('}')) || (p.startsWith('**') && p.endsWith('**')));
    
    let renderedLine;
    if (!hasFormatting) {
      // Default: Dynamically highlight premium keywords automatically for maximum aesthetic appeal!
      const defaultParts = line.split(keywordRegex);
      renderedLine = defaultParts.map((part, index) => {
        if (keywordRegex.test(part)) {
          return (
            <span
              key={index}
              className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-[#00f2fe] to-[#38bdf8] font-sans font-black inline-block hover:scale-[1.03] transition-all duration-300 drop-shadow-[0_0_25px_rgba(78,222,163,0.25)] drop-shadow-[0_0_10px_rgba(0,242,254,0.15)] select-none cursor-default"
            >
              {part}
            </span>
          );
        }
        return part;
      });
    } else {
      renderedLine = parts.map((part, index) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          const clean = part.slice(1, -1);
          return (
            <span
              key={index}
              className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-[#00f2fe] to-[#38bdf8] font-sans font-black inline-block hover:scale-[1.03] transition-all duration-300 drop-shadow-[0_0_25px_rgba(78,222,163,0.25)] drop-shadow-[0_0_10px_rgba(0,242,254,0.15)] select-none cursor-default"
            >
              {clean}
            </span>
          );
        } else if (part.startsWith('**') && part.endsWith('**')) {
          const clean = part.slice(2, -2);
          return (
            <span
              key={index}
              className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-[#00f2fe] to-[#38bdf8] font-sans font-black inline-block hover:scale-[1.03] transition-all duration-300 drop-shadow-[0_0_25px_rgba(78,222,163,0.25)] drop-shadow-[0_0_10px_rgba(0,242,254,0.15)] select-none cursor-default"
            >
              {clean}
            </span>
          );
        }
        return part;
      });
    }

    return (
      <React.Fragment key={lineIdx}>
        {renderedLine}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

export default function App() {
  // -----------------------------------------
  // State Initialization from LocalStorage
  // -----------------------------------------
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('ethereal_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      let updated = { ...parsed };
      let changed = false;
      if (
        parsed.name === "ARIA WIJAYA" || 
        parsed.name === "Aria Wijaya" || 
        parsed.name === "Aria" || 
        parsed.name === "BRILLIAN"
      ) {
        updated.name = "BRILLIAN DANIAR KAUTAMA";
        changed = true;
      }
      const avatarLooksLegacy = !parsed.avatarUrl || typeof parsed.avatarUrl !== 'string' || !parsed.avatarUrl.trim();

      if (avatarLooksLegacy) {
        updated.avatarUrl = DEFAULT_PROFILE.avatarUrl;
        changed = true;
      }
      if (parsed.email !== "desipoetibril@gmail.com") {
        updated.email = "desipoetibril@gmail.com";
        changed = true;
      }
      if (parsed.github !== "https://github.com/notbourbae") {
        updated.github = "https://github.com/notbourbae";
        changed = true;
      }
      if (parsed.instagram !== "https://www.instagram.com/brillian_d.k/") {
        updated.instagram = "https://www.instagram.com/brillian_d.k/";
        changed = true;
      }
      if (parsed.tiktok !== "https://www.tiktok.com/@_brilliand") {
        updated.tiktok = "https://www.tiktok.com/@_brilliand";
        changed = true;
      }
      if (parsed.location !== "Blitar, Indonesia") {
        updated.location = "Blitar, Indonesia";
        changed = true;
      }
      if (changed) {
        localStorage.setItem('ethereal_profile', JSON.stringify(updated));
        return updated;
      }
      return parsed;
    }
    return DEFAULT_PROFILE;
  });

  const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = DEFAULT_PROFILE.avatarUrl;
  };

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ethereal_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('ethereal_experiences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
          return DEFAULT_EXPERIENCES;
        }

        const hasOldDash = parsed.some((exp: any) => exp.period && exp.period.includes(' - '));
        const migratedExperiences = parsed.map((exp: any) => {
          if (exp.id === 'edu-4' && exp.company === 'SDN 1 Ngrendeng') {
            return { ...exp, company: 'SDN Ngrendeng 02' };
          }
          return exp;
        });

        if (hasOldDash || migratedExperiences.some((exp: any) => exp.id === 'edu-4' && exp.company === 'SDN Ngrendeng 02')) {
          const nextExperiences = hasOldDash ? DEFAULT_EXPERIENCES : migratedExperiences;
          localStorage.setItem('ethereal_experiences', JSON.stringify(nextExperiences));
          return nextExperiences;
        }

        return parsed;
      } catch {
        return DEFAULT_EXPERIENCES;
      }
    }
    return DEFAULT_EXPERIENCES;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('ethereal_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState<'All' | 'Design' | 'Code' | 'Architecture'>('All');
  const [activeSection, setActiveSection] = useState('hero');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [showInboundMessages, setShowInboundMessages] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('ethereal_is_admin') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Sync to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('ethereal_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ethereal_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('ethereal_experiences', JSON.stringify(experiences));
  }, [experiences]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        localStorage.setItem('ethereal_messages', JSON.stringify(data));
      } else {
        console.error("Failed to fetch messages from backend");
      }
    } catch (error) {
      console.error("Error fetching messages from SQL API:", error);
    }
  };

  const fetchProfileFromApi = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        localStorage.setItem('ethereal_profile', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching profile from API:", error);
    }
  };

  const fetchProjectsFromApi = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        localStorage.setItem('ethereal_projects', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching projects from API:", error);
    }
  };

  const fetchExperiencesFromApi = async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
        localStorage.setItem('ethereal_experiences', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching experiences from API:", error);
    }
  };

  // Sync all data from server on mount and poll messages
  useEffect(() => {
    fetchMessages();
    fetchProfileFromApi();
    fetchProjectsFromApi();
    fetchExperiencesFromApi();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'pengalaman', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // -----------------------------------------
  // Handlers for Customizer Workspace
  // -----------------------------------------
  const handleUpdateProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile)
    }).catch(err => console.error("Error saving profile to API:", err));
  };

  const handleUpdateExperiences = (updatedExps: Experience[]) => {
    setExperiences(updatedExps);
    fetch('/api/experiences', { method: 'DELETE' })
      .then(() => Promise.all(updatedExps.map(exp =>
        fetch('/api/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exp)
        })
      )))
      .catch(err => console.error("Error saving experiences to API:", err));
  };

  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    }).catch(err => console.error("Error saving project to API:", err));
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    fetch(`/api/projects/${updatedProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProject)
    }).catch(err => console.error("Error updating project on API:", err));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    fetch(`/api/projects/${id}`, { method: 'DELETE' })
      .catch(err => console.error("Error deleting project from API:", err));
  };

  const handleSendMessage = async (newMsg: Message): Promise<void> => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Gagal menyimpan ulasan (Server Error: ${response.status})`);
      }
      await fetchMessages();
    } catch (error: any) {
      console.error("Error saving message:", error);
      throw error;
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchMessages();
      } else {
        alert("Gagal menghapus ulasan: Respon server tidak ok");
      }
    } catch (error: any) {
      console.error("Error deleting message from SQL:", error);
      alert("Gagal menghapus ulasan: " + (error?.message || error));
    }
  };

  const handleClearAllMessages = async () => {
    if (!confirm('Bersihkan semua pesan masuk?')) return;
    try {
      const response = await fetch('/api/messages', {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchMessages();
      } else {
        alert("Gagal membersihkan ulasan: Respon server tidak ok");
      }
    } catch (error: any) {
      console.error("Error clearing messages from SQL:", error);
      alert("Gagal membersihkan ulasan: " + (error?.message || error));
    }
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('ethereal_profile');
    localStorage.removeItem('ethereal_projects');
    localStorage.removeItem('ethereal_experiences');
    localStorage.removeItem('ethereal_messages');
    setProfile(DEFAULT_PROFILE);
    setProjects(DEFAULT_PROJECTS);
    setExperiences(DEFAULT_EXPERIENCES);
    setMessages([]);
    setIsWorkspaceOpen(false);
    fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_PROFILE)
    }).catch(() => {});
    fetch('/api/projects', { method: 'DELETE' }).catch(() => {});
    Promise.all(DEFAULT_PROJECTS.map(p =>
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      })
    )).catch(() => {});
    fetch('/api/experiences', { method: 'DELETE' }).catch(() => {});
    Promise.all(DEFAULT_EXPERIENCES.map(e =>
      fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e)
      })
    )).catch(() => {});
    fetch('/api/messages', { method: 'DELETE' }).catch(() => {});
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('ethereal_is_admin');
    setIsAdmin(false);
    setIsWorkspaceOpen(false);
    setShowInboundMessages(false);
  };

  const handleAdminLoginSuccess = () => {
    sessionStorage.setItem('ethereal_is_admin', 'true');
    setIsAdmin(true);
    setIsWorkspaceOpen(true);
    setTimeout(() => {
      const targetEl = document.getElementById('portfolio-workspace-section');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  };

  // Smooth scroll helper
  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 90; // offset for the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Filtered projects
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface relative overflow-x-hidden selection:bg-brand-secondary selection:text-brand-on-secondary">
      {/* Active Interactive Background Canvas */}
      <ActiveBackground />

      {/* Background Ambience - Quiet Luxury Subtle Vignette */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-radial-gradient from-brand-secondary/5 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Sleek Floating Glass Navbar */}
      <Navbar
        profile={profile}
        onScrollTo={handleScrollTo}
        activeSection={activeSection}
        isWorkspaceOpen={isWorkspaceOpen}
        onToggleWorkspace={() => {
          if (isAdmin) {
            setIsWorkspaceOpen(!isWorkspaceOpen);
            setTimeout(() => {
              const targetEl = document.getElementById('portfolio-workspace-section');
              if (targetEl && !isWorkspaceOpen) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          } else {
            setShowAdminLogin(true);
          }
        }}
      />

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 space-y-36 relative z-10">
        
        {/* =========================================
            1. HERO SECTION (Centered Modern Typography)
           ========================================= */}
        <section id="hero" className="min-h-[80vh] flex flex-col justify-center items-center text-center py-12">
          <div className="max-w-4xl space-y-8 flex flex-col items-center">
            <div className="space-y-6 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-xs tracking-[0.2em] sm:tracking-[0.28em] uppercase text-brand-secondary font-bold px-5 py-2 rounded-full border border-brand-secondary/20 bg-brand-secondary/5 shadow-[0_0_20px_rgba(78,222,163,0.06)] backdrop-blur-md select-none inline-flex items-center gap-2 hover:bg-brand-secondary/10 transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                {profile.heroTag || `HI! I AM ${profile.name.toUpperCase()}`}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-sans font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-[76px] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/80 leading-[1.15] sm:leading-[1.1] max-w-4xl select-none"
              >
                {renderHeroHeading(profile.heroHeading || "Menciptakan {Harmoni} Antara \nTeknologi & Desain.")}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-brand-on-surface-variant text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              {profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-sans text-xs sm:text-sm tracking-widest text-[#a3b8cc] font-medium"
            >
              Always striving to be better than yesterday.
            </motion.div>
          </div>

          {/* Elegant Scroller Indicator */}
          <div className="pt-20">
            <button
              onClick={() => handleScrollTo('about')}
              className="animate-bounce flex flex-col items-center space-y-1 group"
              aria-label="Scroll to About Me"
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-on-surface-variant group-hover:text-white transition-colors duration-200">
                Lanjut ke Tentang Saya
              </span>
              <ChevronDown className="w-4 h-4 text-brand-secondary" />
            </button>
          </div>
        </section>

        {/* =========================================
            2. ABOUT ME SECTION (Two-Column Layout)
           ========================================= */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center scroll-mt-28">
          {/* Left Column: Premium Monochromatic Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-lg overflow-hidden border border-white/10 shadow-2xl group cursor-pointer">
              {/* Backing Ambient Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101415] via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-brand-secondary/5 group-hover:bg-brand-secondary/10 transition-colors duration-500 z-0 pointer-events-none" />
              
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_PROFILE.avatarUrl;
                }}
                className="object-cover w-full h-full filter grayscale contrast-115 group-hover:grayscale-0 transition-all duration-700 relative z-0"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-secondary/15 transition-all duration-500 rounded-lg pointer-events-none z-20" />
            </div>
          </motion.div>

          {/* Right Column: Dynamic Narrative Story */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-secondary">
                [ TENTANG SAYA ]
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
                About Me
              </h2>
            </div>

            <div className="space-y-5 text-brand-on-surface-variant font-sans text-sm sm:text-base leading-relaxed font-light">
              <p>
                {profile.aboutParagraph1 || "Perjalanan saya di dunia teknologi dimulai dari ketertarikan mendalam pada infrastruktur jaringan dan sistem komputer."}
              </p>
              <p>
                {profile.aboutParagraph2 || "Saya percaya bahwa teknologi adalah seni yang ditulis dalam bahasa logika. Setiap piksel membawa makna, setiap baris kode menyimpan cerita."}
              </p>
              <p className="italic text-white font-normal text-sm border-l-2 border-brand-secondary pl-4">
                "{profile.aboutQuote || "Kode adalah puisi yang dipahami mesin, sementara desain adalah bahasa yang menyentuh manusia."}"
              </p>
            </div>

            {/* Bottom Accent line */}
            <div className="w-16 h-1 bg-brand-secondary mt-8 rounded-full" />
          </motion.div>
        </section>

        {/* =========================================
            3. SPEKTRUM KAPABILITAS (Bento-Grid Bento Skills)
           ========================================= */}
        <section id="skills" className="space-y-12 scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 border-b border-white/5">
            <div className="lg:col-span-6 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-secondary">
                [ Skills ]
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
                Sedang di pelajari 
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="font-sans text-sm text-brand-on-surface-variant leading-relaxed lg:text-right">
                Saya selalu berusaha untuk memperluas pengetahuan saya.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Creative Design */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#161616] border border-white/5 p-8 rounded-md hover:border-brand-secondary/20 transition-all duration-300 space-y-6"
            >
              <div className="w-12 h-12 rounded-sm bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                <Paintbrush className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <h3 className="font-sans font-bold text-lg text-white">
                  {profile.skillCat1Title || "Creative Design"}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed font-light font-light">
                  {profile.skillCat1Desc || "Merancang antarmuka pengguna (UI/UX) dengan fokus pada efisiensi teknis dan kemudahan navigasi bagi pengguna."}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(profile.skillCat1Tags || "FIGMA, UI/UX, DESIGN SYSTEM")
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span key={t} className="font-mono text-[9px] tracking-widest bg-white/5 text-brand-on-surface-variant px-2.5 py-1 rounded-sm">
                      {t}
                    </span>
                  ))}
              </div>
            </motion.div>

            {/* Card 2: Development */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#161616] border border-white/5 p-8 rounded-md hover:border-brand-secondary/20 transition-all duration-300 space-y-6"
            >
              <div className="w-12 h-12 rounded-sm bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                <Code2 className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <h3 className="font-sans font-bold text-lg text-white">
                  {profile.skillCat2Title || "Development"}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed font-light font-light">
                  {profile.skillCat2Desc || "Fokus pada pengembangan perangkat lunak, infrastruktur jaringan, dan solusi teknologi modern."}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(profile.skillCat2Tags || "NETWORKING, VIBE CODING wkwk, WEB DEV, LINUX")
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span key={t} className="font-mono text-[9px] tracking-widest bg-white/5 text-brand-on-surface-variant px-2.5 py-1 rounded-sm">
                      {t}
                    </span>
                  ))}
              </div>
            </motion.div>

            {/* Card 3: Networking & Infrastructure */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#161616] border border-white/5 p-8 rounded-md hover:border-brand-secondary/20 transition-all duration-300 space-y-6"
            >
              <div className="w-12 h-12 rounded-sm bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                <Server className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <h3 className="font-sans font-bold text-lg text-white">
                  {profile.skillCat3Title || "Networking & Infrastructure"}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed font-light font-light">
                  {profile.skillCat3Desc || "Perancangan jaringan, administrasi server, dan keamanan sistem komputer."}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(profile.skillCat3Tags || "CISCO, MIKROTIK, LINUX")
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span key={t} className="font-mono text-[9px] tracking-widest bg-white/5 text-brand-on-surface-variant px-2.5 py-1 rounded-sm">
                      {t}
                    </span>
                  ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================
            4. RIWAYAT PENDIDIKAN TIMELINE SECTION
           ========================================= */}
        <section id="pengalaman" className="space-y-16 scroll-mt-28">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="font-sans font-semibold text-3xl sm:text-4xl text-white tracking-tight">
              Riwayat Pendidikan
            </h2>
            <div className="w-16 h-[3px] bg-brand-secondary/30 mx-auto mt-4 rounded-full" />
          </div>

          <ExperienceTimeline experiences={experiences} />
        </section>

        {/* =========================================
            6. WORKSPACE SECTION (TOGGLED VIA NAVBAR)
           ========================================= */}
        <AnimatePresence>
          {isWorkspaceOpen && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              id="portfolio-workspace-section"
              className="scroll-mt-28"
            >
              <ProjectManager
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onResetDefaults={handleResetDefaults}
                onLogout={handleAdminLogout}
                experiences={experiences}
                onUpdateExperiences={handleUpdateExperiences}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* =========================================
            7. CONTACT & MESSAGES HUB SECTION
           ========================================= */}
        <section id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-12 scroll-mt-28">
          {/* Left Column: Direct Inquiries */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-secondary font-bold">
                [ Saran & Kritik ]
              </span>
              <h2 className="font-sans font-black text-3.5xl sm:text-4xl text-white tracking-tight leading-none">
                {profile.contactTitle || "Berikan Pendapat Kamu."}
              </h2>
              <p className="font-sans text-sm sm:text-base text-brand-on-surface-variant leading-relaxed max-w-sm font-light">
                {profile.contactDesc || "Sebelum meninggalkan halaman ini, saya akan senang mendengar pendapat Anda. Kritik yang membangun, apresiasi, maupun saran pengembangan sangat saya hargai."}
              </p>
            </div>

            {/* Quick Contact Links */}
            <div className="space-y-4 py-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center space-x-3 text-brand-on-surface-variant hover:text-brand-secondary transition-colors duration-200 group"
              >
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-brand-secondary/30">
                  <Mail className="w-4 h-4 text-brand-secondary" />
                </div>
                <div className="text-left">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-on-surface-variant/70">
                    Email Resmi
                  </span>
                  <span className="font-sans text-sm text-white font-medium">
                    {profile.email}
                  </span>
                </div>
              </a>

              <div className="flex items-center space-x-3 text-brand-on-surface-variant">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-brand-secondary" />
                </div>
                <div className="text-left">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-brand-on-surface-variant/70">
                    From
                  </span>
                  <span className="font-sans text-sm text-white font-medium">
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Icons row */}
            <div className="flex items-center space-x-3 pt-6 border-t border-white/5">
              <a
                href={profile.github || "https://github.com/desipoetibril"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-sm border border-white/10 hover:border-brand-secondary text-brand-on-surface-variant hover:text-brand-secondary flex items-center justify-center transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile.instagram || "https://instagram.com/desipoetibril"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-sm border border-white/10 hover:border-brand-secondary text-brand-on-surface-variant hover:text-brand-secondary flex items-center justify-center transition-all duration-300"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={profile.tiktok || "https://tiktok.com/@desipoetibril"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-sm border border-white/10 hover:border-brand-secondary text-brand-on-surface-variant hover:text-brand-secondary flex items-center justify-center transition-all duration-300"
                aria-label="TikTok Profile"
              >
                <Video className="w-4 h-4" />
              </a>
              
              {/* Toggle Received Messages admin/testing log */}
              <button
                onClick={() => setShowInboundMessages(!showInboundMessages)}
                className={`ml-auto font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm border flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  showInboundMessages
                    ? 'bg-brand-secondary/15 border-brand-secondary text-brand-secondary font-bold'
                    : 'bg-transparent border-white/10 text-brand-on-surface-variant hover:border-brand-secondary hover:text-brand-secondary'
                }`}
                title="Lihat ulasan & pesan masuk"
                id="btn-toggle-inbound-msgs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ulasan ({messages.length})</span>
              </button>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <ContactForm onSendMessage={handleSendMessage} />
          </div>
        </section>

        {/* =========================================
            8. SUBMITTED INBOUND MESSAGES LOG
           ========================================= */}
        {/* =========================================
            8. SUBMITTED INBOUND MESSAGES LOG
           ========================================= */}
        <AnimatePresence>
          {showInboundMessages && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              className="bg-[#161616] border border-white/5 rounded-md p-6 md:p-8 space-y-8 overflow-hidden"
              id="messages-log-panel"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <h3 className="font-sans font-black text-xl text-white tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-secondary" />
                    Ulasan & Suara Pengunjung
                  </h3>
                  <p className="font-mono text-[10px] text-brand-on-surface-variant uppercase mt-1 tracking-wider">
                    Umpan balik langsung dari rekan developer, klien, dan pengunjung portfolio
                  </p>
                </div>
                
                {isAdmin && messages.length > 0 && (
                  <button
                    onClick={handleClearAllMessages}
                    className="font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-sm border border-red-500/20"
                  >
                    Hapus Semua ({messages.length})
                  </button>
                )}
              </div>
              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* 1. Real-time User Reviews (From database/form) */}
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className="bg-[#121617] border border-white/5 hover:border-brand-secondary/30 rounded-md p-5 relative group transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(78,222,163,0.05)] hover:-translate-y-0.5 flex flex-col justify-between"
                  >
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="absolute top-4 right-4 text-brand-on-surface-variant hover:text-red-400 p-1.5 rounded-sm bg-white/5 border border-white/10 transition-colors duration-200 cursor-pointer z-10"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div>
                      {/* Review text */}
                      <p className="font-sans text-xs md:text-sm text-brand-on-surface-variant/90 whitespace-pre-line leading-relaxed italic mb-5">
                        "{msg.message}"
                      </p>
                    </div>

                    {/* Reviewer Details */}
                    <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-secondary/20 to-teal-500/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary font-black text-xs shrink-0 shadow-inner">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-sans font-semibold text-white text-xs block truncate">
                          {msg.name}
                        </span>
                        <span className="font-mono text-[9px] text-brand-secondary block truncate">
                          {msg.email}
                        </span>
                      </div>
                      <span className="font-mono text-[8px] text-brand-on-surface-variant/50 ml-auto shrink-0 self-end">
                        {msg.timestamp.split(' - ')[0]}
                      </span>
                    </div>

                    {/* Decorative Background Quote */}
                    <Quote className="absolute right-6 bottom-4 w-12 h-12 text-white/[0.015] pointer-events-none group-hover:text-brand-secondary/[0.035] transition-all duration-300" />
                  </motion.div>
                ))}

              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* Modern Minimalist Footer */}
      <footer className="border-t border-white/5 py-10 bg-[#161616]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-sans font-black tracking-[0.25em] text-lg text-white uppercase">
              {profile.name}
            </span>
            <span className="font-mono text-[9px] text-brand-on-surface-variant uppercase tracking-widest">
              Always striving to be better than yesterday.
            </span>
          </div>

          {/* Footer Social Links */}
          <div className="flex items-center space-x-6 text-xs font-mono uppercase tracking-widest text-brand-on-surface-variant">
            <a href={profile.github || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">
              GitHub
            </a>
            <a href={profile.instagram || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">
              Instagram
            </a>
            <a href={profile.tiktok || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">
              TikTok
            </a>
          </div>

          <p className="font-mono text-[9px] text-brand-on-surface-variant tracking-wider">
            © 2024 Portfolio Profesional. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Admin Authentication Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLoginModal
            isOpen={showAdminLogin}
            onClose={() => setShowAdminLogin(false)}
            onLoginSuccess={handleAdminLoginSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
