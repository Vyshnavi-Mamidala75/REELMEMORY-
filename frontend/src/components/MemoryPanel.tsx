import type { FC } from 'react';
import { PanelRightClose, Sparkles } from 'lucide-react';
import type { PatternScore, Reel } from '../lib/api';

interface MemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName?: string;
  learnedText: string;
  scores: PatternScore[];
  recentReels: Reel[];
  isLoading: boolean;
  onOpenCompare: () => void;
}

export const MemoryPanel: FC<MemoryPanelProps> = ({
  isOpen,
  onClose,
  creatorName,
  learnedText,
  scores,
  recentReels,
  isLoading,
  onOpenCompare,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="w-[320px] shrink-0 border-l border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9] dark:bg-[#171717] flex flex-col h-screen overflow-hidden text-[var(--ink-color)] select-none transition-colors duration-150">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#D8D4CA] dark:border-[#3a3a3a] shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-[14px]">Client memory</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
        </div>
        <button
          onClick={onClose}
          title="Collapse panel"
          className="p-1.5 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] hover:text-[var(--ink-color)] transition-colors cursor-pointer"
        >
          <PanelRightClose size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section 1: What I've learned about <client> */}
        <section>
          <h3 className="text-[12px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-2 font-semibold">
            WHAT MIRA LEARNED • {creatorName || 'CLIENT'}
          </h3>
          <div className="bg-white dark:bg-[#1f1f1f] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[6px] p-3.5 text-[13px] text-[var(--ink-color)] leading-relaxed shadow-xs">
            {isLoading ? (
              <div className="space-y-2 py-1">
                <div className="h-3 bg-[#D8D4CA] dark:bg-[#3a3a3a] rounded animate-pulse w-full" />
                <div className="h-3 bg-[#D8D4CA] dark:bg-[#3a3a3a] rounded animate-pulse w-4/5" />
                <div className="h-3 bg-[#D8D4CA] dark:bg-[#3a3a3a] rounded animate-pulse w-3/4" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{learnedText}</p>
            )}
          </div>
        </section>

        {/* Section 2: What works / what doesn't */}
        <section>
          <h3 className="text-[12px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-2 font-semibold">
            HOOK CONFIDENCE & WIN RATIOS
          </h3>
          <div className="bg-white dark:bg-[#1f1f1f] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[6px] p-3.5 space-y-3.5 shadow-xs">
            {scores.length === 0 ? (
              <p className="text-[12px] text-[#6B675F] dark:text-[#9E9B95]">
                No pattern scores calculated yet.
              </p>
            ) : (
              scores.map((item) => {
                const percentage = Math.min(Math.max(item.score * 100, 5), 100);
                const isHigh = item.score >= 0.7;
                return (
                  <div key={item.hook_type} className="space-y-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-medium capitalize text-[var(--ink-color)]">
                        {item.hook_type.replace('_', ' ')}
                      </span>
                      <span className="font-mono-tech font-bold text-[#6C3BFF] dark:text-[#B9A7FF]">
                        {typeof item.score === 'number' ? `${(item.score * 100).toFixed(0)}%` : item.score}
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isHigh ? 'bg-[#6C3BFF]' : 'bg-[#6B675F] dark:bg-[#9E9B95]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Section 3: Recent reels */}
        <section>
          <h3 className="text-[12px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-2 font-semibold">
            RECENT REELS LOG
          </h3>
          <div className="bg-white dark:bg-[#1f1f1f] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[6px] overflow-hidden shadow-xs">
            {recentReels.length === 0 ? (
              <div className="p-3 text-[12px] text-[#6B675F] dark:text-[#9E9B95]">
                No reels logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#D8D4CA] dark:border-[#3a3a3a] bg-black/[0.02] dark:bg-white/[0.02] text-[#6B675F] dark:text-[#9E9B95] font-mono-tech">
                      <th className="py-1.5 px-2.5 font-normal">HOOK</th>
                      <th className="py-1.5 px-2 font-normal text-right">VIEWS</th>
                      <th className="py-1.5 px-2 font-normal text-right">SAVES</th>
                      <th className="py-1.5 px-2.5 font-normal text-right">SHARES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D4CA]/50 dark:divide-[#3a3a3a]/50">
                    {recentReels.slice(-6).reverse().map((reel, idx) => (
                      <tr key={reel.id || idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-1.5 px-2.5 text-[var(--ink-color)] font-medium truncate max-w-[90px]">
                          {reel.hook_type.replace('_', ' ')}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
                          {reel.views.toLocaleString()}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] font-semibold">
                          {reel.saves}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
                          {reel.shares}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Compare button */}
        <div className="pt-2 pb-4">
          <button
            onClick={onOpenCompare}
            className="w-full py-2.5 px-3 rounded-[6px] bg-white dark:bg-[#1f1f1f] border border-[#D8D4CA] dark:border-[#3a3a3a] hover:border-[#6C3BFF] text-[var(--ink-color)] text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
          >
            <Sparkles size={15} className="text-[#6C3BFF] dark:text-[#B9A7FF] group-hover:scale-110 transition-transform" />
            <span>Compare with and without memory</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
