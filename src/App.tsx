import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  FolderSearch,
  GitBranch,
  Clock,
  Lock,
  TrendingUp,
  Sliders,
  MessageSquareCode,
  FileText,
  Settings,
  Play,
  X,
} from 'lucide-react';
import {
  IncidentCase,
  LogEvent,
  EvidenceFinding,
  NavigationTab,
} from './types/cyber';
import { INCIDENT_CASES } from './data/syntheticScenarios';
import { LandingPage } from './components/LandingPage';
import { OverviewDashboardView } from './components/OverviewDashboardView';
import { AttackGraphCanvas } from './components/AttackGraphCanvas';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import {
  InvestigationsView,
  TimelineView,
  EvidenceLockerView,
  PredictionsView,
} from './components/EvidenceAndStoryViews';
import {
  LiveEventsAndLogExplorerView,
  AIInvestigatorView,
  ReportsView,
  SettingsAndTestSuitesView,
} from './components/OperationsAndAIViews';

const NAV_ITEMS: {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live-events', label: 'Live Events', icon: Activity },
  { id: 'investigations', label: 'Investigations', icon: FolderSearch },
  { id: 'attack-graph', label: 'Attack Graph', icon: GitBranch },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'evidence', label: 'Evidence', icon: Lock },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'what-if', label: 'What-If Simulator', icon: Sliders },
  { id: 'ai-investigator', label: 'AI Investigator', icon: MessageSquareCode },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('CYB-1042');
  const [autoReplayGraph, setAutoReplayGraph] = useState<boolean>(false);
  const [inspectedLog, setInspectedLog] = useState<LogEvent | null>(null);

  const activeIncident: IncidentCase =
    INCIDENT_CASES.find((c) => c.id === selectedIncidentId) || INCIDENT_CASES[0];

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchDashboard={() => {
          setViewMode('app');
          setActiveTab('overview');
        }}
        onStartDemoScenario={() => {
          setViewMode('app');
          setActiveTab('attack-graph');
          setAutoReplayGraph(true);
        }}
        onJumpToTab={(tab) => {
          setViewMode('app');
          setActiveTab(tab as NavigationTab);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0F172A] border-r border-slate-800 justify-between">
        <div>
          <div className="px-6 py-5 border-b border-slate-800">
            <button onClick={() => setViewMode('landing')} className="text-left cursor-pointer">
              <div className="font-display text-lg font-bold text-white">CYBER-SHERLOCK</div>
              <div className="text-[11px] font-mono text-slate-400">Detect. Connect. Explain. Predict.</div>
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAutoReplayGraph(false);
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium cursor-pointer ${
                    isActive ? 'bg-sky-400 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 m-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
          <div className="text-sky-400 font-mono font-bold">FROM ALERTS TO STORIES</div>
          <button onClick={() => setViewMode('landing')} className="text-slate-400 hover:text-white underline text-[11px]">
            ← Back to Landing
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-[#090D16]/95 backdrop-blur border-b border-slate-800 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-sky-400 font-bold uppercase">{activeTab}</span>
            <span>/</span>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-mono"
            >
              {INCIDENT_CASES.map((inc) => (
                <option key={inc.id} value={inc.id}>Case #{inc.id}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setActiveTab('attack-graph');
              setAutoReplayGraph(true);
            }}
            className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>🎬 DEMO ATTACK</span>
          </button>
        </header>

        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewDashboardView
              incident={activeIncident}
              onSelectIncident={setSelectedIncidentId}
              onNavigate={setActiveTab}
              onLaunchReplay={() => {
                setAutoReplayGraph(true);
                setActiveTab('attack-graph');
              }}
              onInspectLog={setInspectedLog}
            />
          )}

          {activeTab === 'live-events' && (
            <LiveEventsAndLogExplorerView incident={activeIncident} onInspectLog={setInspectedLog} />
          )}

          {activeTab === 'investigations' && (
            <InvestigationsView
              incident={activeIncident}
              allIncidents={INCIDENT_CASES}
              onSelectIncident={setSelectedIncidentId}
              onInspectLog={setInspectedLog}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'attack-graph' && (
            <AttackGraphCanvas
              incident={activeIncident}
              autoStartReplay={autoReplayGraph}
              onInspectLog={setInspectedLog}
              onSelectEvidence={() => setActiveTab('evidence')}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView incident={activeIncident} onInspectLog={setInspectedLog} />
          )}

          {activeTab === 'evidence' && (
            <EvidenceLockerView incident={activeIncident} onInspectLog={setInspectedLog} />
          )}

          {activeTab === 'predictions' && (
            <PredictionsView incident={activeIncident} onNavigate={setActiveTab} />
          )}

          {activeTab === 'what-if' && <WhatIfSimulatorView incident={activeIncident} />}

          {activeTab === 'ai-investigator' && (
            <AIInvestigatorView
              incident={activeIncident}
              onInspectLog={setInspectedLog}
              onNavigateToEvidence={() => setActiveTab('evidence')}
            />
          )}

          {activeTab === 'reports' && <ReportsView incident={activeIncident} />}

          {activeTab === 'settings' && <SettingsAndTestSuitesView />}
        </main>
      </div>

      {inspectedLog && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setInspectedLog(null)}
        >
          <div
            className="bg-[#0F172A] border border-slate-700 rounded-xl max-w-xl w-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="font-bold text-white text-sm">[{inspectedLog.id}] {inspectedLog.eventType}</div>
              <button onClick={() => setInspectedLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-emerald-300 whitespace-pre-wrap">
              {inspectedLog.rawLog}
            </pre>
            <div className="text-xs text-slate-300">
              <span className="font-mono text-sky-400 font-semibold">Why it matters: </span>
              {inspectedLog.whyItMatters}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
