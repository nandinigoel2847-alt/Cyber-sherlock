import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { IncidentCase, LogEvent, NavigationTab } from '../types/cyber';
import {
  TIME_SERIES_DATA,
  TOP_SUSPICIOUS_IPS,
  RECENT_INCIDENTS_SUMMARY,
} from '../data/syntheticScenarios';

interface OverviewDashboardViewProps {
  incident: IncidentCase;
  onSelectIncident: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onLaunchReplay: () => void;
  onInspectLog: (event: LogEvent) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  incident,
  onSelectIncident,
  onNavigate,
  onLaunchReplay,
  onInspectLog,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Active Incidents', value: '07', sub: '2 Critical · 3 High', tab: 'investigations' as NavigationTab },
          { label: 'Critical Threats', value: '03', sub: '#CYB-1042, #1089', tab: 'investigations' as NavigationTab },
          { label: 'Suspicious IPs', value: '24', sub: 'Top: 103.214.88.19', tab: 'live-events' as NavigationTab },
          { label: 'Affected Users', value: '11', sub: 'Primary: admin01', tab: 'attack-graph' as NavigationTab },
          { label: 'Risk Score', value: `${incident.riskBreakdown.totalScore}/100`, sub: 'Explainable', tab: 'what-if' as NavigationTab },
          { label: 'Events Analyzed', value: '48,291', sub: 'Correlated into Stories', tab: 'live-events' as NavigationTab },
        ].map((kpi, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(kpi.tab)}
            className="text-left bg-[#0F172A] border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-slate-700"
          >
            <div className="text-xs text-slate-400">{kpi.label}</div>
            <div className="font-display text-2xl font-bold mt-1 text-white tabular-nums">{kpi.value}</div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">{kpi.sub}</div>
          </button>
        ))}
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-sky-400">ATTACK STORY PANEL · #CYB-1042</div>
            <h2 className="text-lg font-bold text-white mt-0.5">{incident.chainTitle}</h2>
          </div>
          <button
            onClick={onLaunchReplay}
            className="px-4 py-2 bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 inline mr-1 fill-current" />
            Replay Attack
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {incident.storyStages.map((stage) => (
            <div key={stage.stageNumber} className="p-3 bg-slate-950 border border-slate-800 rounded text-xs">
              <div className="font-mono text-amber-400 text-[11px]">{stage.timestamp.slice(0, 8)}</div>
              <div className="font-semibold text-white mt-1">{stage.stageName}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 border-l-2 border-sky-400 rounded-r">
          {incident.narrativeSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Top Suspicious IPs</h3>
          <div className="space-y-2">
            {TOP_SUSPICIOUS_IPS.map((ip) => (
              <div key={ip.ip} className="flex justify-between items-center p-2.5 bg-slate-950 rounded text-xs font-mono">
                <span className="text-amber-400">{ip.ip}</span>
                <span className="text-slate-400">{ip.country}</span>
                <span className="text-rose-400 font-bold">Risk {ip.risk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Recent Incidents</h3>
          <div className="space-y-2">
            {RECENT_INCIDENTS_SUMMARY.map((inc) => (
              <div key={inc.id} className="flex justify-between items-center p-2.5 bg-slate-950 rounded text-xs font-mono">
                <span className="text-sky-400 font-bold">#{inc.id}</span>
                <span className="text-slate-300">{inc.attackType}</span>
                <span className="text-emerald-400 font-semibold">{inc.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
