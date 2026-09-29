import { useState, type FC } from 'react';
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../lib/api';

interface ConversationProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectPrompt: (prompt: string) => void;
  creatorName?: string;
  hasReels?: boolean;
}

export const Conversation: FC<ConversationProps> = ({
  messages,
  isLoading,
  onSelectPrompt,
  creatorName,
  hasReels = true,
}) => {
  const [openSources, setOpenSources] = useState<Record<number, boolean>>({});

  const toggleSources = (index: number) => {
    setOpenSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const starterRows = [
    "Log today's reel",
    'What have you learned about this client?',
    'Plan the next reel',
    'Compare the latest reel with the previous one',
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 transition-colors">
      <div className="max-w-[720px] mx-auto min-h-full flex flex-col justify-end">
        {messages.length === 0 ? (
          <div className="my-auto py-12 text-center max-w-[500px] mx-auto w-full">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#6C3BFF]/10 flex items-center justify-center text-[#6C3BFF] dark:text-[#B9A7FF]">
              <Sparkles size={18} />
            </div>
            <h2 className="text-[17px] font-display font-bold text-[var(--ink-color)] mb-1">
              {creatorName ? `${creatorName} memory` : 'Client memory'}
            </h2>
            <p className="text-[13px] text-[#6B675F] dark:text-[#9E9B95] mb-6">
              {hasReels
                ? 'Ask questions, plan reels from live performance data, or log recent results.'
                : 'No performance data logged yet. Log your first reel or ask for general planning guidance.'}
            </p>

            <div className="space-y-2 text-left">
              {starterRows.map((starter) => (
                <button
                  key={starter}
                  onClick={() => onSelectPrompt(starter)}
                  className="w-full text-left px-3.5 py-2.5 rounded-[6px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-white dark:bg-[#1f1f1f] hover:border-[#6C3BFF] text-[var(--ink-color)] text-[13px] transition-colors cursor-pointer flex items-center justify-between shadow-xs"
                >
                  <span>{starter}</span>
                  <ChevronRight size={14} className="text-[#6B675F] dark:text-[#9E9B95]" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                {msg.role === 'user' ? (
                  /* User message */
                  <div className="self-end max-w-[85%] bg-white dark:bg-[#222] border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[8px] px-4 py-2.5 text-[14px] text-[var(--ink-color)] leading-relaxed shadow-xs">
                    {msg.content}
                  </div>
                ) : (
                  /* Assistant message */
                  <div className="self-start max-w-full w-full py-1">
                    <div className="text-[15px] leading-relaxed text-[var(--ink-color)] whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Expandable Sources line if present */}
                    {msg.sources && (
                      <div className="mt-3 pt-2 border-t border-[#D8D4CA]/60 dark:border-[#3a3a3a]/60">
                        <button
                          onClick={() => toggleSources(index)}
                          className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] hover:underline cursor-pointer"
                        >
                          {openSources[index] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <span>SOURCES & MEMORY PROOFS</span>
                        </button>

                        {openSources[index] && (
                          <div className="mt-2 pl-3 border-l-2 border-[#6C3BFF] space-y-2 text-[12px] text-[#6B675F] dark:text-[#9E9B95] bg-black/[0.02] dark:bg-white/[0.02] p-2 rounded-r-[4px]">
                            {msg.sources.pattern_scores && msg.sources.pattern_scores.length > 0 && (
                              <div>
                                <span className="font-semibold text-[var(--ink-color)] font-mono-tech text-[10px] block">
                                  PATTERN SCORES:
                                </span>{' '}
                                <span className="font-mono-tech text-[11px]">
                                  {msg.sources.pattern_scores
                                    .map(
                                      (s: any) =>
                                        `${s.hook_type || s.hook}: ${typeof s.score === 'number' ? s.score.toFixed(2) : s.score}`
                                    )
                                    .join(' • ')}
                                </span>
                              </div>
                            )}

                            {msg.sources.reels && msg.sources.reels.length > 0 && (
                              <div>
                                <span className="font-semibold text-[var(--ink-color)] font-mono-tech text-[10px] block">
                                  REELS REFERENCED:
                                </span>{' '}
                                <span className="font-mono-tech text-[11px]">
                                  {msg.sources.reels.length} recorded
                                </span>
                              </div>
                            )}

                            {msg.sources.recalled_memories && msg.sources.recalled_memories.length > 0 && (
                              <div>
                                <span className="font-semibold text-[#6C3BFF] dark:text-[#B9A7FF] font-mono-tech text-[10px] block">
                                  HINDSIGHT MEMORIES:
                                </span>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                  {msg.sources.recalled_memories.map((text: string, i: number) => (
                                    <li key={i}>{text}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="self-start py-2 flex items-center gap-2 text-[12px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF]">
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF] pulse-purple" />
                <span>MIRA IS REASONING OVER MEMORY...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
