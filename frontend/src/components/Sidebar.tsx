import type { FC } from 'react';
import {
  Plus,
  PanelLeft,
  Users,
  Brain,
  FileText,
  Settings,
  Home,
} from 'lucide-react';
import type { Creator } from '../lib/api';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  creators: Creator[];
  activeCreatorId: string;
  onSelectCreator: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
  reelCounts?: Record<string, number>;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onGoToLanding: () => void;
  activeNavTab: 'clients' | 'memory' | 'reels' | 'settings';
  onSelectNavTab: (tab: 'clients' | 'memory' | 'reels' | 'settings') => void;
}

export const Sidebar: FC<SidebarProps> = ({
  creators,
  activeCreatorId,
  onSelectCreator,
  onNewChat,
  isOpen,
  onToggle,
  reelCounts = {},
  theme,
  onToggleTheme,
  onGoToLanding,
  activeNavTab,
  onSelectNavTab,
}) => {
  if (!isOpen) {
    return (
      <aside className="hidden md:flex flex-col items-center justify-between py-4 px-2 border-r border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9] dark:bg-[#171717] w-14 shrink-0 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggle}
            title="Open sidebar"
            className="p-2 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] hover:text-[var(--ink-color)] transition-colors cursor-pointer"
          >
            <PanelLeft size={18} />
          </button>

          <img
            src="/mira-logo.png"
            alt="MIRA"
            className="w-5 h-5 object-contain dark:invert cursor-pointer"
            onClick={onGoToLanding}
            title="Return to Landing Page"
          />

          <button
            onClick={onNewChat}
            title="New chat"
            className="p-2 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] transition-colors cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[260px] shrink-0 border-r border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9] dark:bg-[#171717] flex flex-col h-screen text-[var(--ink-color)] select-none transition-colors duration-150">
      {/* Top Header: Collapse icon + Wordmark + More icon (Image 4) */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            className="p-1.5 -ml-1 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] hover:text-[var(--ink-color)] transition-colors cursor-pointer"
          >
            <PanelLeft size={18} />
          </button>

          <div
            onClick={onGoToLanding}
            className="flex items-center gap-2 cursor-pointer group"
            title="Go to Landing Page"
          >
            <img
              src="/mira-logo.png"
              alt="MIRA"
              className="w-5 h-5 object-contain dark:invert group-hover:scale-105 transition-transform"
            />
            <span className="font-display font-bold text-[16px] tracking-tight">
              Mira
            </span>
          </div>
        </div>

        <button
          onClick={onGoToLanding}
          title="Back to Landing Page"
          className="p-1.5 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] hover:text-[var(--ink-color)] transition-colors text-[11px] font-mono-tech flex items-center gap-1 cursor-pointer"
        >
          <Home size={14} />
        </button>
      </div>

      {/* "+ New chat" as the first item, icon-led */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--ink-color)] text-[13px] font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} className="text-[#6B675F] dark:text-[#9E9B95]" />
          <span>New chat</span>
        </button>
      </div>

      {/* Main Nav Items (Image 4): Clients · Memory · Reels log · Settings */}
      <div className="px-3 py-1 space-y-1">
        {/* Clients nav item */}
        <button
          onClick={() => onSelectNavTab('clients')}
          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[8px] text-[13px] font-medium text-left transition-colors cursor-pointer ${
            activeNavTab === 'clients'
              ? 'bg-black/[0.07] dark:bg-white/[0.08] text-[var(--ink-color)]'
              : 'text-[#6B675F] dark:text-[#9E9B95] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[var(--ink-color)]'
          }`}
        >
          <Users size={16} className={activeNavTab === 'clients' ? 'text-[#6C3BFF] dark:text-[#B9A7FF]' : ''} />
          <span>Clients</span>
        </button>

        {/* Memory nav item */}
        <button
          onClick={() => onSelectNavTab('memory')}
          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[8px] text-[13px] font-medium text-left transition-colors cursor-pointer ${
            activeNavTab === 'memory'
              ? 'bg-black/[0.07] dark:bg-white/[0.08] text-[var(--ink-color)]'
              : 'text-[#6B675F] dark:text-[#9E9B95] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[var(--ink-color)]'
          }`}
        >
          <Brain size={16} className={activeNavTab === 'memory' ? 'text-[#6C3BFF] dark:text-[#B9A7FF]' : ''} />
          <span>Memory</span>
        </button>

        {/* Reels log nav item */}
        <button
          onClick={() => onSelectNavTab('reels')}
          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[8px] text-[13px] font-medium text-left transition-colors cursor-pointer ${
            activeNavTab === 'reels'
              ? 'bg-black/[0.07] dark:bg-white/[0.08] text-[var(--ink-color)]'
              : 'text-[#6B675F] dark:text-[#9E9B95] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[var(--ink-color)]'
          }`}
        >
          <FileText size={16} className={activeNavTab === 'reels' ? 'text-[#6C3BFF] dark:text-[#B9A7FF]' : ''} />
          <span>Reels log</span>
        </button>

        {/* Settings nav item */}
        <button
          onClick={() => onSelectNavTab('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[8px] text-[13px] font-medium text-left transition-colors cursor-pointer ${
            activeNavTab === 'settings'
              ? 'bg-black/[0.07] dark:bg-white/[0.08] text-[var(--ink-color)]'
              : 'text-[#6B675F] dark:text-[#9E9B95] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[var(--ink-color)]'
          }`}
        >
          <Settings size={16} className={activeNavTab === 'settings' ? 'text-[#6C3BFF] dark:text-[#B9A7FF]' : ''} />
          <span>Settings</span>
        </button>
      </div>

      {/* Sub-list of client banks */}
      <div className="flex-1 overflow-y-auto px-3 py-2 mt-2 border-t border-[#D8D4CA]/50 dark:border-[#3a3a3a]/50">
        <div className="px-3 pb-2 text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
          CLIENT BANKS
        </div>

        <nav className="space-y-0.5">
          {creators.map((creator) => {
            const isCurrent = creator.id === activeCreatorId;
            const count = reelCounts[creator.id] ?? 0;
            const initial = creator.name ? creator.name.charAt(0).toUpperCase() : 'C';

            return (
              <button
                key={creator.id}
                onClick={() => onSelectCreator(creator.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-left transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-black/[0.08] dark:bg-white/[0.09] font-medium text-[var(--ink-color)]'
                    : 'text-[#6B675F] dark:text-[#9E9B95] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[var(--ink-color)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-[4px] flex items-center justify-center text-[10px] font-mono-tech shrink-0 ${
                      isCurrent
                        ? 'bg-[#6C3BFF] text-white'
                        : 'bg-[#D8D4CA]/80 dark:bg-[#3a3a3a] text-[#6B675F] dark:text-[#9E9B95]'
                    }`}
                  >
                    {initial}
                  </div>
                  <div className="truncate">
                    <div className="text-[13px] leading-tight truncate">{creator.name}</div>
                  </div>
                </div>

                <span className="text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] ml-2 shrink-0">
                  {count}r
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom: Pill-shaped Light/Dark Toggle + Status */}
      <div className="p-3 border-t border-[#D8D4CA] dark:border-[#3a3a3a] flex items-center justify-between">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
          <span>MEMORY ON</span>
        </div>
      </div>
    </aside>
  );
};
