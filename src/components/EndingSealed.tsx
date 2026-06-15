import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, Music, Volume2, HelpCircle } from 'lucide-react';
import { LetterEntry } from '../data/letters';

// --- Particle Heart Component (The Final Reveal) ---
// This uses the exact scatter, shrink, and beating mathematics mentioned in the Python script!
function ParticleHeart() {
  const points = useRef<THREE.Points>(null!);
  const count = 7000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // 1. Classic heart envelope equation (t from 0 to 2pi)
      const t = Math.random() * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      let px = x;
      let py = y;
      let pz = (Math.random() - 0.5) * 4; // Add 3D thickness

      // 2. Distribute particles based on Tkinter's logic (Edge vs Scattered vs Shrunk Core)
      if (i < 2500) {
        // High density edge boundary particles with subtle noise
        px += (Math.random() - 0.5) * 0.4;
        py += (Math.random() - 0.5) * 0.4;
      } else if (i < 5500) {
        // Logarithmic scatter inside distribution from the python code!
        // ratio_x = - beta * log(random.random())
        const beta = 0.15;
        const ratio_x = -beta * Math.log(Math.random() + 0.0001);
        const ratio_y = -beta * Math.log(Math.random() + 0.0001);
        px = px - ratio_x * px;
        py = py - ratio_y * py;
        pz = pz * (1 - ratio_x);
      } else {
        // Shrink function logic (gravity force mapping to core center)
        const force = -1.0 / Math.pow((px * px + py * py) + 0.1, 0.65);
        px = px - 0.35 * force * px;
        py = py - 0.35 * force * py;
      }

      // Convert Tkinter 2D coordinates to appropriate 3D space size scales
      const scaleValue = 0.22;
      pos[i * 3] = px * scaleValue;
      pos[i * 3 + 1] = py * scaleValue; // positive y is up in ThreeJS relative to tkinter's negative y
      pos[i * 3 + 2] = pz * scaleValue;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (points.current) {
      const time = state.clock.getElapsedTime();
      
      // Calculate beating curve from the provided python equation: curve(p) = 2 * (2 * sin(4 * p)) / (2 * pi)
      // This creates a sharp heartbeat pulse that contracts and expands rhythmically
      const p = time * Math.PI; // speed mapping
      const beat = 1.0 + 0.12 * Math.sin(p * 2) * Math.exp(-Math.pow(Math.sin(p), 2));
      
      points.current.scale.set(beat, beat, beat);
      points.current.rotation.y = time * 0.2; // Smooth continuous horizontal spinning
      points.current.rotation.x = Math.sin(time * 0.15) * 0.1; // Gentle up-down nod
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ff69b4" // Bright neon pink watercolor
        size={0.11}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
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
  forceVanish?: boolean;
}

function VanishingChar({ char, onVanish, pIndex, cIndex, forceVanish }: VanishingCharProps) {
  const [status, setStatus] = useState<'normal' | 'blue' | 'vanished'>('normal');

  const handleClick = () => {
    if (status === 'normal') {
      setStatus('blue'); // Turn neon blue immediately
      setTimeout(() => {
        setStatus('vanished');
        onVanish();
      }, 500);
    }
  };

  // Keyboard broadcast hook to trigger randomized stardust wave
  useEffect(() => {
    if (forceVanish && status === 'normal') {
      // Randomized delays make all words dissolve like sand blown away in waves!
      const randomDelay = Math.random() * 1200;
      const t1 = setTimeout(() => {
        setStatus('blue');
      }, randomDelay);

      const t2 = setTimeout(() => {
        setStatus('vanished');
        onVanish();
      }, randomDelay + 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [forceVanish, status, onVanish]);

  if (char === " " || char === "\n") return <span>{char}</span>;

  return (
    <AnimatePresence>
      {status !== 'vanished' && (
        <motion.span
          onClick={handleClick}
          className={`inline-block cursor-pointer select-none transition-colors duration-500 pb-[1px] ${
            status === 'blue' 
              ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.9)] font-semibold' 
              : 'text-slate-100 hover:text-blue-300'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            scale: 2.3,
            opacity: 0,
            x: (Math.random() - 0.5) * 150,
            y: -120 - Math.random() * 150,
            filter: "blur(6px)",
            transition: { duration: 1.8, ease: "easeOut" }
          }}
          whileHover={{ scale: 1.15, textShadow: "0 0 8px #60a5fa" }}
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
  const [isForceVanished, setIsForceVanished] = useState(false);
  const isComplete = vanishedCount >= totalChars && totalChars > 0;

  const handleVanish = useCallback(() => {
    setVanishedCount(prev => prev + 1);
  }, []);

  // Keyboard shortcut Ctrl+A or Cmd+A handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault(); // Stop standard browser highlighting
        if (!isForceVanished) {
          setIsForceVanished(true);
          // Instantly set count to complete to trigger the heart emerging
          setVanishedCount(totalChars);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalChars, isForceVanished]);

  // --- HTML5 Audio & Native Web Audio Synthesizer Orchestration ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);

  // Web Audio Synth Variables
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);
  const [isSynthMode, setIsSynthMode] = useState(false);

  // Stop custom synthesizer play
  const stopSynthesizer = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  // Web Audio synth layout playing the actual high-tide melodic loop of "诀别书"
  const playSynthesizerMelody = useCallback(() => {
    stopSynthesizer();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const melody = [
        // 这一生 (E5 D5 C5)
        { note: 659.25, dur: 0.4, delay: 0.0 }, // E5
        { note: 587.33, dur: 0.4, delay: 0.4 }, // D5
        { note: 523.25, dur: 0.8, delay: 0.8 }, // C5

        // 一纸诀别 (D5 C5 A4 G4)
        { note: 587.33, dur: 0.4, delay: 1.6 }, // D5
        { note: 523.25, dur: 0.4, delay: 2.0 }, // C5
        { note: 440.00, dur: 0.4, delay: 2.4 }, // A4
        { note: 392.00, dur: 0.8, delay: 2.8 }, // G4

        // 泪已干 (A4 C5 D5 C5)
        { note: 440.00, dur: 0.4, delay: 3.6 }, // A4
        { note: 523.25, dur: 0.4, delay: 4.0 }, // C5
        { note: 587.33, dur: 0.4, delay: 4.4 }, // D5
        { note: 523.25, dur: 1.2, delay: 4.8 }, // C5

        // 离去的姓名 (G4 A4 C5 D5 E5)
        { note: 392.00, dur: 0.4, delay: 6.4 }, // G4
        { note: 440.00, dur: 0.4, delay: 6.8 }, // A4
        { note: 523.25, dur: 0.4, delay: 7.2 }, // C5
        { note: 587.33, dur: 0.4, delay: 7.6 }, // D5
        { note: 659.25, dur: 1.2, delay: 8.0 }  // E5
      ];

      const playSequence = () => {
        const now = ctx.currentTime;
        melody.forEach((item) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();

          oscNode.type = 'triangle'; // Mellifluous chime/organ tone
          oscNode.frequency.setValueAtTime(item.note, now + item.delay);

          // Beautiful music-box ADSR attack & ambient fade
          gainNode.gain.setValueAtTime(0, now + item.delay);
          gainNode.gain.linearRampToValueAtTime(0.15 * volume, now + item.delay + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + item.delay + item.dur);

          // Cozy lowpass filter to emulate dreamy, fuzzy lofi tape effects
          const lpFilter = ctx.createBiquadFilter();
          lpFilter.type = 'lowpass';
          lpFilter.frequency.setValueAtTime(1200, now + item.delay);

          oscNode.connect(lpFilter);
          lpFilter.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscNode.start(now + item.delay);
          oscNode.stop(now + item.delay + item.dur);
        });
      };

      playSequence();
      // Melodic loop cycle duration (10.0 seconds)
      synthIntervalRef.current = setInterval(playSequence, 10000);

    } catch (e) {
      console.warn("Synth failed to boot:", e);
    }
  }, [volume, stopSynthesizer]);

  // Handle playing music when completed
  useEffect(() => {
    if (isComplete) {
      if (isSynthMode) {
        playSynthesizerMelody();
        setIsPlaying(true);
      } else {
        stopSynthesizer();
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.muted = isMuted;
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((e) => {
              console.log("Autoplay blocked/failed, waiting for explicit user gesture:", e);
              setIsPlaying(false);
            });
        }
      }
    }
    return () => {
      stopSynthesizer();
    };
  }, [isComplete, isSynthMode, volume, isMuted, playSynthesizerMelody, stopSynthesizer]);

  // Audio Playback Toggles
  const handleTogglePlay = () => {
    if (isComplete) {
      if (isPlaying) {
        if (isSynthMode) {
          stopSynthesizer();
        } else {
          audioRef.current?.pause();
        }
        setIsPlaying(false);
      } else {
        if (isSynthMode) {
          playSynthesizerMelody();
          setIsPlaying(true);
        } else {
          audioRef.current?.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.log("Audio play failed:", err);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const toggleSynthMode = () => {
    if (!isComplete) return;
    setIsSynthMode(prev => {
      const next = !prev;
      if (next) {
        audioRef.current?.pause();
        // Give small gap to allow browser audio queue clean
        setTimeout(() => playSynthesizerMelody(), 100);
      } else {
        stopSynthesizer();
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play().catch(() => console.log("Standard audio stream couldn't restart"));
          }
        }, 100);
      }
      return next;
    });
  };

  return (
    <section id="ending" className="min-h-[120vh] relative flex items-center justify-center p-6 md:p-24 overflow-hidden z-20 pb-40">
      {/* Background Ambience / ThreeJS particle canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.6} />
          {isComplete && (
            <group scale={1.5}>
              <ParticleHeart />
            </group>
          )}
          <fog attach="fog" args={['#000a1a', 5, 30]} />
        </Canvas>
      </div>

      {/* Embedded HTML5 Audio Element for the gorgeous song 《诀别书》 */}
      {isComplete && (
        <audio
          ref={audioRef}
          loop
          preload="auto"
          src="https://music.163.com/song/media/outer/url?id=1943867010.mp3"
        >
          {/* Fallback alternative NetEase host stream ids for the same song */}
          <source src="https://music.163.com/song/media/outer/url?id=1943867010.mp3" type="audio/mpeg" />
          <source src="https://music.163.com/song/media/outer/url?id=1849138407.mp3" type="audio/mpeg" />
        </audio>
      )}

      <div className="max-w-3xl w-full relative">
        <motion.div
          className="text-center"
          animate={isComplete ? { opacity: 0, scale: 0.95, y: -20, transition: { duration: 2.2, ease: "easeInOut" } } : {}}
        >
          <header className="mb-20">
             {/* Chapter Title with Vanishing logic */}
             <div className="text-5xl md:text-7xl font-serif italic text-white flex flex-wrap justify-center gap-2 mb-4">
                {letter.title.split("").map((char, i) => (
                  <VanishingChar 
                    key={`title-${i}`} 
                    char={char} 
                    onVanish={handleVanish} 
                    pIndex={-1} 
                    cIndex={i} 
                    forceVanish={isForceVanished}
                  />
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
                    forceVanish={isForceVanished}
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
             <p className="text-[9px] text-slate-500 mt-2">
                Tip: Press <span className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded font-bold">Ctrl + A</span> to vanish all words at once.
             </p>
          </footer>
        </motion.div>

        {/* Finale Message on completion */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 3, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <h3 className="text-pink-200 text-3xl md:text-4xl font-serif italic tracking-[0.4em] mb-4 text-center drop-shadow-[0_0_20px_rgba(244,114,182,0.65)]">
                爱是永恒的
              </h3>
              <p className="text-white/20 text-[10px] font-mono tracking-[0.6em] uppercase text-center">
                End of Transmission // Forever Sealed
              </p>

              {/* Minimal interactive HUD Audio Player to control the chorus music */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.8, duration: 1.5 }}
                className="mt-12 p-4 px-6 rounded-2xl bg-black/50 border border-pink-500/10 backdrop-blur-md pointer-events-auto flex flex-col sm:flex-row items-center gap-6 shadow-[0_4px_30px_rgba(244,114,182,0.1)] max-w-md"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${isPlaying ? 'bg-pink-500/20 text-pink-300 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                    <Music className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 tracking-wide truncate max-w-[150px]">
                      {isSynthMode ? '《诀别书》(Synth Cover)' : '《诀别书》'}
                    </p>
                    <p className="text-[9px] text-pink-400 font-mono tracking-wider">
                      {isSynthMode ? 'Nostalgic Chime Mode' : 'Popular Chorus Snippet'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-700/40 pt-3 sm:pt-0 sm:pl-4">
                  {/* Play Toggle */}
                  <button
                    onClick={handleTogglePlay}
                    className="p-2 rounded-full hover:bg-slate-800/80 text-slate-300 hover:text-pink-300 transition-colors"
                    title={isPlaying ? 'Pause Music' : 'Play Music'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  {/* Mode Selector */}
                  <button
                    onClick={toggleSynthMode}
                    className={`text-[9px] font-mono p-1 px-2.5 rounded-full border transition-all ${
                      isSynthMode 
                        ? 'bg-pink-500/20 text-pink-300 border-pink-400/40 shadow-[0_0_8px_rgba(244,114,182,0.3)]' 
                        : 'bg-transparent text-slate-500 border-slate-700 hover:text-slate-300 hover:border-slate-500'
                    }`}
                    title="Switch to Nostalgic Offline Synthesizer Cover"
                  >
                    Synth Mode
                  </button>

                  <div className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        if (audioRef.current) audioRef.current.volume = v;
                      }}
                      className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
                    />
                  </div>
                </div>
              </motion.div>
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


