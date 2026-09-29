import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Conversation } from './components/Conversation';
import { Composer } from './components/Composer';
import { MemoryPanel } from './components/MemoryPanel';
import { CompareModal } from './components/CompareModal';
import { LandingPage } from './components/LandingPage';
import {
  api,
  type Creator,
  type ChatMessage,
  type PatternScore,
  type Reel,
} from './lib/api';

const INITIAL_CREATORS: Creator[] = [
  { id: 'creator_a', name: 'Hyderabad Homes', niche: '2BHK/3BHK launches' },
  { id: 'creator_b', name: 'Luxury Villas HYD', niche: 'villas & gated communities' },
  { id: 'creator_c', name: 'Budget Flats HYD', niche: 'under-50L flats' },
  { id: 'client_new', name: 'New Client (live demo)', niche: 'real estate' },
];

const INITIAL_REEL_COUNTS: Record<string, number> = {
  creator_a: 18,
  creator_b: 18,
  creator_c: 18,
  client_new: 0,
};

const INITIAL_SCORES: PatternScore[] = [
  { creator_id: 'creator_a', hook_type: 'question', score: 0.94, sample_size: 6 },
  { creator_id: 'creator_a', hook_type: 'walkthrough', score: 0.78, sample_size: 6 },
  { creator_id: 'creator_a', hook_type: 'price_reveal', score: 0.62, sample_size: 6 },
];

const INITIAL_LEARNED =
  'Audience engagement is highly sensitive to hook structure. Question-based hooks consistently drive higher save rates (median 5.6%), while price reveals underperform on initial reach.';

export function App() {
  // Theme state: light | dark (persisted in localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mira-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Current view: 'landing' | 'app'
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  // Active navigation tab in sidebar
  const [activeNavTab, setActiveNavTab] = useState<'clients' | 'memory' | 'reels' | 'settings'>('clients');

  const [creators, setCreators] = useState<Creator[]>(INITIAL_CREATORS);
  const [activeCreatorId, setActiveCreatorId] = useState<string>('creator_a');
  const [reelCounts, setReelCounts] = useState<Record<string, number>>(INITIAL_REEL_COUNTS);
  const [memoryStatus, setMemoryStatus] = useState<'connected' | 'offline' | 'checking'>('connected');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMemoryPanelOpen, setIsMemoryPanelOpen] = useState(true);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [memoryOn, setMemoryOn] = useState(true);

  // Per-creator chat histories
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Memory panel state
  const [panelLearned, setPanelLearned] = useState<string>(INITIAL_LEARNED);
  const [panelScores, setPanelScores] = useState<PatternScore[]>(INITIAL_SCORES);
  const [panelReels, setPanelReels] = useState<Reel[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);

  // Synchronize dark class on document root and body
  useEffect(() => {
    localStorage.setItem('mira-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Health and creators load
  const checkHealth = async () => {
    try {
      setMemoryStatus('checking');
      const h = await api.getHealth();
      if (h.status === 'ok' && h.memory === 'connected') {
        setMemoryStatus('connected');
      } else {
        setMemoryStatus('offline');
      }
    } catch {
      setMemoryStatus('offline');
    }
  };

  const loadCreators = async () => {
    try {
      const data = await api.getCreators();
      if (data && data.length > 0) {
        setCreators(data);
        setActiveCreatorId((prev) => (prev && data.some((c) => c.id === prev) ? prev : data[0].id));

        Promise.all(
          data.map(async (c) => {
            try {
              const st = await api.getCreatorStatus(c.id);
              return [c.id, st.supabase_reels ?? 0] as const;
            } catch {
              return [c.id, 0] as const;
            }
          })
        ).then((entries) => {
          setReelCounts(Object.fromEntries(entries));
        });
      }
    } catch (e) {
      console.error('Failed to load creators', e);
    }
  };

  const loadMemoryPanel = async (cid: string) => {
    setPanelLoading(true);
    try {
      const data = await api.getMemoryPanel(cid);
      setPanelLearned(data.learned || 'No observations recorded yet. Log reels to begin learning.');
      setPanelScores(data.scores || []);
      setPanelReels(data.recent_reels || []);
    } catch {
      setPanelLearned('Memory is offline or unavailable. Check connection.');
      setPanelScores([]);
      setPanelReels([]);
    } finally {
      setPanelLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    loadCreators();
  }, []);

  useEffect(() => {
    if (activeCreatorId) {
      loadMemoryPanel(activeCreatorId);
    }
  }, [activeCreatorId]);

  const activeCreator = creators.find((c) => c.id === activeCreatorId) || {
    id: activeCreatorId,
    name: 'Hyderabad Homes',
    niche: '2BHK/3BHK launches',
  };

  const activeMessages = chats[activeCreatorId] || [];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    const currentHistory = [...activeMessages, userMsg];

    setChats((prev) => ({
      ...prev,
      [activeCreatorId]: currentHistory,
    }));
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.chat({
        creator_id: activeCreatorId,
        message: userMsg.content,
        history: currentHistory.map((m) => ({ role: m.role, content: m.content })),
        memory_on: memoryOn,
      });

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.reply,
        tools_used: res.tools_used,
        sources: res.sources,
      };

      setChats((prev) => ({
        ...prev,
        [activeCreatorId]: [...(prev[activeCreatorId] || []), assistantMsg],
      }));

      loadMemoryPanel(activeCreatorId);
      api.getCreatorStatus(activeCreatorId).then((st) => {
        setReelCounts((prev) => ({ ...prev, [activeCreatorId]: st.supabase_reels ?? 0 }));
      });
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `Error: ${e.message || 'Unable to connect to assistant.'}`,
      };
      setChats((prev) => ({
        ...prev,
        [activeCreatorId]: [...(prev[activeCreatorId] || []), errorMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleNewChat = () => {
    setChats((prev) => ({
      ...prev,
      [activeCreatorId]: [],
    }));
  };

  // If on landing page view, render LandingPage
  if (currentView === 'landing') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <LandingPage
          onStartBuilding={() => setCurrentView('app')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    );
  }

  // Dashboard / Studio App View
  return (
    <div className={`flex h-screen w-screen overflow-x-auto overflow-y-hidden bg-[#F3F1E9] dark:bg-[#171717] text-[var(--ink-color)] selection:bg-[#6C3BFF]/20 selection:text-[#6C3BFF] transition-colors duration-150 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-full min-w-full md:min-w-0 flex-1">
        {/* 1. Left Claude-style Sidebar */}
        <Sidebar
          creators={creators}
          activeCreatorId={activeCreatorId}
          onSelectCreator={(id) => {
            setActiveCreatorId(id);
            setActiveNavTab('clients');
          }}
          onNewChat={handleNewChat}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          reelCounts={reelCounts}
          theme={theme}
          onToggleTheme={toggleTheme}
          onGoToLanding={() => setCurrentView('landing')}
          activeNavTab={activeNavTab}
          onSelectNavTab={(tab) => {
            setActiveNavTab(tab);
            if (tab === 'memory') setIsMemoryPanelOpen(true);
            if (tab === 'reels') setIsMemoryPanelOpen(true);
          }}
        />

        {/* 2. Center Workspace (Horizontally scrollable and responsive) */}
        <div className="flex-1 flex flex-col h-screen min-w-[340px] md:min-w-0 overflow-hidden">
          <Header
            activeCreator={activeCreator}
            memoryStatus={memoryStatus}
            onRetryConnection={checkHealth}
            onToggleMemoryPanel={() => setIsMemoryPanelOpen(!isMemoryPanelOpen)}
            isMemoryPanelOpen={isMemoryPanelOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onGoToLanding={() => setCurrentView('landing')}
          />

          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Conversation
              messages={activeMessages}
              isLoading={isLoading}
              onSelectPrompt={handleSelectPrompt}
              creatorName={activeCreator.name}
              hasReels={(reelCounts[activeCreatorId] ?? 0) > 0}
            />

            <Composer
              input={input}
              setInput={setInput}
              onSend={handleSend}
              isLoading={isLoading}
              memoryOn={memoryOn}
              setMemoryOn={setMemoryOn}
            />
          </main>
        </div>

        {/* 3. Right Memory Panel */}
        <MemoryPanel
          isOpen={isMemoryPanelOpen}
          onClose={() => setIsMemoryPanelOpen(false)}
          creatorName={activeCreator.name}
          learnedText={panelLearned}
          scores={panelScores}
          recentReels={panelReels}
          isLoading={panelLoading}
          onOpenCompare={() => setIsCompareOpen(true)}
        />
      </div>

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        creatorName={activeCreator.name}
        onRunCompare={(brief) => api.compare(activeCreatorId, brief, memoryOn)}
      />
    </div>
  );
}

export default App;
