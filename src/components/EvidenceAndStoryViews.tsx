import React, { useState } from 'react';
import { IncidentCase, LogEvent, EvidenceFinding, NavigationTab } from '../types/cyber';

interface InvestigationsViewProps {
  incident: IncidentCase;
  allIncidents: IncidentCase[];
  onSelectIncident: (id: string) => void;
  onInspectLog: (event: LogEvent) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  incident,
  allIncidents,
  onSelectIncident,
  onInspectLog,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-sky-400">CASE FILE &amp; ATTACK STORY</div>
          <h2 className="text-2xl font-bold text-white mt-1">CASE #{incident.id} — {incident.title}</h2>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            Severity: {incident.severity} · Confidence: {incident.confidence}% · Attacker: {incident.attackerIp}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {allIncidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer ${
                inc.id === incident.id ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
              }`}
            >
              #{inc.id}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Reconstructed Attack Sequence: {incident.chainTitle}</h3>
        <blockquote className="p-4 bg-slate-950 border-l-2 border-sky-400 text-xs text-slate-200">
          “{incident.narrativeSummary}”
        </blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {incident.storyStages.map((stage) => (
            <div key={stage.stageNumber} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
              <div className="text-sky-400 font-mono">STAGE 0{stage.stageNumber}</div>
              <div className="font-bold text-white mt-1">{stage.stageName}</div>
              <div className="text-[11px] text-amber-400 font-mono mt-0.5">{stage.timestamp}</div>
              <p className="text-slate-400 text-[11px] mt-1.5">{stage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TimelineView: React.FC<{ incident: IncidentCase; onInspectLog: (event: LogEvent) => void }> = ({
  incident,
  onInspectLog,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="text-xs font-mono text-sky-400">CORRELATED TIMELINE · #{incident.id}</div>
        <h2 className="text-xl font-bold text-white mt-1">Chronological Sequence of Events</h2>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-3">
        {incident.events.map((evt, idx) => (
          <div
            key={evt.id}
            onClick={() => onInspectLog(evt)}
            className="p-3.5 bg-slate-950 border border-slate-800 hover:border-sky-400 rounded-lg transition-colors cursor-pointer flex justify-between items-center text-xs"
          >
            <div>
              <span className="font-mono text-amber-400 mr-2">{evt.timestamp}</span>
              <span className="font-bold text-white mr-2">{evt.eventType}</span>
              <span className="text-slate-400">{evt.whyItMatters}</span>
            </div>
            <span className="font-mono text-sky-400">[{evt.id}] →</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EvidenceLockerView: React.FC<{
  incident: IncidentCase;
  initialFindingId?: string;
  onInspectLog: (event: LogEvent) => void;
}> = ({ incident, onInspectLog }) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>(incident.findings[0]?.id || '');
  const activeFinding = incident.findings.find((f) => f.id === selectedFindingId) || incident.findings[0];

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="text-xs font-mono text-sky-400">EVIDENCE LOCKER · EVERY CONCLUSION HAS EVIDENCE</div>
        <h2 className="text-xl font-bold text-white mt-1">Forensic Proof Traceability (#{incident.id})</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-3">
          {incident.findings.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFindingId(f.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                f.id === activeFinding?.id ? 'bg-slate-900 border-sky-400' : 'bg-[#0F172A] border-slate-800'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-sky-400">{f.id} · {f.stage}</span>
                <span className="text-emerald-400">{f.confidence}% Conf.</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">{f.finding}</h3>
              <p className="text-xs text-slate-400 mt-1">{f.summary}</p>

              <div className="mt-2 space-y-1">
                {f.supportingBullets.map((b, i) => (
                  <div key={i} className="text-[11px] text-slate-300">• {b}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-6 bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="text-xs font-mono text-amber-400">ORIGINAL LOG ENTRY INSPECTOR</div>
          {activeFinding && (
            <div className="space-y-3 text-xs">
              <div className="text-white font-semibold">Finding: {activeFinding.finding}</div>
              <p className="text-slate-300">{activeFinding.whyItMatters}</p>
              <div className="font-semibold text-slate-200">Linked Log Events:</div>
              <div className="space-y-1.5">
                {activeFinding.eventIds.map((eId) => {
                  const ev = incident.events.find((e) => e.id === eId);
                  if (!ev) return null;
                  return (
                    <div
                      key={eId}
                      onClick={() => onInspectLog(ev)}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono hover:border-sky-400 cursor-pointer"
                    >
                      <div className="text-sky-400">{ev.timestamp} · {ev.eventType}</div>
                      <div className="text-emerald-300 text-[11px] mt-0.5">{ev.rawLog}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PredictionsView: React.FC<{ incident: IncidentCase; onNavigate: (tab: NavigationTab) => void }> = ({
  incident,
  onNavigate,
}) => {
  const prediction = incident.predictionsByStage[4] || incident.predictionsByStage[6];
  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="text-xs font-mono text-amber-400">ATTACK PREDICTION ENGINE · PROBABILISTIC INFERENCE</div>
        <h2 className="text-xl font-bold text-white mt-1">Anticipate the Attacker's Next Stage</h2>
      </div>

      {prediction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0F172A] border border-amber-500/40 rounded-xl p-6 space-y-4">
            <div className="text-xs font-mono text-slate-400">OBSERVED SEQUENCE: {prediction.currentStageLabel}</div>
            <div className="text-xs font-mono text-amber-400">NEXT LIKELY ACTION</div>
            <div className="text-3xl font-bold text-white font-display">
              {prediction.nextLikelyAction} <span className="text-amber-400">({prediction.primaryProbability}%)</span>
            </div>
            <p className="text-xs text-slate-300">{prediction.explanationWhy}</p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-semibold text-white">Possible Next Candidates</h3>
            {prediction.candidates.map((c, i) => (
              <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>{c.stage}</span>
                  <span className="text-amber-400 font-mono">{c.probability}%</span>
                </div>
                <div className="text-slate-400 text-[11px]">{c.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
