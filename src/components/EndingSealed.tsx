import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { LetterEntry } from '../data/letters';

// --- Particle Heart Component (The Final Reveal) ---
function ParticleHeart() {
  const points = useRef<THREE.Points>(null!);
  const count = 5000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Standard Heart Formula (t from 0 to 2pi)
      const t = Math.random() * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Add random spread for 3D effect and volume
      const r = Math.random();
      pos[i * 3] = x * r * 0.15;
      pos[i * 3 + 1] = y * r * 0.15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
      points.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05);
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ff7eb9"
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

// --- Char Dissolve Logic ---
interface VanishingCharProps {
  char: string;
  onVanish: () => void;
  pIndex: number;
  cIndex: number;
}

function VanishingChar({ char, onVanish, pIndex, cIndex }: VanishingCharProps) {
  const [status, setStatus] = useState<'normal' | 'gold' | 'vanished'>('normal');

  const handleClick = () => {
    if (status === 'normal') {
      setStatus('gold'); // Reusing internal state name but changing color in class
      // Delay to show blue state then vanish
      setTimeout(() => {
        setStatus('vanished');
        onVanish();
      }, 500);
    }
  };

  if (char === " " || char === "\n") return <span>{char}</span>;

  return (
    <AnimatePresence>
      {status !== 'vanished' && (
        <motion.span
          onClick={handleClick}
          className={`inline-block cursor-pointer select-none transition-colors duration-500 ${
            status === 'gold' ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'text-white'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            scale: 2,
            opacity: 0,
            x: (Math.random() - 0.5) * 100,
            y: -100 - Math.random() * 100,
            filter: "blur(4px)",
            transition: { duration: 1.5, ease: "easeOut" }
          }}
          whileHover={{ scale: 1.1, color: "rgba(255, 215, 0, 0.8)" }}
        >
          {char}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function EndingSealed({ letter }: EndingSealedProps) {
  const totalChars = useMemo(() => {
    const contentChars = letter.content.reduce((acc, p) => acc + p.replace(/\s/g, "").length, 0);
    const titleChars = letter.title.replace(/\s/g, "").length;
    return contentChars + titleChars;
  }, [letter]);
  
  const [vanishedCount, setVanishedCount] = useState(0);
  const isComplete = vanishedCount >= totalChars && totalChars > 0;

  const handleVanish = useCallback(() => {
    setVanishedCount(prev => prev + 1);
  }, []);

  return (
    <section id="ending" className="min-h-[120vh] relative flex items-center justify-center p-6 md:p-24 overflow-hidden z-20 pb-40">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <AnimatePresence>
            {isComplete && (
              <motion.group 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{ duration: 4, ease: "easeOut" }}
              >
                <ParticleHeart />
              </motion.group>
            )}
          </AnimatePresence>
          <fog attach="fog" args={['#000a1a', 5, 30]} />
        </Canvas>
      </div>

      <div className="max-w-3xl w-full relative">
        <motion.div
          className="text-center"
          animate={isComplete ? { opacity: 0, transition: { duration: 2 } } : {}}
        >
          <header className="mb-20">
             {/* Chapter Title with Vanishing logic */}
             <div className="text-5xl md:text-7xl font-serif italic text-white flex flex-wrap justify-center gap-2 mb-4">
                {letter.title.split("").map((char, i) => (
                  <VanishingChar key={`title-${i}`} char={char} onVanish={handleVanish} pIndex={-1} cIndex={i} />
                ))}
             </div>
             <motion.div className="w-12 h-[1px] bg-indigo-500/40 mx-auto mt-8" />
          </header>

          <div className="space-y-12 text-lg md:text-2xl font-serif font-light text-slate-200 leading-relaxed text-justify px-4">
            {letter.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="relative">
                {paragraph.split("").map((char, cIndex) => (
                  <VanishingChar 
                    key={`${pIndex}-${cIndex}`} 
                    char={char} 
                    onVanish={handleVanish} 
                    pIndex={pIndex} 
                    cIndex={cIndex} 
                  />
                ))}
              </p>
            ))}
          </div>

          <footer className="mt-32 opacity-40">
             <p className="text-[10px] font-mono tracking-[1em] uppercase">
                {letter.date} // Memory Purified
             </p>
             <p className="text-[9px] text-indigo-400 mt-4 italic">
                Destroy every word to see what remains.
             </p>
          </footer>
        </motion.div>

        {/* Finale Message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 3 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <h3 className="text-pink-200 text-2xl md:text-3xl font-serif italic tracking-[0.3em] mb-4 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]">
                爱是永恒的。
              </h3>
              <p className="text-white/20 text-[10px] font-mono tracking-[0.5em] uppercase">
                End of Transmission // Forever Sealed
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface EndingSealedProps {
  letter: LetterEntry;
}

