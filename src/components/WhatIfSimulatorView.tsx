import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sliders, RotateCcw } from 'lucide-react';
import { IncidentCase, WhatIfAction } from '../types/cyber';

interface WhatIfSimulatorViewProps {
  incident: IncidentCase;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({ incident }) => {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(
    incident.whatIfActions[0]?.id || null
  );

  useEffect(() => {
    setSelectedActionId(incident.whatIfActions[0]?.id || null);
  }, [incident.id]);

  const activeAction: WhatIfAction | null =
    incident.whatIfActions.find((a) => a.id === selectedActionId) || null;

  const riskBefore = activeAction ? activeAction.riskBefore : incident.riskBreakdown.totalScore;
  const riskAfter = activeAction ? activeAction.riskAfter : riskBefore;
  const stagesPrevented = activeAction ? activeAction.stagesPrevented : 0;

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-sky-400">WHAT-IF ATTACK SIMULATOR · DETERMINISTIC SANDBOX</div>
          <h2 className="text-xl font-bold text-white mt-1">Simulate Response Actions &amp; Evaluate Containment</h2>
          <p className="text-xs text-slate-400 mt-1">
            Test defensive actions to model how early intervention stops the attack chain for #{incident.id}.
          </p>
        </div>

        <button
          onClick={() => setSelectedActionId(null)}
          className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
          Reset to Baseline
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-mono text-slate-400">RISK BEFORE ACTION</div>
          <div className="text-4xl font-bold text-rose-400 mt-2 font-display tabular-nums">{riskBefore}</div>
          <div className="text-xs text-slate-400 mt-1">Full attack chain executed to database.</div>
        </div>

        <div className="bg-[#0F172A] border border-emerald-500/40 rounded-xl p-5">
          <div className="text-xs font-mono text-emerald-400">RISK AFTER ACTION</div>
          <div className="text-4xl font-bold text-emerald-400 mt-2 font-display tabular-nums">{riskAfter}</div>
          <div className="text-xs text-slate-300 mt-1">
            {activeAction ? `Residual risk dropped by ${riskBefore - riskAfter} pts.` : 'Select action below.'}
          </div>
        </div>

        <div className="bg-[#0F172A] border border-sky-500/40 rounded-xl p-5">
          <div className="text-xs font-mono text-sky-400">STAGES PREVENTED</div>
          <div className="text-4xl font-bold text-sky-400 mt-2 font-display tabular-nums">{stagesPrevented}</div>
          <div className="text-xs text-slate-400 mt-1">
            {activeAction ? `Halted at Stage ${activeAction.stopsAtStageIndex}.` : '0 stages halted.'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-base font-semibold text-white pb-2 border-b border-slate-800">
            Available Containment Actions
          </h3>

          <div className="space-y-2">
            {incident.whatIfActions.map((action) => {
              const isSelected = action.id === selectedActionId;
              return (
                <button
                  key={action.id}
                  onClick={() => setSelectedActionId(action.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected ? 'bg-slate-900 border-emerald-400' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-semibold text-white">
                    <span>{action.label}</span>
                    <span className="font-mono text-emerald-400">Risk: {action.riskBefore} → {action.riskAfter}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{action.impactNote}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-base font-semibold text-white pb-2 border-b border-slate-800">
            Attack Path Containment Topology
          </h3>

          <div className="space-y-2.5">
            {incident.storyStages.map((stage) => {
              const isIntercept = activeAction && stage.stageNumber === activeAction.stopsAtStageIndex;
              const isPrevented = activeAction && stage.stageNumber > activeAction.stopsAtStageIndex;

              return (
                <div
                  key={stage.stageNumber}
                  className={`p-3.5 rounded-lg border text-xs ${
                    isIntercept
                      ? 'bg-emerald-950/30 border-emerald-400 text-emerald-200'
                      : isPrevented
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-40'
                      : 'bg-slate-950 border-rose-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center font-semibold">
                    <span>Stage 0{stage.stageNumber}: {stage.stageName}</span>
                    <span className="font-mono">
                      {isIntercept ? '✕ STOPPED HERE' : isPrevented ? 'PREVENTED' : 'EXECUTED'}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
