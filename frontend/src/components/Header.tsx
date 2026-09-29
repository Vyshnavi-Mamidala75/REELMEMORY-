import type { FC } from 'react';
import { PanelRight, RotateCw, PanelLeft, ArrowLeft } from 'lucide-react';
import type { Creator } from '../lib/api';

interface HeaderProps {
  activeCreator?: Creator;
  memoryStatus: 'connected' | 'offline' | 'checking';
  onRetryConnection: () => void;
  onToggleMemoryPanel: () => void;
  isMemoryPanelOpen: boolean;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onGoToLanding?: () => void;
}

export const Header: FC<HeaderProps> = ({
  activeCreator,
  memoryStatus,
  onRetryConnection,
  onToggleMemoryPanel,
  isMemoryPanelOpen,
  onToggleSidebar,
  isSidebarOpen,
  onGoToLanding,
}) => {
  return (
    <header className="h-14 border-b border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9] dark:bg-[#171717] px-4 flex items-center justify-between shrink-0 select-none transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            title="Open sidebar"
            className="p-1.5 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] hover:text-[var(--ink-color)] transition-colors cursor-pointer"
          >
            <PanelLeft size={18} />
          </button>
        )}

        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-[4px] border border-[#D8D4CA] dark:border-[#3a3a3a] hover:border-[#6C3BFF] text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] hover:text-[#6C3BFF] transition-all cursor-pointer mr-1"
            title="Back to Landing Page"
          >
            <ArrowLeft size={12} />
            <span>LANDING</span>
          </button>
        )}

        <div className="flex items-baseline gap-2 truncate">
          <h1 className="text-[14px] sm:text-[15px] font-display font-bold text-[var(--ink-color)] truncate">
            {activeCreator ? activeCreator.name : 'Select client'}
          </h1>
          {activeCreator && (
            <span className="text-[12px] text-[#6B675F] dark:text-[#9E9B95] truncate">
              {activeCreator.niche || `@${activeCreator.handle || activeCreator.id}`}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        {memoryStatus === 'connected' && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
            <span className="hidden sm:inline">MEMORY CONNECTED</span>
            <span className="sm:hidden">ONLINE</span>
          </div>
        )}

        {memoryStatus === 'checking' && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B675F] animate-pulse" />
            <span>CONNECTING...</span>
          </div>
        )}

        {memoryStatus === 'offline' && (
          <div className="flex items-center gap-2 text-[11px] font-mono-tech text-[#E8380D] bg-white dark:bg-[#202020] px-2.5 py-1 rounded-[4px] border border-[#D8D4CA] dark:border-[#3a3a3a]">
            <span>MEMORY OFFLINE</span>
            <button
              onClick={onRetryConnection}
              className="inline-flex items-center gap-1 font-medium hover:underline text-[var(--ink-color)] cursor-pointer ml-1"
            >
              <RotateCw size={11} />
              <span>RETRY</span>
            </button>
          </div>
        )}

        {/* Toggle Memory Panel button */}
        <button
          onClick={onToggleMemoryPanel}
          title={isMemoryPanelOpen ? 'Hide client memory' : 'Show client memory'}
          className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${
            isMemoryPanelOpen
              ? 'bg-white dark:bg-[#222] border border-[#D8D4CA] dark:border-[#3a3a3a] text-[var(--ink-color)]'
              : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#6B675F] dark:text-[#9E9B95] hover:text-[var(--ink-color)]'
          }`}
        >
          <PanelRight size={18} />
        </button>
      </div>
    </header>
  );
};
