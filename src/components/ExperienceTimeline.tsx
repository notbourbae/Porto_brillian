import React from 'react';
import { motion } from 'motion/react';
import { Experience } from '../types';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="relative max-w-5xl mx-auto py-8">
      {/* Central Timeline line for sm and larger */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[1px] bg-brand-secondary/20 hidden sm:block" />
      
      {/* Left Timeline line for mobile */}
      <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-brand-secondary/20 sm:hidden" />

      <div className="space-y-16">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative"
            id={`experience-node-${exp.id}`}
          >
            {/* Desktop & Tablet Layout (sm and larger) */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] gap-x-8 md:gap-x-12 items-start relative">
              
              {/* Left Side: Metadata (Right-Aligned) */}
              <div className="text-right flex flex-col items-end space-y-1">
                <span className="font-mono text-[11px] md:text-xs text-brand-secondary tracking-widest font-semibold">
                  {exp.period}
                </span>
                <h4 className="font-sans font-black text-xl md:text-2xl text-white tracking-tight">
                  {exp.role}
                </h4>
                <p className="font-sans text-sm text-brand-on-surface-variant/80 font-medium">
                  {exp.company}
                </p>
                {exp.major && (
                  <span className="font-mono text-[11px] md:text-xs text-brand-secondary font-bold tracking-wider mt-1 uppercase">
                    {exp.major}
                  </span>
                )}
              </div>

              {/* Middle Side: Green Circle Dot (Vertically centered with the title) */}
              <div className="relative flex justify-center items-start pt-[30px] z-10 h-full">
                <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full ring-4 ring-brand-secondary/20 transition-all duration-300" />
              </div>

              {/* Right Side: Description (Left-Aligned, aligned with Title) */}
              <div className="text-left pt-[24px]">
                <p className="font-sans text-xs sm:text-sm text-brand-on-surface-variant/90 leading-relaxed font-light max-w-md">
                  {exp.description}
                </p>
              </div>

            </div>

            {/* Mobile Layout (below sm) */}
            <div className="sm:hidden relative pl-10 space-y-3">
              {/* Dot indicator */}
              <div className="absolute left-2.5 top-1.5 z-10">
                <div className="w-3 h-3 bg-brand-secondary rounded-full ring-4 ring-brand-secondary/20" />
              </div>

              {/* Content Stack */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-brand-secondary tracking-widest font-semibold block">
                  {exp.period}
                </span>
                <h4 className="font-sans font-black text-lg text-white tracking-tight">
                  {exp.role}
                </h4>
                <p className="font-sans text-xs text-brand-on-surface-variant font-medium">
                  {exp.company}
                </p>
                {exp.major && (
                  <span className="font-mono text-[10px] text-brand-secondary font-bold tracking-wider block uppercase">
                    {exp.major}
                  </span>
                )}
              </div>

              <p className="font-sans text-xs text-brand-on-surface-variant/80 leading-relaxed font-light pt-1">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
