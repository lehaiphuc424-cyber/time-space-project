import { motion } from 'motion/react';
import { LetterEntry } from '../data/letters';

interface DirectoryProps {
  letters: LetterEntry[];
}

export default function Directory({ letters }: DirectoryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section id="directory" className="min-h-screen flex flex-col items-center justify-center p-6 md:p-24 relative z-10">
      <div className="max-w-4xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-[10px] font-mono text-indigo-400 tracking-[0.8em] uppercase mb-4 block">
            Archive Directory
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white/90 italic tracking-widest">
            信笺名录
          </h2>
          <div className="h-px w-12 bg-white/10 mx-auto mt-8" />
          <p className="text-[10px] text-white/20 mt-4 font-mono uppercase tracking-[0.2em]">
            Total Entries: {letters.length} // Memory Fragments Detected
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
        >
          {letters.map((letter, index) => (
            <motion.a 
              key={letter.id}
              href={`#${letter.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(letter.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              variants={itemVariants}
              className="group flex items-center gap-6 py-4 border-b border-white/5 hover:border-indigo-500/20 transition-colors duration-500 cursor-pointer"
            >
              <span className="text-[10px] font-mono text-indigo-500/40 group-hover:text-indigo-400 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-serif text-white/60 group-hover:text-white transition-colors tracking-widest">
                  {letter.title}
                </h3>
                <p className="text-[9px] font-mono text-white/20 mt-1 uppercase tracking-tighter">
                  {letter.date || "Unknown Epoch"}
                </p>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-indigo-500/40 group-hover:scale-150 transition-all duration-500" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
