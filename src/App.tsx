/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring } from 'motion/react';
import Cosmos from './components/Cosmos';
import Directory from './components/Directory';
import EndingSealed from './components/EndingSealed';
import LetterCard from './components/LetterCard';
import SidebarNav from './components/SidebarNav';
import { letters } from './data/letters';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const mainLetters = letters.filter(l => !l.isEnding);
  const endingLetter = letters.find(l => l.isEnding);

  return (
    <main className="relative selection:bg-indigo-500/30 selection:text-indigo-100 overflow-hidden min-h-screen">
      {/* 3D Background & Glows */}
      <Cosmos />
      
      {/* Visual Overlay: Scanlines */}
      <div className="scanlines" />

      {/* Sticky Sidebar Navigation */}
      <SidebarNav letters={letters} />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Floating UI: Vertical Label */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 items-center z-40">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="rotate-90 text-[9px] tracking-[0.4em] uppercase opacity-20 whitespace-nowrap font-mono">
          Gravitational Pull
        </div>
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative z-10 text-center p-6">
        <div className="absolute top-12 right-12 text-right hidden md:block">
          <p className="text-[10px] font-mono opacity-30 uppercase tracking-widest">System Status: Active</p>
          <p className="text-[10px] font-mono opacity-30 uppercase tracking-widest">Protocol: Immersive_v4</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] text-indigo-400/60 tracking-[0.6em] uppercase font-mono mb-2">Transmission Initiated</span>
            <h1 className="text-5xl md:text-7xl font-serif italic font-light text-white/90 tracking-[0.2em]">
              写给过去的你
            </h1>
            <div className="h-[1px] w-32 bg-indigo-500/20" />
          </div>
          
          <p className="text-xs md:text-sm text-slate-400/40 tracking-[0.8em] uppercase font-mono max-w-lg leading-relaxed">
            A Time-Travel Letter in the Cosmic Void
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-16 flex flex-col items-center gap-4"
        >
          <span className="text-[9px] text-white/20 tracking-[0.6em] uppercase font-mono">Deciphering...</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_0_100px_rgba(255,255,255,0.1)]" />
        </motion.div>
      </section>

      {/* Directory Section */}
      <Directory letters={letters} />

      {/* Timeline Content */}
      <div className="relative pl-0 lg:pl-20">
        {mainLetters.map((letter, index) => (
          <LetterCard key={letter.id} letter={letter} index={index} />
        ))}
      </div>

      {/* Special Ending Section */}
      {endingLetter && <EndingSealed letter={endingLetter} />}

      {/* Floating Label: Bottom Left */}
      <div className="fixed bottom-10 left-10 hidden md:flex gap-6 items-center z-40 opacity-20 pointer-events-none">
        <div className="w-16 h-[1px] bg-white/40" />
        <span className="text-[9px] tracking-[0.8em] uppercase font-mono">Silence is the loudest sound</span>
      </div>
    </main>
  );
}
