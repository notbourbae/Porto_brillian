import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, X, Briefcase, Calendar, User, Tag } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Interactive Card */}
      <motion.div
        layoutId={`card-container-${project.id}`}
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer rounded-lg overflow-hidden bg-brand-surface-low border border-white/5 hover:border-brand-secondary/30 transition-all duration-300 flex flex-col h-full"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        id={`project-card-${project.id}`}
      >
        {/* Card Image Cover with Zoom Effect */}
        <div className="relative aspect-video w-full overflow-hidden bg-brand-surface-lowest">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-lowest via-transparent to-transparent opacity-60" />
          
          {/* Floating Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-brand-surface-lowest/90 border border-white/10 text-brand-secondary px-2.5 py-1 rounded-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-grow">
          <span className="font-mono text-[11px] text-brand-on-secondary-container bg-brand-secondary/10 self-start px-2 py-0.5 rounded-sm mb-3">
            {project.year}
          </span>
          <h3 className="font-sans font-semibold text-lg text-white group-hover:text-brand-secondary transition-colors duration-300 mb-2">
            {project.title}
          </h3>
          <p className="font-sans text-sm text-brand-on-surface-variant line-clamp-2 leading-relaxed mb-4 flex-grow">
            {project.description}
          </p>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-white/5">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="font-mono text-[10px] text-brand-tertiary/85"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Immersive Detail Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-brand-surface-lowest/90 backdrop-blur-md"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-4xl bg-brand-surface-low border border-white/10 rounded-lg overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
              id={`project-modal-${project.id}`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-20 bg-brand-surface-lowest/80 border border-white/10 hover:border-brand-secondary text-brand-on-surface-variant hover:text-white p-2 rounded-sm transition-all duration-300"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-grow">
                {/* Hero Banner inside Modal */}
                <div className="relative w-full aspect-video md:aspect-[2.2/1] bg-brand-surface-lowest">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-low to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 md:left-8 right-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-secondary bg-brand-surface-lowest/85 px-3 py-1 rounded-sm border border-brand-secondary/20 mb-3 inline-block">
                      {project.category}
                    </span>
                    <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                      {project.title}
                    </h2>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Extensive Writeup */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brand-tertiary mb-3">
                        Deskripsi Proyek
                      </h4>
                      <p className="font-sans text-brand-on-surface text-base leading-relaxed whitespace-pre-line">
                        {project.longDescription || project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-brand-tertiary mb-3">
                        Pendekatan & Teknologi
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[11px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/20 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Metadata Rail */}
                  <div className="space-y-6 bg-brand-surface-lowest/50 p-6 rounded-lg border border-white/5 h-fit">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-brand-tertiary pb-3 border-b border-white/5">
                      Rincian Teknis
                    </h4>

                    {/* Metadata Items */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Briefcase className="w-4 h-4 text-brand-secondary mt-1 shrink-0" />
                        <div>
                          <span className="block font-mono text-[10px] text-brand-on-surface-variant uppercase">
                            Peran
                          </span>
                          <span className="font-sans text-sm text-white font-medium">
                            {project.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <User className="w-4 h-4 text-brand-secondary mt-1 shrink-0" />
                        <div>
                          <span className="block font-mono text-[10px] text-brand-on-surface-variant uppercase">
                            Klien / Instansi
                          </span>
                          <span className="font-sans text-sm text-white font-medium">
                            {project.client}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Calendar className="w-4 h-4 text-brand-secondary mt-1 shrink-0" />
                        <div>
                          <span className="block font-mono text-[10px] text-brand-on-surface-variant uppercase">
                            Tahun Rilis
                          </span>
                          <span className="font-sans text-sm text-white font-medium">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project CTA */}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full py-2.5 px-4 bg-brand-secondary hover:bg-brand-secondary-container text-brand-on-secondary font-mono text-xs font-semibold rounded-sm flex items-center justify-center space-x-2 transition-all duration-300"
                      >
                        <span>Kunjungi Situs Live</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
