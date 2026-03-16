'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Glow = ({ className }: { className?: string }) => (
  <motion.div 
    animate={{ 
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.5, 0.3] 
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className={cn("absolute -z-10 h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]", className)} 
  />
);

const FloatingParticle = ({ delay = 0, xOffset = 0, duration = 5 }: { delay?: number, xOffset?: number, duration?: number }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ 
      y: [-20, -120], 
      opacity: [0, 1, 0],
      x: [0, xOffset]
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      delay,
      ease: "linear" 
    }}
    className="absolute h-1 w-1 rounded-full bg-emerald-500/40"
  />
);

const AnimatedTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [status, setStatus] = useState<'typing' | 'processing' | 'done'>('typing');

  useEffect(() => {
    const fullText = [
      "$ git clone https://github.com/acme/project",
      "$ cd project",
      "$ npm install",
      "$ docker-compose up -d",
      "$ npm run dev",
    ];
    
    let currentLine = 0;
    let currentChar = 0;
    let isMounted = true;
    
    const type = () => {
      if (!isMounted) return;
      if (currentLine < fullText.length) {
        const line = fullText[currentLine];
        if (currentChar < line.length) {
          setLines(prev => {
            const next = [...prev];
            next[currentLine] = line.substring(0, currentChar + 1);
            return next;
          });
          currentChar++;
          // Use a fixed random seed or just a consistent speed
          setTimeout(type, 50);
        } else {
          currentLine++;
          currentChar = 0;
          setTimeout(type, 400);
        }
      } else {
        setStatus('processing');
        setTimeout(() => {
          if (!isMounted) return;
          setLines(prev => [...prev, "", "✨ [Trace Env] Workflow captured.", "✨ [Trace Env] Generated setup.sh and README.md"]);
          setStatus('done');
          setTimeout(() => {
            if (!isMounted) return;
            setLines([]);
            setStatus('typing');
            currentLine = 0;
            currentChar = 0;
            type();
          }, 4000);
        }, 1500);
      }
    };

    type();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="group relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0D0D0D] shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] transition-all hover:border-emerald-500/30">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">bash — traceenv daemon</div>
        <div className="flex gap-2">
          {status === 'processing' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-3 w-3 rounded-full border-2 border-emerald-500 border-t-transparent"
            />
          )}
          <div className="w-4" />
        </div>
      </div>
      <div className="p-6 font-mono text-sm leading-relaxed text-emerald-400/90 min-h-[280px]">
        <AnimatePresence mode="popLayout">
          {lines.map((line, i) => (
            <motion.div 
              key={`${i}-${line}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("flex gap-3", line?.startsWith("✨") && "text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]")}
            >
              <span className="select-none text-zinc-700">{line?.startsWith("$") ? "" : ""}</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {status === 'typing' && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block h-4 w-2 bg-emerald-500 align-middle"
          />
        )}
      </div>
      
      {/* Visualizing the "Trace" */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
        {status === 'processing' && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"
          />
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, className }: { icon: any, title: string, description: string, className?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={cn("group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-emerald-500/20", className)}
  >
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 transition-all group-hover:bg-emerald-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
      <Icon size={24} />
    </div>
    <h3 className="mb-2 font-sans text-xl font-bold text-white">{title}</h3>
    <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
    
    {/* Decorative corner */}
    <div className="absolute top-0 right-0 p-2 opacity-0 transition-opacity group-hover:opacity-100">
      <ArrowRight size={14} className="text-emerald-500" />
    </div>
  </motion.div>
);

const SectionHeader = ({ badge, title, subtitle }: { badge: string, title: string, subtitle: string }) => (
  <div className="mb-16 flex flex-col items-center text-center">
    <motion.span 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="mb-4 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500"
    >
      {badge}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="font-sans text-4xl font-bold tracking-tight text-white md:text-6xl"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-6 max-w-2xl text-lg text-zinc-500"
    >
      {subtitle}
    </motion.p>
  </div>
);

const ArchitectureStep = ({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) => (
  <div className="flex flex-col items-center gap-4">
    <motion.div 
      animate={active ? { 
        scale: [1, 1.05, 1],
        borderColor: ["rgba(16,185,129,0.1)", "rgba(16,185,129,0.5)", "rgba(16,185,129,0.1)"]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500",
        active ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "border-white/10 bg-white/5 text-zinc-500"
      )}
    >
      <Icon size={24} />
      {active && (
        <motion.div 
          layoutId="active-glow"
          className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl"
        />
      )}
    </motion.div>
    <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors", active ? "text-emerald-500" : "text-zinc-600")}>
      {label}
    </span>
  </div>
);

const SynthesisVisualization = () => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSynthesizing(true);
      setTimeout(() => setIsSynthesizing(false), 3000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center p-8 min-h-[400px]">
      <div className="grid grid-cols-2 gap-8 w-full">
        {/* Left: Raw Commands */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-4">Raw Input</div>
          {[
            "npm install lodash",
            "export PORT=3000",
            "node server.js",
            "ls -la",
            "cat .env"
          ].map((cmd, i) => (
            <motion.div 
              key={i}
              animate={isSynthesizing ? { 
                x: [0, 100], 
                opacity: [1, 0],
                filter: ["blur(0px)", "blur(4px)"]
              } : {}}
              transition={{ delay: i * 0.1, duration: 1 }}
              className="rounded border border-white/5 bg-white/5 p-3 font-mono text-xs text-zinc-400"
            >
              {cmd}
            </motion.div>
          ))}
        </div>

        {/* Right: Synthesized Output */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4">Synthesized Docs</div>
          <AnimatePresence>
            {isSynthesizing && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 font-mono text-xs text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
              >
                <div className="font-bold mb-2"># Environment Setup</div>
                <div className="text-emerald-500/60 mb-4">Generated by Trace Env v1.0</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} />
                    <span>Detected Node.js dependency: lodash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} />
                    <span>Captured ENV: PORT=3000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} />
                    <span>Identified Entry: server.js</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isSynthesizing && (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 text-zinc-700 text-xs italic">
              Waiting for workflow...
            </div>
          )}
        </div>
      </div>

      {/* Central "Brain" */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div 
          animate={isSynthesizing ? { 
            scale: [1, 1.2, 1],
            rotate: 360,
            boxShadow: ["0 0 20px rgba(16,185,129,0.2)", "0 0 60px rgba(16,185,129,0.6)", "0 0 20px rgba(16,185,129,0.2)"]
          } : {}}
          transition={{ duration: 1 }}
          className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500 bg-black text-emerald-500"
        >
          <Cpu size={32} />
        </motion.div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function TraceEnvLanding() {
  const [activeStep, setActiveStep] = useState(0);

  // Pre-generate random values for particles to keep render pure
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${(i * 7) % 100}%`,
      top: `${(i * 13) % 100}%`,
      delay: (i * 0.5) % 5,
      xOffset: (i * 10) % 40 - 20,
      duration: 4 + (i % 4)
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        
        {/* Particle Field */}
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div key={p.id} style={{ left: p.left, top: p.top }}>
              <FloatingParticle delay={p.delay} xOffset={p.xOffset} duration={p.duration} />
            </div>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Terminal size={18} strokeWidth={3} />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-white">Trace Env</span>
          </motion.div>
          <div className="hidden items-center gap-8 md:flex">
            {['Features', 'Architecture', 'Demo', 'Docs'].map((item, i) => (
              <motion.a 
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {item}
              </motion.a>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <a href="https://github.com" className="hidden text-zinc-400 transition-colors hover:text-white md:block">
              <Github size={20} />
            </a>
            <button className="relative group overflow-hidden rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-48">
          <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-bold text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Local-first Workspace Synthesizer</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-4xl font-sans text-5xl font-bold tracking-tight text-white md:text-8xl leading-[1.1]"
            >
              Documentation should be <span className="relative inline-block">
                <span className="relative z-10 text-emerald-500">executed</span>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-2 left-0 h-3 bg-emerald-500/20 -z-10"
                />
              </span>, not remembered.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-2xl text-xl text-zinc-500"
            >
              Trace Env observes your terminal workflow and automatically generates reproducible setup instructions. No more documentation debt.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 w-full flex justify-center"
            >
              <AnimatedTerminal />
            </motion.div>
          </div>
        </section>

        {/* Problem Section - High Energy Visualization */}
        <section className="py-24 md:py-48 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 md:grid-cols-2 items-center">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="font-sans text-4xl font-bold text-white md:text-6xl"
                >
                  The terminal is your <span className="text-emerald-500">brain dump</span>.
                </motion.h2>
                <p className="mt-8 text-xl leading-relaxed text-zinc-500">
                  Documentation is often the first thing to rot. Trace Env bridges the gap between what you actually did and what you told others to do.
                </p>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: "Zero Friction", desc: "No manual logging required." },
                    { title: "Smart Filter", desc: "Typos are ignored automatically." },
                    { title: "Local First", desc: "Your commands stay private." },
                    { title: "Auto Provision", desc: "Detects missing dependencies." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 transition-colors"
                    >
                      <div className="text-emerald-500 font-bold mb-1">{item.title}</div>
                      <div className="text-xs text-zinc-600">{item.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full" />
                <div className="relative rounded-[2rem] border border-white/10 bg-black/40 p-2 overflow-hidden shadow-2xl">
                  <SynthesisVisualization />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="relative py-24 md:py-48">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader 
              badge="Features"
              title="Everything you need, nothing you don't."
              subtitle="Trace Env is built for speed, privacy, and accuracy. No cloud, no fluff, just reproducible environments."
            />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={Cpu}
                title="Local AI Processing"
                description="Runs fully offline using llama.cpp. Your code and commands never leave your machine."
              />
              <FeatureCard 
                icon={Terminal}
                title="Workflow Observation"
                description="Passive observation of shell activity. No manual logging or tracking required."
              />
              <FeatureCard 
                icon={Zap}
                title="Noise Filtering"
                description="Smartly filters out typos, failed commands, and irrelevant activity to keep docs clean."
              />
              <FeatureCard 
                icon={Code2}
                title="Auto Documentation"
                description="Generates README.md, setup.sh, and Dockerfiles based on your actual workflow."
              />
              <FeatureCard 
                icon={Layers}
                title="Auto Provisioning"
                description="Reconstructs environment variables and system dependencies automatically."
              />
              <FeatureCard 
                icon={Database}
                title="SQLite Backed"
                description="All captured data is stored in a local SQLite database for easy auditing and export."
              />
            </div>
          </div>
        </section>

        {/* Architecture Visualization - Animated Flow */}
        <section id="architecture" className="relative py-24 md:py-48 bg-white/[0.01]">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader 
              badge="Architecture"
              title="Built for the local era."
              subtitle="Trace Env is a lightweight daemon that coordinates between your shell and local intelligence."
            />

            <div className="relative flex flex-col items-center justify-center gap-12 md:flex-row md:gap-20">
              <ArchitectureStep icon={Terminal} label="Shell" active={activeStep === 0} />
              <div className="relative h-12 w-px md:h-px md:w-20 bg-white/10 overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-emerald-500/40"
                />
              </div>
              <ArchitectureStep icon={Command} label="Daemon" active={activeStep === 1} />
              <div className="relative h-12 w-px md:h-px md:w-20 bg-white/10 overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-emerald-500/40"
                />
              </div>
              <ArchitectureStep icon={Database} label="SQLite" active={activeStep === 2} />
              <div className="relative h-12 w-px md:h-px md:w-20 bg-white/10 overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-emerald-500/40"
                />
              </div>
              <ArchitectureStep icon={Cpu} label="Local LLM" active={activeStep === 3} />
              <div className="relative h-12 w-px md:h-px md:w-20 bg-white/10 overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-emerald-500/40"
                />
              </div>
              <ArchitectureStep icon={Code2} label="Docs" active={activeStep === 4} />
            </div>
          </div>
        </section>

        {/* Privacy Section - High Energy Icons */}
        <section className="relative overflow-hidden py-24 md:py-48">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
            >
              <ShieldCheck size={48} />
            </motion.div>
            <h2 className="font-sans text-4xl font-bold text-white md:text-6xl">Your data stays yours.</h2>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-zinc-500">
              Trace Env is built on the principle of local-first computing. We don&apos;t want your data, and we&apos;ve designed the system so we can&apos;t even see it.
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                { icon: Lock, title: "No Cloud APIs", desc: "Everything happens on your machine. No external requests." },
                { icon: EyeOff, title: "No Telemetry", desc: "We don't track usage, commands, or identity. Zero tracking." },
                { icon: Globe, title: "Offline First", desc: "Works perfectly without an internet connection." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-emerald-500/20 transition-all"
                >
                  <item.icon size={32} className="mx-auto mb-4 text-emerald-500" />
                  <h4 className="mb-2 font-bold text-white">{item.title}</h4>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - High Energy Installation */}
        <section className="py-24 md:py-48">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-[4rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent px-8 py-24 text-center md:px-20">
              <Glow className="top-0 left-1/2 -translate-x-1/2 opacity-40" />
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="font-sans text-5xl font-bold text-white md:text-7xl"
              >
                Install Trace Env today.
              </motion.h2>
              <p className="mx-auto mt-8 max-w-xl text-lg text-zinc-500">
                Join thousands of developers who have eliminated documentation debt.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-6 py-3 font-mono text-sm text-white shadow-2xl"
                >
                  <span className="text-emerald-500 font-bold">$</span>
                  <span>npm install -g traceenv</span>
                  <button className="ml-2 text-zinc-500 hover:text-white transition-colors">
                    <Copy size={14} />
                  </button>
                </motion.div>
                <button className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight size={16} /></span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
              <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                <Github size={24} />
                <span className="font-sans font-bold">Open Source</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500 text-black">
                <Terminal size={14} strokeWidth={3} />
              </div>
              <span className="font-sans font-bold text-white">Trace Env</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              {['Twitter', 'GitHub', 'Discord', 'Privacy'].map(item => (
                <a key={item} href="#" className="transition-colors hover:text-white">{item}</a>
              ))}
            </div>
            <p className="text-sm text-zinc-600">
              © 2026 Trace Env. Built for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
