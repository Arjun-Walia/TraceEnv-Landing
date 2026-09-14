'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  Github,
  ArrowRight,
  Command,
  Database,
  Lock,
  EyeOff,
  Globe,
  Code2,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ─── Dot grid background (Raycast-style) ──────────────────────────────────────
const DotGrid = () => (
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
      backgroundSize: '28px 28px',
      maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
    }}
  />
);

// ─── Animated terminal (compact, Supabase-style) ───────────────────────────────
const lines = [
  { cmd: 'git clone https://github.com/acme/project', out: null },
  { cmd: 'cd project && npm install', out: 'added 847 packages in 12s' },
  { cmd: 'npm run dev', out: '> ready on http://localhost:3000' },
];

function AnimatedTerminal() {
  const [step, setStep] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'output' | 'done'>('typing');
  const [shown, setShown] = useState<{ cmd: string; out: string | null }[]>([]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const current = lines[step];

    if (!current) {
      // restart after pause
      t = setTimeout(() => {
        setShown([]);
        setStep(0);
        setCharIdx(0);
        setPhase('typing');
      }, 3500);
      return () => clearTimeout(t);
    }

    if (phase === 'typing') {
      if (charIdx < current.cmd.length) {
        t = setTimeout(() => setCharIdx((c) => c + 1), 38);
      } else {
        t = setTimeout(() => setPhase('output'), 300);
      }
    } else if (phase === 'output') {
      setShown((s) => [...s, { cmd: current.cmd, out: current.out }]);
      t = setTimeout(() => {
        setStep((s) => s + 1);
        setCharIdx(0);
        setPhase('typing');
      }, 700);
    }
    return () => clearTimeout(t);
  }, [step, charIdx, phase]);

  const currentCmd = step < lines.length ? lines[step].cmd.slice(0, charIdx) : '';

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0d0d0d]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] bg-[#111] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="mx-auto font-mono text-[11px] text-[#444]">traceenv — daemon</span>
      </div>

      {/* Body */}
      <div className="min-h-[220px] p-5 font-mono text-[13px] leading-[1.8]">
        {shown.map((line, i) => (
          <div key={i}>
            <div className="flex items-start gap-2">
              <span className="select-none text-[#3ecf8e]">$</span>
              <span className="text-[#ccc]">{line.cmd}</span>
            </div>
            {line.out && (
              <div className="ml-4 text-[#555]">{line.out}</div>
            )}
          </div>
        ))}

        {step < lines.length && (
          <div className="flex items-start gap-2">
            <span className="select-none text-[#3ecf8e]">$</span>
            <span className="text-[#ccc]">
              {currentCmd}
              {phase === 'typing' && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="inline-block h-[14px] w-[2px] translate-y-[2px] bg-[#3ecf8e] align-middle"
                />
              )}
            </span>
          </div>
        )}

        {step >= lines.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 flex items-center gap-2 text-[#3ecf8e]"
          >
            <CheckCircle2 size={13} />
            <span className="text-[12px]">Trace Env captured workflow · Generating docs…</span>
          </motion.div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] bg-[#0d0d0d] px-4 py-1.5">
        <span className="font-mono text-[10px] text-[#333]">traceenv v0.9.0</span>
        <span className="font-mono text-[10px] text-[#3ecf8e]/60">● watching</span>
      </div>
    </div>
  );
}

// ─── Copy pill ─────────────────────────────────────────────────────────────────
function CopyPill({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [text]);

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111] px-4 py-2.5 font-mono text-sm text-[#888] transition-colors hover:border-[rgba(255,255,255,0.14)] hover:text-[#ccc]"
    >
      <span className="text-[#3ecf8e]">$</span>
      <span>{text}</span>
      <span className="ml-2 text-[#444] transition-colors group-hover:text-[#666]">
        <AnimatePresence mode="wait">
          {copied
            ? <motion.span key="c" initial={{ scale: 0.7 }} animate={{ scale: 1 }}><Check size={12} className="text-[#3ecf8e]" /></motion.span>
            : <motion.span key="u" initial={{ scale: 0.7 }} animate={{ scale: 1 }}><Copy size={12} /></motion.span>
          }
        </AnimatePresence>
      </span>
    </button>
  );
}

// ─── Feature row item (Appwrite/Linear style list) ─────────────────────────────
interface FeatureItemProps { icon: React.ElementType; title: string; desc: string }
function FeatureItem({ icon: Icon, title, desc }: FeatureItemProps) {
  return (
    <div className="group flex items-start gap-4 rounded-lg border border-transparent px-4 py-4 transition-colors hover:border-[rgba(255,255,255,0.06)] hover:bg-[#111]">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[rgba(62,207,142,0.15)] bg-[rgba(62,207,142,0.05)] text-[#3ecf8e]">
        <Icon size={15} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-[13px] font-semibold tracking-tight text-[#ededed]">{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#666]">{desc}</p>
      </div>
    </div>
  );
}

// ─── Arch node ─────────────────────────────────────────────────────────────────
function ArchNode({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg border transition-all duration-500',
          active
            ? 'border-[#3ecf8e]/40 bg-[#3ecf8e]/8 text-[#3ecf8e] shadow-[0_0_20px_rgba(62,207,142,0.15)]'
            : 'border-[rgba(255,255,255,0.08)] bg-[#111] text-[#444]'
        )}
      >
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <span className={cn('font-mono text-[9px] font-medium uppercase tracking-widest transition-colors', active ? 'text-[#3ecf8e]' : 'text-[#333]')}>
        {label}
      </span>
    </div>
  );
}

function ArchConnector() {
  return (
    <div className="relative hidden h-px w-12 overflow-hidden bg-[rgba(255,255,255,0.06)] md:block">
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
        className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-[#3ecf8e]/40 to-transparent"
      />
    </div>
  );
}

// ─── Section label (Appwrite-style small caps above title) ─────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#3ecf8e]">
      {children}
    </p>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function TraceEnvLanding() {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveStep((p) => (p + 1) % 5), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Docs', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]" style={{ fontFamily: 'var(--font-sans)' }}>
      <DotGrid />

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className={cn(
        'fixed top-0 z-50 w-full transition-all duration-200',
        scrolled ? 'border-b border-[rgba(255,255,255,0.06)] bg-[#0a0a0a]/90 backdrop-blur-md' : ''
      )}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#3ecf8e] text-[#020a05]">
              <Terminal size={13} strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-[#ededed]">Trace Env</span>
          </a>

          {/* Center links */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className="text-[13px] text-[#666] transition-colors hover:text-[#ccc]">
                {label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="hidden items-center gap-1.5 text-[13px] text-[#555] transition-colors hover:text-[#ccc] md:flex">
              <Github size={15} />
              <span>GitHub</span>
            </a>
            <Button size="sm" className="hidden rounded-md bg-[#3ecf8e] px-3 text-[#020a05] hover:bg-[#3ecf8e]/90 md:inline-flex text-[12.5px] font-semibold h-7">
              Get started
            </Button>
            <button onClick={() => setMobileOpen((v) => !v)} className="text-[#555] hover:text-[#ccc] md:hidden">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] px-6 pb-5 pt-4 md:hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map(({ label, href }) => (
                  <a key={label} href={href} onClick={() => setMobileOpen(false)}
                    className="text-[13px] text-[#666] transition-colors hover:text-[#ccc]">{label}</a>
                ))}
                <Separator className="bg-[rgba(255,255,255,0.06)]" />
                <Button size="sm" className="w-full rounded-md bg-[#3ecf8e] text-[#020a05] hover:bg-[#3ecf8e]/90 text-[12.5px] font-semibold">
                  Get started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-16">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative px-6 pb-24 pt-28 md:pt-36">
          <div className="mx-auto max-w-6xl">
            {/* Announcement pill */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <a href="#" className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#111] px-3 py-1 text-[11.5px] text-[#888] transition-colors hover:border-[rgba(255,255,255,0.14)] hover:text-[#ccc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e]" />
                Trace Env v0.9 is now open source
                <ArrowUpRight size={11} className="text-[#555]" />
              </a>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="max-w-3xl text-[48px] font-bold leading-[1.08] tracking-[-0.03em] text-[#ededed] md:text-[64px]"
            >
              Your terminal writes{' '}
              <br className="hidden sm:block" />
              the docs.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[#666]"
            >
              Trace Env observes your shell sessions and automatically synthesizes
              reproducible setup docs — no manual work, no documentation debt.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button className="rounded-md bg-[#3ecf8e] px-5 text-[13px] font-semibold text-[#020a05] hover:bg-[#3ecf8e]/90 h-9">
                Start for free
              </Button>
              <Button variant="outline" className="h-9 rounded-md border-[rgba(255,255,255,0.1)] bg-transparent px-5 text-[13px] text-[#888] hover:border-[rgba(255,255,255,0.16)] hover:bg-[#111] hover:text-[#ccc]">
                <Github size={14} />
                View on GitHub
              </Button>
            </motion.div>

            {/* Terminal demo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <AnimatedTerminal />
            </motion.div>
          </div>
        </section>

        {/* ── Logos strip / social proof ────────────────────────────────────── */}
        <section className="border-y border-[rgba(255,255,255,0.05)] py-8">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-widest text-[#333]">
              Built for teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-30">
              {['Acme Corp', 'Staging.sh', 'Buildkite', 'Depot', 'Fly.io', 'Railway'].map((name) => (
                <span key={name} className="font-mono text-[12px] font-medium tracking-tight text-[#ccc]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-16 md:grid-cols-2 md:items-center">
              {/* Left */}
              <div>
                <SectionLabel>The problem</SectionLabel>
                <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-[#ededed] md:text-[40px]">
                  Documentation rots.
                  <br />
                  Workflows don't.
                </h2>
                <p className="mt-5 text-[15px] leading-[1.75] text-[#666]">
                  Every engineer has a graveyard of READMEs that don&apos;t match reality.
                  Trace Env captures what actually happened in your terminal and turns it
                  into docs that work.
                </p>

                <div className="mt-10 space-y-1">
                  {[
                    { icon: Zap, title: 'Zero overhead', desc: 'Passive shell hook — nothing to remember.' },
                    { icon: ShieldCheck, title: 'Private by design', desc: 'All data stays on your machine, always.' },
                    { icon: Code2, title: 'Smart synthesis', desc: 'Typos and failed commands are filtered out automatically.' },
                    { icon: Layers, title: 'Full stack aware', desc: 'Detects env vars, deps, and service configs.' },
                  ].map((f) => (
                    <FeatureItem key={f.title} {...f} />
                  ))}
                </div>
              </div>

              {/* Right — synthesis card */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111] overflow-hidden">
                <div className="border-b border-[rgba(255,255,255,0.05)] px-5 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">Live synthesis</p>
                </div>
                <SynthesisDemo />
              </div>
            </div>
          </div>
        </section>

        {/* ── Features grid ─────────────────────────────────────────────────── */}
        <section id="features" className="border-t border-[rgba(255,255,255,0.05)] py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14">
              <SectionLabel>Features</SectionLabel>
              <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-[#ededed] md:text-[40px]">
                Everything you need.
                <br />
                Nothing you don&apos;t.
              </h2>
            </div>

            <div className="grid gap-px rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Cpu, title: 'Local AI', desc: 'Runs on llama.cpp. No data ever leaves your machine.' },
                { icon: Terminal, title: 'Shell observer', desc: 'Hooks into your shell at the process level. Zero friction.' },
                { icon: Zap, title: 'Noise filter', desc: 'Typos, failed commands, irrelevant noise — all removed.' },
                { icon: Code2, title: 'Auto docs', desc: 'Generates README.md, setup.sh, and Dockerfile automatically.' },
                { icon: Database, title: 'SQLite storage', desc: 'All captured data in a local DB. Fully auditable, exportable.' },
                { icon: ShieldCheck, title: 'Air-gapped', desc: 'Works offline. No network required after install.' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-4 bg-[#0a0a0a] p-7 transition-colors hover:bg-[#0f0f0f]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[rgba(62,207,142,0.15)] bg-[rgba(62,207,142,0.05)] text-[#3ecf8e]">
                    <f.icon size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold tracking-tight text-[#ededed]">{f.title}</p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#555]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Architecture ──────────────────────────────────────────────────── */}
        <section className="border-t border-[rgba(255,255,255,0.05)] py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 text-center">
              <SectionLabel>Architecture</SectionLabel>
              <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-[#ededed] md:text-[40px]">
                Built for the local era.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#555]">
                A lightweight background daemon — no servers, no subscriptions.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
              {[
                { icon: Terminal, label: 'Shell' },
                { icon: Command, label: 'Daemon' },
                { icon: Database, label: 'SQLite' },
                { icon: Cpu, label: 'LLM' },
                { icon: Code2, label: 'Output' },
              ].map((node, i) => (
                <React.Fragment key={i}>
                  <ArchNode icon={node.icon} label={node.label} active={activeStep === i} />
                  {i < 4 && <ArchConnector />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── Privacy ───────────────────────────────────────────────────────── */}
        <section id="privacy" className="border-t border-[rgba(255,255,255,0.05)] py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <SectionLabel>Privacy</SectionLabel>
                <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-[#ededed] md:text-[40px]">
                  Your data stays yours.
                  <br />
                  Full stop.
                </h2>
                <p className="mt-5 text-[15px] leading-[1.75] text-[#666]">
                  Trace Env is built local-first. We haven&apos;t designed a way to access
                  your data — because we don&apos;t want to.
                </p>

                <div className="mt-10 flex flex-col gap-4">
                  {[
                    { icon: Lock, title: 'No cloud APIs', desc: 'Every computation runs on your hardware.' },
                    { icon: EyeOff, title: 'No telemetry', desc: 'Zero tracking of usage, identity, or commands.' },
                    { icon: Globe, title: 'Offline-first', desc: 'Fully functional with no internet connection.' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[rgba(62,207,142,0.15)] bg-[rgba(62,207,142,0.05)] text-[#3ecf8e]">
                        <item.icon size={14} strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#ededed]">{item.title}</p>
                        <p className="text-[12.5px] text-[#555]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy visual */}
              <div className="flex flex-col gap-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111] p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">Data flow</p>
                {[
                  { from: 'Shell session', to: 'Trace Env daemon', local: true },
                  { from: 'Daemon', to: 'SQLite DB', local: true },
                  { from: 'SQLite DB', to: 'Local LLM', local: true },
                  { from: 'Local LLM', to: 'Generated docs', local: true },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px]">
                    <span className="font-mono text-[#555]">{row.from}</span>
                    <ArrowRight size={11} className="shrink-0 text-[#333]" />
                    <span className="font-mono text-[#555]">{row.to}</span>
                    <span className="ml-auto rounded-full border border-[rgba(62,207,142,0.2)] bg-[rgba(62,207,142,0.05)] px-2 py-0.5 font-mono text-[9px] text-[#3ecf8e]">local</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-[rgba(255,255,255,0.06)] p-3">
                  <Globe size={12} className="text-[#333]" />
                  <span className="text-[11.5px] text-[#444]">Internet</span>
                  <span className="ml-auto font-mono text-[10px] text-[#3a3a3a] line-through">never accessed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="border-t border-[rgba(255,255,255,0.05)] py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111] px-10 py-16 md:px-16">
              <div className="max-w-xl">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#3ecf8e]">Get started</p>
                <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.025em] text-[#ededed] md:text-[44px]">
                  Set it up in 30 seconds.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#666]">
                  Install the daemon, activate the shell hook, and Trace Env starts working immediately.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <CopyPill text="npm install -g traceenv" />
                  <Button className="h-10 rounded-md bg-[#3ecf8e] px-6 text-[13px] font-semibold text-[#020a05] hover:bg-[#3ecf8e]/90">
                    Read the docs <ArrowRight size={13} />
                  </Button>
                </div>

                <p className="mt-6 text-[12px] text-[#444]">
                  Free and open source · MIT License ·{' '}
                  <a href="https://github.com" className="text-[#555] underline underline-offset-2 hover:text-[#888]">
                    github.com/traceenv
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(255,255,255,0.05)] py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-[#3ecf8e] text-[#020a05]">
                <Terminal size={11} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-semibold text-[#ededed]">Trace Env</span>
            </div>

            {/* Footer links */}
            <div className="flex flex-wrap gap-6 text-[12.5px] text-[#444]">
              {['Changelog', 'GitHub', 'Discord', 'Twitter', 'Privacy'].map((item) => (
                <a key={item} href="#" className="transition-colors hover:text-[#888]">
                  {item}
                </a>
              ))}
            </div>

            <p className="text-[11.5px] text-[#333]">© 2026 Trace Env, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Synthesis demo (inside the "How it works" card) ───────────────────────────
function SynthesisDemo() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 3200);
    }, 6000);
    setActive(true);
    setTimeout(() => setActive(false), 3200);
    return () => clearInterval(t);
  }, []);

  const raw = ['npm install express', 'export PORT=3000', 'node index.js'];

  return (
    <div className="grid grid-cols-2 divide-x divide-[rgba(255,255,255,0.05)]">
      {/* Left — raw */}
      <div className="p-5">
        <p className="mb-4 font-mono text-[9px] uppercase tracking-widest text-[#333]">Raw input</p>
        <div className="space-y-2">
          {raw.map((cmd, i) => (
            <motion.div
              key={i}
              animate={active ? { opacity: 0.3, x: 6 } : { opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.6 }}
              className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] px-3 py-2 font-mono text-[11.5px] text-[#555]"
            >
              {cmd}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right — synthesized */}
      <div className="p-5">
        <p className="mb-4 font-mono text-[9px] uppercase tracking-widest text-[#3ecf8e]">Synthesized</p>
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded border border-[rgba(62,207,142,0.18)] bg-[rgba(62,207,142,0.04)] p-4 font-mono text-[11.5px]"
            >
              <p className="mb-2 font-bold text-[#3ecf8e]"># Setup</p>
              {[
                '✓ Dep: express',
                '✓ ENV: PORT=3000',
                '✓ Entry: index.js',
              ].map((line, i) => (
                <p key={i} className="text-[#3ecf8e]/70">{line}</p>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-28 items-center justify-center rounded border border-dashed border-[rgba(255,255,255,0.05)] text-[11px] text-[#2a2a2a]"
            >
              waiting…
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
