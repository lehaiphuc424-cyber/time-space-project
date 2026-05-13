import { motion } from 'motion/react';
import { LayoutGrid } from 'lucide-react';
import { LetterEntry } from '../data/letters';

interface SidebarNavProps {
  letters: LetterEntry[];
}

export default function SidebarNav({ letters }: SidebarNavProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed left-0 top-0 h-full w-16 md:w-20 border-r border-white/5 flex flex-col items-center py-12 z-40 bg-black/40 backdrop-blur-md group hover:w-64 transition-all duration-500 ease-[0.16, 1, 0.3, 1] overflow-hidden">
      {/* Return to Catalog / Directory */}
      <button
        onClick={() => scrollTo('directory')}
        className="w-full px-4 mb-8 flex items-center gap-4 group/dir outline-none"
      >
        <div className="min-w-[32px] h-[32px] flex items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover/dir:bg-indigo-500/20 group-hover/dir:border-indigo-500/40 transition-all ml-1">
          <LayoutGrid className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-col items-start leading-none ml-2">
          <span className="text-[10px] font-mono text-indigo-400 tracking-widest uppercase mb-1">Navigation</span>
          <span className="text-sm font-serif text-white group-hover/dir:text-indigo-200 transition-colors">回到目录</span>
        </div>
      </button>

      <div className="flex-1 flex flex-col items-start gap-6 px-4 w-full overflow-y-auto no-scrollbar">
        {letters.map((letter, index) => (
          <button
            key={letter.id}
            onClick={() => scrollTo(letter.id)}
            className="flex items-center gap-4 w-full group/item text-left outline-none py-1"
          >
            <div className="min-w-[8px] h-[8px] bg-indigo-500/40 rounded-full ring-4 ring-indigo-500/0 group-hover/item:ring-indigo-500/20 group-hover/item:bg-indigo-400 transition-all mx-3" />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap">
              <span className="text-[10px] font-mono text-indigo-400 mr-2">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-xs font-serif text-white/60 group-hover/item:text-white transition-colors tracking-widest truncate max-w-[140px] inline-block">
                {letter.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto opacity-0 group-hover:opacity-40 transition-opacity text-[8px] font-mono tracking-[0.2em] text-white/50 text-center px-2">
        MEMORY_LINK_ESTABLISHED
      </div>
    </div>
  );
}
