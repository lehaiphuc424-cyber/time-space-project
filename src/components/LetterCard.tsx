
import { motion, Variants } from 'motion/react';
import { LetterEntry } from '../data/letters';

interface LetterCardProps {
  letter: LetterEntry;
  index: number;
}

export default function LetterCard({ letter, index }: LetterCardProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 100, rotateX: 5, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 1, 
      scale: 1,
      transition: { 
        duration: 2.5, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.4
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 2, ease: "easeOut" }
    }
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, x: index % 2 === 0 ? 100 : -100, scale: 1.1 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 3, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.5
      }
    }
  };

  const aestheticImages = [
    "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=1200", // 01: Misty lake
    "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1200", // 02: Blue night moon (Updated)
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200", // 03: Minimal beach
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200", // 04: Lush woods
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1200", // 05: Forest bench (Updated)
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200", // 06: High-detail city architecture (Updated)
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200", // 07: Minimalist Thailand-style cafe (Updated)
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200", // 08: Peaceful lake
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200", // 09: Aesthetic window
    "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1200"  // 10: coastal cliff
  ];

  const currentImage = aestheticImages[index % aestheticImages.length];

  return (
    <motion.section
      id={letter.id}
      className={`min-h-screen flex items-center justify-center p-6 md:p-24 relative z-10 perspective-1000 ${letter.isEnding ? 'hidden' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className={`w-full max-w-6xl flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 md:gap-20`}>
        {/* Content Box */}
        <div className={`flex-1 p-10 md:p-14 rounded-sm backdrop-blur-2xl bg-white/[0.02] border border-white/5 shadow-[0_0_100px_rgba(79,70,229,0.05)] relative group transition-all duration-1000 hover:bg-white/[0.04]`}>
          
          {/* Corner Accents */}
          <div className="corner-accent top-[-1px] left-[-1px] border-t border-l opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
          <div className="corner-accent bottom-[-1px] right-[-1px] border-b border-r opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

          <div className="absolute top-8 right-8 text-right hidden md:block">
            <p className="text-[9px] font-mono opacity-30 uppercase tracking-[0.3em]">Transmission: {letter.id.toUpperCase()}-VOID</p>
            <p className="text-[9px] font-mono opacity-20 uppercase tracking-[0.2em] mt-1">Signal: Weak / Constant</p>
          </div>
          
          <div className="relative">
            <motion.header variants={itemVariants} className="mb-10">
              <span className="text-[10px] font-mono text-indigo-400/80 mb-2 block tracking-[0.4em] uppercase">
                // {index === 0 ? "The First Echo" : `Sequence 0${index + 1}`}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-white/90 leading-tight">
                {letter.title}
              </h2>
            </motion.header>
            
            <div className="space-y-6">
              {letter.content.map((paragraph, pIndex) => (
                <motion.p
                  key={pIndex}
                  variants={itemVariants}
                  className={`text-base md:text-lg text-slate-300 leading-relaxed font-serif font-light tracking-wide text-justify ${pIndex === 0 ? 'first-letter:text-4xl first-letter:md:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-indigo-400 first-letter:font-light' : ''}`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <footer className="mt-16 flex justify-between items-end border-t border-white/5 pt-8">
              <div className="text-[10px] font-mono opacity-30">
                <p className="uppercase tracking-widest">{letter.date || "NO_DATE_STAMP"}</p>
                <p className="mt-1">STATUS: {letter.isEnding ? "SEALED" : "UNSENT / LOOP"}</p>
              </div>
              <div className="text-right">
                <motion.div 
                  variants={itemVariants}
                  className="text-xs italic font-serif text-white/40 mb-2"
                >
                  {letter.isEnding ? "Yours, in the void." : "Keep drifting..."}
                </motion.div>
                <div className="h-[1px] w-12 bg-indigo-500/40 ml-auto" />
              </div>
            </footer>
          </div>
          
          {/* Sequence Indicator */}
          <div className="absolute bottom-4 left-8 text-[40px] font-mono font-bold text-white/[0.02] pointer-events-none select-none italic">
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Dynamic Slide-in Image Container */}
        <motion.div 
          variants={imageVariants}
          className="w-full lg:w-[400px] aspect-[4/5] overflow-hidden rounded-sm border border-white/10 relative group/img shadow-2xl"
        >
          <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay z-10" />
          <img 
            src={currentImage} 
            alt="Atmospheric landscape" 
            className="w-full h-full object-cover grayscale-[0.3] brightness-75 group-hover/img:scale-105 group-hover/img:grayscale-0 group-hover/img:brightness-100 transition-all duration-[2000ms]"
          />
          <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700">
            <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase bg-black/40 px-3 py-1 backdrop-blur-md border border-white/10">
              Deciphered_Context_v5
            </span>
          </div>
          
          {/* Decorative scanner line */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] bg-indigo-500/20 z-20"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
