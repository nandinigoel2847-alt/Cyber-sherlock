import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Play,
  ShieldAlert,
  GitBranch,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onStartDemoScenario: () => void;
  onJumpToTab: (tab: string) => void;
}

const HERO_CHAIN_NODES = [
  {
    id: 'h-ip',
    step: '01',
    title: 'Attacker IP',
    entity: '103.214.88.19',
    time: '10:01:12',
    detail: '37 failed logins across 4 accounts in 112s burst',
    risk: '96/100',
  },
  {
    id: 'h-user',
    step: '02',
    title: 'Compromised Account',
    entity: 'admin01',
    time: '10:02:04',
    detail: 'Authenticated 6s after brute-force burst (sess_99a8f2)',
    risk: '94/100',
  },
  {
    id: 'h-srv',
    step: '03',
    title: 'Gateway Server',
    entity: 'srv-auth-01 (10.24.1.10)',
    time: '10:02:04',
    detail: 'Interactive SSH session established from untrusted ASN',
    risk: '88/100',
  },
  {
    id: 'h-priv',
    step: '04',
    title: 'Privilege Escalation',
    entity: 'UID 0 (root) · sudoers',
    time: '10:03:17',
    detail: 'Executed sudo su - root & created /etc/sudoers.d/90-temp',
    risk: '95/100',
  },
  {
    id: 'h-db',
    step: '05',
    title: 'Financial Database',
    entity: 'db-finance-vault',
    time: '10:06:21',
    detail: 'Pivoted via srv-fin-core · Queried 14,200 wire transfer rows',
    risk: '97/100',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onStartDemoScenario,
  onJumpToTab,
}) => {
  const [activePulseIndex, setActivePulseIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePulseIndex((prev) => (prev + 1) % HERO_CHAIN_NODES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const activeNode = HERO_CHAIN_NODES[activePulseIndex];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-12 py-4 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80">
        <a href="#top" className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap">
          CYBER-SHERLOCK
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#problem-solution" className="hover:text-white transition-colors">
            From Alerts to Stories
          </a>
          <a href="#why-cyber-sherlock" className="hover:text-white transition-colors">
            Why Cyber-Sherlock
          </a>
          <a href="#demo-walkthrough" className="hover:text-white transition-colors">
            3-Minute Judge Flow
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartDemoScenario}
            className="px-4 py-2 text-xs font-semibold text-amber-300 border border-amber-500/40 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            Explore Demo
          </button>
          <button
            onClick={onLaunchDashboard}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 rounded-lg hover:bg-sky-300 transition-colors cursor-pointer"
          >
            Launch Investigation
          </button>
        </div>
      </header>

      <main id="top" className="flex-1">
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-20 lg:pt-20 lg:pb-24 border-b border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs text-sky-400 font-mono">
                <span>ALG-CYBER-01 · FIND THE INTRUDER</span>
                <span aria-hidden="true">·</span>
                <span>DETECT. CONNECT. EXPLAIN. PREDICT.</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                AI-Powered Attack Investigation &amp; Prediction
              </h1>

              <p className="text-xl sm:text-2xl text-slate-200 font-medium leading-snug max-w-2xl">
                Don’t just detect the intrusion. Reconstruct the attack.
              </p>

              <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
                Security operations teams face thousands of noisy events that hide an intruder among normal activity.
                Cyber-Sherlock transforms scattered logs into an explainable attack story backed by causal graph correlation.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onLaunchDashboard}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-sky-400 rounded-lg hover:bg-sky-300 transition-colors cursor-pointer"
                >
                  <span>Launch Investigation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onStartDemoScenario}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 text-amber-400" />
                  <span>Explore Demo (Scenario #CYB-1042)</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 border-t border-slate-800/80">
                <span className="text-slate-200 font-medium">From Alerts to Attack Stories.</span>
                <span aria-hidden="true">·</span>
                <span>Every conclusion has evidence.</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-500">Synthetic Demo Data</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <div>
                    <div className="text-xs font-mono text-slate-400">
                      LIVE ATTACK STORY RECONSTRUCTION
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Incident #CYB-1042 · Confidence 93%
                    </div>
                  </div>
                  <div className="font-mono text-xs text-rose-400 tabular-nums">
                    RISK 91/100 · CRITICAL
                  </div>
                </div>

                <div className="space-y-2.5">
                  {HERO_CHAIN_NODES.map((node, index) => {
                    const isCurrent = index === activePulseIndex;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActivePulseIndex(index)}
                        className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isCurrent
                            ? 'bg-slate-900/95 border-sky-400/70'
                            : 'bg-slate-950/60 border-slate-800/90'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className={`font-mono text-xs font-semibold tabular-nums ${isCurrent ? 'text-sky-400' : 'text-slate-500'}`}>
                            {node.step}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-slate-200">{node.title}</span>
                              <span aria-hidden="true" className="text-slate-500">·</span>
                              <span className="font-mono text-sky-300 truncate">{node.entity}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{node.detail}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono tabular-nums text-xs text-slate-300">
                          {node.time}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
                  <div className="text-slate-300 truncate">
                    <span className="font-mono text-sky-400">STAGE {activeNode.step}:</span> {activeNode.detail}
                  </div>
                  <button
                    onClick={() => onJumpToTab('attack-graph')}
                    className="text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                  >
                    Open Graph →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why-cyber-sherlock" className="max-w-7xl mx-auto px-6 lg:px-12 py-20 border-b border-slate-800/80">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono text-sky-400 mb-2">01. WHY CYBER-SHERLOCK?</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Detect. Connect. Explain. Predict.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
                <span>01. DETECT</span>
                <ShieldAlert className="w-4 h-4 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Find Suspicious Behavior</h3>
              <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
                Ingests security logs, runs rule-based and statistical anomaly detection, and filters out false positives.
              </p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
                <span>02. INVESTIGATE</span>
                <GitBranch className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Reconstruct the Attack Story</h3>
              <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
                Connects events into an interactive causal attack graph and verifiable Evidence Locker linking to raw logs.
              </p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
                <span>03. PREDICT</span>
                <Sliders className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Simulate Containment</h3>
              <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
                Predicts likely next stages and simulates defensive actions (block IP, revoke sessions) in a What-If sandbox.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-8 px-6 lg:px-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>CYBER-SHERLOCK · ALGOTHON’26 (ALG-CYBER-01)</span>
          <span>Synthetic Demo Telemetry</span>
        </div>
      </footer>
    </div>
  );
};
