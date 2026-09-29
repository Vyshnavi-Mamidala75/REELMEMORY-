import { useState, useEffect, type FC } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MemoryGlobe } from './MemoryGlobe';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onStartBuilding: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LandingPage: FC<LandingPageProps> = ({ onStartBuilding, theme, onToggleTheme }) => {
  // Hero typing sequence state
  const [typedOnline, setTypedOnline] = useState('');
  const [headlineStage, setHeadlineStage] = useState(0); // 0 = not started, 1, 2, 3 = lines typed, 4 = finished
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');
  const [typedLine3, setTypedLine3] = useState('');

  // Active pipeline stage
  const [activeStage, setActiveStage] = useState(0);

  // Confidence count up
  const [confidenceCount, setConfidenceCount] = useState(0);

  // Typewriter effect for "MEMORY ENGINE ONLINE —"
  useEffect(() => {
    const fullText = 'MEMORY ENGINE ONLINE —';
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setTypedOnline(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        clearInterval(interval);
        setHeadlineStage(1);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Line 1: "THE AI AGENT"
  useEffect(() => {
    if (headlineStage !== 1) return;
    const line1 = 'THE AI AGENT';
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setTypedLine1(line1.slice(0, idx));
      if (idx >= line1.length) {
        clearInterval(interval);
        setHeadlineStage(2);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [headlineStage]);

  // Line 2: "THAT REMEMBERS"
  useEffect(() => {
    if (headlineStage !== 2) return;
    const line2 = 'THAT REMEMBERS';
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setTypedLine2(line2.slice(0, idx));
      if (idx >= line2.length) {
        clearInterval(interval);
        setHeadlineStage(3);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [headlineStage]);

  // Line 3: "WHAT WORKS."
  useEffect(() => {
    if (headlineStage !== 3) return;
    const line3 = 'WHAT WORKS';
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setTypedLine3(line3.slice(0, idx));
      if (idx >= line3.length) {
        clearInterval(interval);
        setHeadlineStage(4);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [headlineStage]);

  // Pipeline stage signal loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 6);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // 94% counter
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= 94) {
        setConfidenceCount(94);
        clearInterval(interval);
      } else {
        setConfidenceCount(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const pipelineStages = [
    { title: 'REEL', sub: '(client content)' },
    { title: 'RETAIN', sub: '(store data)' },
    { title: 'RECALL', sub: '(find patterns)' },
    { title: 'REFLECT', sub: '(get insights)' },
    { title: 'INSIGHT', sub: '(why it works)' },
    { title: 'NEXT REEL', sub: '(better plan)' },
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-color)] selection:bg-[#6C3BFF]/20 selection:text-[#6C3BFF] font-sans antialiased overflow-x-hidden">
      {/* ============================================================ */}
      {/* SECTION 1 — NAVIGATION                                       */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 h-16 border-b border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9]/85 dark:bg-[#171717]/85 backdrop-blur-md px-6 md:px-12 flex items-center justify-between transition-colors">
        {/* Left: Official MIRA LOGO + Name */}
        <div className="flex items-center gap-3">
          <img
            src="/mira-logo.png"
            alt="MIRA LOGO"
            className="w-7 h-7 object-contain dark:invert transition-all"
          />
          <div className="flex items-center gap-1.5 font-display font-bold text-lg tracking-tight">
            <span>MIRA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple inline-block" />
          </div>
        </div>

        {/* Center: Monospace Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
          <a
            href="#product"
            className="hover:text-[var(--ink-color)] relative py-1 transition-colors group"
          >
            PRODUCT
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6C3BFF] transition-all duration-200 group-hover:w-full" />
          </a>
          <a
            href="#memory"
            className="hover:text-[var(--ink-color)] relative py-1 transition-colors group"
          >
            MEMORY
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6C3BFF] transition-all duration-200 group-hover:w-full" />
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[var(--ink-color)] relative py-1 transition-colors group"
          >
            HOW IT WORKS
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6C3BFF] transition-all duration-200 group-hover:w-full" />
          </a>
          <a
            href="#agencies"
            className="hover:text-[var(--ink-color)] relative py-1 transition-colors group"
          >
            AGENCIES
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6C3BFF] transition-all duration-200 group-hover:w-full" />
          </a>
        </nav>

        {/* Right: Status pill, Theme toggle, and CTA Button */}
        <div className="flex items-center gap-3">
          {/* Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-[3px] border border-[#6C3BFF]/40 bg-[#6C3BFF]/5 text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
            <span>MEMORY ACTIVE</span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />

          {/* START BUILDING → Button */}
          <button
            onClick={onStartBuilding}
            className="group flex items-center gap-2 px-4 py-2 rounded-[2px] bg-[#6C3BFF] text-white text-[12px] font-mono-tech font-semibold tracking-wide hover:bg-[#582cd6] transition-all cursor-pointer shadow-sm"
          >
            <span>START BUILDING</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* SECTION 2 — HERO + MEMORY GLOBE                              */}
      {/* ============================================================ */}
      <section className="relative px-6 md:px-12 pt-12 md:pt-20 pb-16 md:pb-24 border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Subtext */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Monospace Online Status */}
            <div className="h-6 mb-4 flex items-center">
              <span className="text-[12px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] tracking-wider font-semibold">
                {typedOnline}
                {typedOnline.length < 23 && (
                  <span className="inline-block w-2 h-3.5 bg-[#6C3BFF] ml-1 animate-pulse" />
                )}
              </span>
            </div>

            {/* Oversized Typed Display Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-display font-extrabold uppercase tracking-tight leading-[0.96] text-[var(--ink-color)]">
              <div>{typedLine1}</div>
              <div>{typedLine2}</div>
              <div className="flex items-baseline">
                <span>{typedLine3}</span>
                {headlineStage >= 4 && (
                  <span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6C3BFF] ml-1.5 mb-1 pulse-purple" />
                )}
              </div>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: headlineStage >= 3 ? 1 : 0, y: headlineStage >= 3 ? 0 : 15 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-base sm:text-lg text-[#6B675F] dark:text-[#9E9B95] max-w-xl leading-relaxed"
            >
              Mira learns from every reel your agency creates, turning client history into better
              decisions for the next one.
            </motion.p>

            {/* Hero Buttons & Signals */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: headlineStage >= 4 ? 1 : 0, y: headlineStage >= 4 ? 0 : 15 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={onStartBuilding}
                className="group flex items-center gap-2 px-6 py-3.5 rounded-[2px] bg-[#6C3BFF] text-white text-[13px] font-mono-tech font-semibold tracking-wider hover:bg-[#582cd6] transition-all cursor-pointer shadow-md"
              >
                <span>START BUILDING</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#how-it-works"
                className="group flex items-center gap-2 px-6 py-3.5 rounded-[2px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-transparent text-[var(--ink-color)] text-[13px] font-mono-tech font-medium tracking-wider hover:border-[#6C3BFF] hover:text-[#6C3BFF] transition-all"
              >
                <span>SEE HOW MEMORY WORKS</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-[#6B675F]" />
              </a>
            </motion.div>

            {/* Left Technical Badges from Mockup */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 pt-6 border-t border-[#D8D4CA]/60 dark:border-[#3a3a3a]/60 flex flex-wrap items-center gap-3 text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]"
            >
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-black/5 dark:bg-white/5">
                <span className="text-[#6C3BFF]">+</span> HOOK
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-black/5 dark:bg-white/5">
                <span className="text-[#6C3BFF]">+</span> TOPIC
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-black/5 dark:bg-white/5">
                <span className="text-[#6C3BFF]">+</span> CAPTION
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-black/5 dark:bg-white/5">
                <span className="text-[#6C3BFF]">+</span> POST TIME
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#6C3BFF]/10 text-[#6C3BFF] dark:text-[#B9A7FF] font-semibold">
                4/6 ABOVE MEDIAN
              </span>
            </motion.div>
          </div>

          {/* Right Column: Hero Memory Globe */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <MemoryGlobe size={520} theme={theme} />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — LIVE METRIC TICKER                               */}
      {/* ============================================================ */}
      <section className="h-12 border-b border-[#D8D4CA] dark:border-[#3a3a3a] overflow-hidden flex items-center bg-[#F3F1E9] dark:bg-[#171717] select-none">
        <div className="animate-marquee whitespace-nowrap text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] tracking-wider flex items-center">
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
            <span>28 REELS INDEXED</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>14 HOOK PATTERNS</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>6 CONTENT TYPES</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>21 HIGH-PERFORMING REELS</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
            <span>94% PEAK HOOK CONFIDENCE</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>CLIENT MEMORY ACTIVE</span>
          </span>

          {/* Duplicate set for seamless continuous marquee */}
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
            <span>28 REELS INDEXED</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>14 HOOK PATTERNS</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>6 CONTENT TYPES</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>21 HIGH-PERFORMING REELS</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
            <span>94% PEAK HOOK CONFIDENCE</span>
          </span>
          <span className="inline-flex items-center gap-3 mx-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
            <span>CLIENT MEMORY ACTIVE</span>
          </span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — MEMORY → REFLECTION → ACTION (3 COLUMNS)         */}
      {/* ============================================================ */}
      <section id="memory" className="border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8D4CA] dark:divide-[#3a3a3a]">
          {/* Column 01: MEMORY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--ink-color)]">
                01 MEMORY
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
                Mira stores every client's content history.
              </p>
            </div>
            <div className="mt-8 text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF]">
              PERSISTENT CLIENT BANK
            </div>
          </motion.div>

          {/* Column 02: REFLECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--ink-color)]">
                02 REFLECTION
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
                Mira consolidates that history into meaningful patterns.
              </p>
            </div>
            <div className="mt-8 text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF]">
              PATTERN SCORING ENGINE
            </div>
          </motion.div>

          {/* Column 03: ACTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
                <span className="w-2 h-2 rounded-full bg-[#6C3BFF]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--ink-color)]">
                03 ACTION
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
                Those patterns influence the next reel plan.
              </p>
            </div>
            <div className="mt-8 text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF]">
              AUTONOMOUS GENERATION
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — LARGE STATEMENT SECTION                          */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-[#D8D4CA] dark:border-[#3a3a3a] relative overflow-hidden">
        {/* Subtle moving purple data grid lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#6C3BFF_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold uppercase tracking-tight leading-[1.05] text-[var(--ink-color)]">
              YOUR NEXT REEL SHOULDN’T START FROM ZERO
              <span className="inline-block w-3 h-3 rounded-full bg-[#6C3BFF] ml-2 pulse-purple" />
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-base sm:text-lg text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
              Every client interaction becomes memory. Every memory can influence the next decision.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — MIRA MEMORY PIPELINE                             */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] tracking-wider block mb-1">
                SYSTEM ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--ink-color)]">
                THE MIRA MEMORY PIPELINE
              </h2>
            </div>
            <div className="text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
              CONTENT → MEMORY → INSIGHT → NEXT REEL
            </div>
          </div>

          {/* Pipeline Stages: Horizontal Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
            {pipelineStages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={stage.title}
                  className={`p-5 rounded-[2px] border transition-all duration-300 relative flex flex-col justify-between h-36 ${
                    isActive
                      ? 'border-[#6C3BFF] bg-[#6C3BFF]/5 shadow-[0_0_20px_rgba(108,59,255,0.15)]'
                      : 'border-[#D8D4CA] dark:border-[#3a3a3a] bg-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isActive ? 'bg-[#6C3BFF] pulse-purple' : 'bg-[#D8D4CA] dark:bg-[#3a3a3a]'
                      }`}
                    />
                    <span className="text-[10px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <div
                      className={`font-display font-bold text-base tracking-tight transition-colors ${
                        isActive ? 'text-[#6C3BFF] dark:text-[#B9A7FF]' : 'text-[var(--ink-color)]'
                      }`}
                    >
                      {stage.title}
                    </div>
                    <div className="text-[11px] text-[#6B675F] dark:text-[#9E9B95] mt-0.5">
                      {stage.sub}
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  {idx < 5 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[10px] text-[#6C3BFF]">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 — MEMORY CHANGES THE ANSWER (COMPARISON)           */}
      {/* ============================================================ */}
      <section className="py-20 px-6 md:px-12 border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] tracking-wider block mb-1">
              THE DIFFERENCE IS MEMORY —
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-[var(--ink-color)]">
              MEMORY CHANGES THE ANSWER
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6C3BFF] ml-2 pulse-purple" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: WITHOUT MEMORY */}
            <div className="p-8 rounded-[2px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-transparent flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#6B675F]" />
                  <span className="text-[11px] font-mono-tech text-[#6B675F] tracking-wider">
                    WITHOUT MEMORY
                  </span>
                </div>

                <div className="mb-6">
                  <div className="text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-1">
                    HOOK:
                  </div>
                  <div className="text-xl sm:text-2xl font-serif italic text-[var(--ink-color)]">
                    “Luxury living starts here.”
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-1">
                    REASON:
                  </div>
                  <p className="text-sm text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
                    Generic engagement potential.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#D8D4CA] dark:border-[#3a3a3a] flex items-center justify-between text-[11px] font-mono-tech text-[#6B675F]">
                <span className="px-2 py-0.5 rounded-[2px] bg-black/5 dark:bg-white/5">GENERIC</span>
                <span>NO PREVIOUS DATA</span>
              </div>
            </div>

            {/* Card 2: WITH MIRA MEMORY (Activated Purple Border) */}
            <div className="p-8 rounded-[2px] border-2 border-[#6C3BFF] bg-[#6C3BFF]/5 flex flex-col justify-between relative shadow-[0_0_30px_rgba(108,59,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6C3BFF] pulse-purple" />
                    <span className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] font-semibold tracking-wider">
                      WITH MIRA MEMORY
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#6C3BFF] text-white text-[10px] font-mono-tech font-bold">
                      {confidenceCount}% CONFIDENCE
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] mb-1 font-semibold">
                    HOOK:
                  </div>
                  <div className="text-xl sm:text-2xl font-serif italic text-[var(--ink-color)]">
                    “Would you pay ₹2.4 Cr for this view?”
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] mb-1 font-semibold">
                    REASON:
                  </div>
                  <p className="text-sm text-[var(--ink-color)] font-medium leading-relaxed">
                    Question hooks have exceeded this client's median views in 4 of the last 6 reels.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#6C3BFF]/30 flex items-center justify-between text-[11px] font-mono-tech">
                <span className="flex items-center gap-1.5 text-[#6C3BFF] dark:text-[#B9A7FF] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
                  MEMORY ACTIVE
                </span>
                <span className="text-[#6B675F] dark:text-[#9E9B95]">SAVED IN HINDSIGHT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 — LIVE MIRA DASHBOARD PREVIEW                      */}
      {/* ============================================================ */}
      <section id="product" className="py-20 px-6 md:px-12 border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] tracking-wider block mb-1">
                SYSTEM CONSOLE
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--ink-color)]">
                LIVE MIRA DASHBOARD PREVIEW
              </h2>
            </div>
            <button
              onClick={onStartBuilding}
              className="group inline-flex items-center gap-2 text-[12px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] font-semibold hover:underline cursor-pointer"
            >
              <span>LAUNCH INTERACTIVE STUDIO</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Horizontally scrollable container on mobile */}
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[860px] rounded-[2px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-white dark:bg-[#1a1a1a] shadow-lg overflow-hidden">
              {/* Dashboard Header Bar */}
              <div className="h-10 px-4 border-b border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9]/50 dark:bg-[#222]/50 flex items-center justify-between text-[11px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C3BFF]" />
                  <span className="font-semibold text-[var(--ink-color)]">MIRA CONSOLE</span>
                  <span>•</span>
                  <span>HYDERABAD HOMES</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6C3BFF] dark:text-[#B9A7FF]">● ONLINE</span>
                  <span>BANK: creator-creator_a</span>
                </div>
              </div>

              {/* 3 Columns */}
              <div className="grid grid-cols-12 min-h-[420px]">
                {/* Left: Client Bank & History */}
                <div className="col-span-3 border-r border-[#D8D4CA] dark:border-[#3a3a3a] p-4 text-[12px]">
                  <div className="text-[10px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-2 font-semibold">
                    CLIENT BANK
                  </div>
                  <div className="space-y-1">
                    <div className="px-2.5 py-1.5 rounded-[2px] bg-[#6C3BFF]/10 text-[#6C3BFF] dark:text-[#B9A7FF] font-medium flex items-center justify-between">
                      <span>Hyderabad Homes</span>
                      <span className="text-[10px] font-mono-tech">18r</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-[2px] text-[#6B675F] dark:text-[#9E9B95] hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between">
                      <span>Skyline Realty</span>
                      <span className="text-[10px] font-mono-tech">18r</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-[2px] text-[#6B675F] dark:text-[#9E9B95] hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between">
                      <span>Urban Nest</span>
                      <span className="text-[10px] font-mono-tech">18r</span>
                    </div>
                  </div>

                  <div className="mt-8 text-[10px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] mb-2 font-semibold">
                    CHAT HISTORY
                  </div>
                  <div className="space-y-1 text-[#6B675F] dark:text-[#9E9B95] text-[11px]">
                    <div className="px-2 py-1 truncate">Plan next reel - Kokapet</div>
                    <div className="px-2 py-1 truncate">Compare memory</div>
                    <div className="px-2 py-1 truncate">Analytics (7 days)</div>
                  </div>
                </div>

                {/* Center: Conversation */}
                <div className="col-span-6 p-6 flex flex-col justify-between bg-[#FAF8F3]/50 dark:bg-[#181818]/50">
                  <div className="space-y-4">
                    {/* User Prompt */}
                    <div className="flex justify-end">
                      <div className="max-w-md px-4 py-2.5 rounded-[2px] bg-[#171717] dark:bg-[#F3F1E9] text-white dark:text-[#171717] text-[13px]">
                        Plan the next reel for the Kokapet Sky Villa launch.
                      </div>
                    </div>

                    {/* Mira Response */}
                    <div className="flex justify-start">
                      <div className="max-w-md px-4 py-3 rounded-[2px] border border-[#6C3BFF]/40 bg-white dark:bg-[#202020] text-[13px] leading-relaxed shadow-xs">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] mb-2 font-semibold">
                          <Sparkles size={11} />
                          <span>MIRA RECALLED 4 MEMORIES</span>
                        </div>
                        <p className="text-[var(--ink-color)]">
                          I checked this client's memory bank. Question hooks have the strongest
                          historical performance: 4 of the last 6 question-hook reels exceeded the
                          client's median views with a 5.6% save rate.
                        </p>
                        <p className="mt-2 text-[#6C3BFF] dark:text-[#B9A7FF] font-medium">
                          Recommended Hook: “Would you pay ₹2.4 Cr for this view in Kokapet?”
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input Box Mockup */}
                  <div className="mt-6 flex items-center gap-2 border border-[#D8D4CA] dark:border-[#3a3a3a] px-3 py-2 rounded-[2px] bg-white dark:bg-[#1a1a1a]">
                    <span className="text-[12px] text-[#6B675F] dark:text-[#9E9B95] flex-1">
                      Ask a question or log a reel result...
                    </span>
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#6C3BFF] text-white text-[10px] font-mono-tech">
                      MEMORY ON
                    </span>
                  </div>
                </div>

                {/* Right: "WHAT MIRA KNOWS" */}
                <div className="col-span-3 border-l border-[#D8D4CA] dark:border-[#3a3a3a] p-4 text-[12px]">
                  <div className="text-[10px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] mb-2 font-semibold">
                    WHAT MIRA KNOWS
                  </div>

                  <div className="p-3 rounded-[2px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-black/5 dark:bg-white/5 mb-4">
                    <div className="text-[10px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95]">
                      CLIENT WINNING RATIO
                    </div>
                    <div className="text-2xl font-display font-extrabold text-[var(--ink-color)] mt-1">
                      21 OF 28
                    </div>
                    <div className="text-[10px] text-[#6B675F] dark:text-[#9E9B95]">
                      REELS BEAT AGENCY MEDIAN
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[10px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] font-semibold">
                      HOOK CONFIDENCE
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>QUESTION</span>
                        <span className="font-mono-tech font-bold text-[#6C3BFF]">94%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#6C3BFF] rounded-full w-[94%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>WALKTHROUGH</span>
                        <span className="font-mono-tech font-bold text-[#6B675F]">78%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#6B675F] rounded-full w-[78%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>PRICE REVEAL</span>
                        <span className="font-mono-tech font-bold text-[#6B675F]">62%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#6B675F] rounded-full w-[62%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 — AGENCY KNOWLEDGE                                 */}
      {/* ============================================================ */}
      <section id="agencies" className="py-20 px-6 md:px-12 border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] tracking-wider block mb-1">
              AGENCY CONTINUITY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-[var(--ink-color)] leading-tight">
              WHEN YOUR BEST EDITOR LEAVES, THE KNOWLEDGE SHOULDN’T.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
              Agency knowledge shouldn’t live inside someone's head, spreadsheets, Slack messages, or
              personal workflows. Mira turns client-specific content knowledge into persistent memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[2px]">
              <div className="text-sm font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] font-bold mb-2">
                01 LOG REEL
              </div>
              <h3 className="text-lg font-display font-bold uppercase text-[var(--ink-color)] mb-2">
                Capture Actual Performance
              </h3>
              <p className="text-sm text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
                Log views, saves, and shares with hook and length in seconds. Memory extracts the signal
                automatically.
              </p>
            </div>

            <div className="p-8 border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[2px]">
              <div className="text-sm font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] font-bold mb-2">
                02 PLAN NEXT REEL
              </div>
              <h3 className="text-lg font-display font-bold uppercase text-[var(--ink-color)] mb-2">
                Use Client Memory
              </h3>
              <p className="text-sm text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
                Generate high-confidence briefs rooted in historical winning patterns, not intuition.
              </p>
            </div>

            <div className="p-8 border border-[#D8D4CA] dark:border-[#3a3a3a] rounded-[2px]">
              <div className="text-sm font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] font-bold mb-2">
                03 COMPARE MEMORY
              </div>
              <h3 className="text-lg font-display font-bold uppercase text-[var(--ink-color)] mb-2">
                See How Answers Change
              </h3>
              <p className="text-sm text-[#6B675F] dark:text-[#9E9B95] leading-relaxed">
                Run side-by-side evaluations to see how memory refines the hook, duration, and rationale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10 — TECHNOLOGY STACK                                */}
      {/* ============================================================ */}
      <section className="py-16 px-6 md:px-12 border-b border-[#D8D4CA] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-[11px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] tracking-wider block mb-1">
              INFRASTRUCTURE
            </span>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-[var(--ink-color)]">
              BUILT AROUND MEMORY.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[12px] font-mono-tech">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
              <div>
                <div className="font-bold text-[var(--ink-color)]">GROQ</div>
                <div className="text-[10px] text-[#6B675F] dark:text-[#9E9B95]">FAST INFERENCE</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
              <div>
                <div className="font-bold text-[var(--ink-color)]">HINDSIGHT</div>
                <div className="text-[10px] text-[#6B675F] dark:text-[#9E9B95]">PERSISTENT MEMORY</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
              <div>
                <div className="font-bold text-[var(--ink-color)]">SUPABASE</div>
                <div className="text-[10px] text-[#6B675F] dark:text-[#9E9B95]">PATTERN DATA</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
              <div>
                <div className="font-bold text-[var(--ink-color)]">MIRA</div>
                <div className="text-[10px] text-[#6B675F] dark:text-[#9E9B95]">AGENT ENGINE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 11 — FINAL CTA                                       */}
      {/* ============================================================ */}
      <section className="pt-20 pb-0 md:pt-28 md:pb-0 px-6 md:px-12 bg-[#321A73] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 pb-16 md:pb-24">
            <span className="text-[11px] font-mono-tech text-[#B9A7FF] tracking-wider block mb-2 font-semibold">
              JOIN THE MEMORY REVOLUTION
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold uppercase tracking-tight leading-[1.05]">
              STOP RESTARTING EVERY TIME.
            </h2>
            <p className="mt-4 text-lg text-[#B9A7FF] max-w-lg leading-relaxed">
              Give every client a memory. Give every reel a reason.
            </p>

            <div className="mt-8">
              <button
                onClick={onStartBuilding}
                className="group flex items-center gap-2 px-8 py-4 rounded-[2px] bg-white text-[#321A73] text-[13px] font-mono-tech font-bold tracking-wider hover:bg-[#F3F1E9] transition-all cursor-pointer shadow-xl"
              >
                <span>START BUILDING MIRA</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-end justify-center lg:justify-end translate-y-6 md:translate-y-12">
            <MemoryGlobe size={420} small theme="dark" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 12 — FOOTER                                          */}
      {/* ============================================================ */}
      <footer className="border-t border-[#D8D4CA] dark:border-[#3a3a3a] px-6 md:px-12 py-12 bg-[#F3F1E9] dark:bg-[#171717] text-[#6B675F] dark:text-[#9E9B95]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#D8D4CA]/60 dark:border-[#3a3a3a]/60">
          <div className="flex items-center gap-3">
            <img
              src="/mira-logo.png"
              alt="MIRA LOGO"
              className="w-6 h-6 object-contain dark:invert"
            />
            <span className="font-display font-bold text-base text-[var(--ink-color)]">MIRA</span>
            <span>•</span>
            <span className="text-[12px] font-mono-tech">CLIENT MEMORY FOR CONTENT AGENCIES</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono-tech">
            <a href="#product" className="hover:text-[var(--ink-color)]">PRODUCT</a>
            <a href="#memory" className="hover:text-[var(--ink-color)]">MEMORY</a>
            <a href="#how-it-works" className="hover:text-[var(--ink-color)]">HOW IT WORKS</a>
            <button onClick={onStartBuilding} className="hover:text-[#6C3BFF] cursor-pointer">
              START BUILDING
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono-tech">
          <div>
            MEMORY ACTIVE • REFLECTION READY • CONTENT INDEXED • MIRA ONLINE
          </div>
          <div>
            © 2026 MIRA AI. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* Floating Theme Switch for instant light / dark mode toggling anywhere */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#1f1f1f]/95 border border-[#D8D4CA] dark:border-[#3a3a3a] shadow-xl backdrop-blur-md select-none transition-colors">
        <span className="text-[10px] font-mono-tech font-semibold text-[#6B675F] dark:text-[#9E9B95]">
          {theme === 'dark' ? 'DARK' : 'LIGHT'}
        </span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
      </div>
    </div>
  );
};
