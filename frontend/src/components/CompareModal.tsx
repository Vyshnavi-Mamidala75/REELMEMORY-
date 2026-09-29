import { useState, type FC } from 'react';
import { X, Play, Sparkles } from 'lucide-react';
import type { CompareResponse } from '../lib/api';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName?: string;
  onRunCompare: (brief: string) => Promise<CompareResponse>;
}

export const CompareModal: FC<CompareModalProps> = ({
  isOpen,
  onClose,
  creatorName,
  onRunCompare,
}) => {
  const [brief, setBrief] = useState('2BHK Kokapet launch reel');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRun = async () => {
    if (!brief.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await onRunCompare(brief);
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Comparison failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="bg-[#F3F1E9] dark:bg-[#171717] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[6px] w-full max-w-[840px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl transition-colors">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D8D4CA] dark:border-[#3a3a3a] flex items-center justify-between bg-white dark:bg-[#1a1a1a] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#6C3BFF] pulse-purple" />
            <div>
              <h2 className="text-[15px] font-display font-bold text-[var(--ink-color)]">
                Compare with and without memory
              </h2>
              <p className="text-[12px] text-[#6B675F] dark:text-[#9E9B95]">
                Evaluating recommendations for {creatorName || 'client'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] hover:text-[var(--ink-color)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Brief Input */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[6px] p-3 shadow-xs">
            <label className="block text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-1 font-semibold">
              CREATIVE BRIEF
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. 2BHK Kokapet launch reel"
                className="flex-1 bg-transparent border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[4px] px-3 py-1.5 text-[14px] text-[var(--ink-color)] focus:outline-none focus:border-[#6C3BFF]"
              />
              <button
                onClick={handleRun}
                disabled={loading || !brief.trim()}
                className="px-4 py-1.5 rounded-[4px] bg-[#6C3BFF] text-white hover:bg-[#582cd6] text-[12px] font-mono-tech font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                <Play size={12} />
                <span>{loading ? 'Evaluating...' : 'Run comparison'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-white dark:bg-[#1a1a1a] border border-[#E8380D]/40 rounded-[6px] text-[12px] text-[#E8380D]">
              {error}
            </div>
          )}

          {/* Side by side cards */}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: With Memory */}
                <div className="bg-white dark:bg-[#1a1a1a] border-2 border-[#6C3BFF] rounded-[6px] p-4 flex flex-col shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#6C3BFF]/30">
                    <span className="text-[13px] font-display font-bold text-[#6C3BFF] dark:text-[#B9A7FF] flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>With MIRA Memory</span>
                    </span>
                    <span className="text-[10px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] bg-[#6C3BFF]/10 px-2 py-0.5 rounded-[2px] font-semibold">
                      GROUNDED
                    </span>
                  </div>
                  <div className="text-[14px] leading-relaxed text-[var(--ink-color)] whitespace-pre-wrap flex-1">
                    {result.with_memory}
                  </div>
                </div>

                {/* Column 2: Without Memory */}
                <div className="bg-white dark:bg-[#1a1a1a] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[6px] p-4 flex flex-col shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
                    <span className="text-[13px] font-display font-medium text-[#6B675F] dark:text-[#9E9B95]">
                      Without Memory
                    </span>
                    <span className="text-[10px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-[2px]">
                      GENERIC BASELINE
                    </span>
                  </div>
                  <div className="text-[14px] leading-relaxed text-[#6B675F] dark:text-[#9E9B95] whitespace-pre-wrap flex-1">
                    {result.without_memory}
                  </div>
                </div>
              </div>

              {/* Memory Insight and Why */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[6px] p-4 space-y-3 shadow-xs">
                <div>
                  <span className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] block mb-1 font-semibold">
                    MEMORY INSIGHT (HINDSIGHT REFLECTION)
                  </span>
                  <p className="text-[13px] text-[var(--ink-color)] leading-relaxed">
                    {result.memory_insight}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D8D4CA]/60 dark:border-[#3a3a3a]/60">
                  <span className="text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] block mb-0.5 font-semibold">
                    DATA RATIONALE
                  </span>
                  <p className="font-mono-tech text-[12px] text-[var(--ink-color)]">
                    {result.why}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
