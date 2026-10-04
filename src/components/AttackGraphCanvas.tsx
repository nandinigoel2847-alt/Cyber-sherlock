import React, { useState, useEffect } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { GraphNode, IncidentCase, LogEvent, EvidenceFinding } from '../types/cyber';

interface AttackGraphCanvasProps {
  incident: IncidentCase;
  autoStartReplay?: boolean;
  onInspectLog: (event: LogEvent) => void;
  onSelectEvidence: (finding: EvidenceFinding) => void;
}

export const AttackGraphCanvas: React.FC<AttackGraphCanvasProps> = ({
  incident,
  autoStartReplay = false,
  onInspectLog,
  onSelectEvidence,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(incident.nodes[0]?.id || '');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isReplaying, setIsReplaying] = useState<boolean>(autoStartReplay);
  const [replayStepIndex, setReplayStepIndex] = useState<number>(0);

  useEffect(() => {
    setSelectedNodeId(incident.nodes[0]?.id || '');
    setReplayStepIndex(autoStartReplay ? 1 : 0);
    setIsReplaying(autoStartReplay);
  }, [incident.id, autoStartReplay]);

  useEffect(() => {
    if (!isReplaying) return;
    const timer = setInterval(() => {
      setReplayStepIndex((prev) => {
        if (prev >= incident.replaySteps.length) {
          setIsReplaying(false);
          return prev;
        }
        const next = prev + 1;
        const step = incident.replaySteps[next - 1];
        if (step?.activeNodeIds[0]) {
          setSelectedNodeId(step.activeNodeIds[step.activeNodeIds.length - 1]);
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(timer);
  }, [isReplaying, incident.replaySteps]);

  const currentReplayStep = replayStepIndex > 0 ? incident.replaySteps[replayStepIndex - 1] : null;
  const selectedNode = incident.nodes.find((n) => n.id === selectedNodeId) || incident.nodes[0];
  const relatedEvents = incident.events.filter((e) => selectedNode?.relatedEventIds.includes(e.id));
  const relatedFindings = incident.findings.filter((f) => selectedNode?.evidenceIds.includes(f.id));

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-sky-400">
            INTERACTIVE ATTACK GRAPH · INCIDENT #{incident.id}
          </div>
          <h2 className="text-lg font-semibold text-white mt-0.5">{incident.chainTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          {replayStepIndex === 0 ? (
            <button
              onClick={() => {
                setReplayStepIndex(1);
                setIsReplaying(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg cursor-pointer"
            >
              ▶ REPLAY ATTACK
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-slate-950 border border-sky-400/40 rounded-lg p-1 text-xs">
              <button
                onClick={() => setIsReplaying(!isReplaying)}
                className="px-3 py-1 bg-sky-400 text-slate-950 font-semibold rounded"
              >
                {isReplaying ? 'Pause' : 'Resume'}
              </button>
              <span className="font-mono text-sky-400">
                Step {replayStepIndex}/{incident.replaySteps.length}
              </span>
              <button
                onClick={() => {
                  setIsReplaying(false);
                  setReplayStepIndex(0);
                }}
                className="px-2 py-1 text-slate-400 hover:text-white"
              >
                Exit Replay
              </button>
            </div>
          )}
        </div>
      </div>

      {currentReplayStep && (
        <div className="bg-[#0F172A] border border-sky-500/50 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-amber-400">
              REPLAY STEP {currentReplayStep.stepIndex}: {currentReplayStep.timestamp}
            </div>
            <div className="text-sm font-semibold text-white mt-1">
              {currentReplayStep.title} — {currentReplayStep.description}
            </div>
          </div>
          <div className="text-right font-mono text-xs text-sky-300">
            {currentReplayStep.metricsSummary}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#0F172A] border border-slate-800 rounded-xl p-4 h-[440px] flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Click any node to view forensic telemetry</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} className="p-1 hover:text-white">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))} className="p-1 hover:text-white">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <svg viewBox="0 0 980 340" className="w-full h-full">
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {incident.edges.map((edge) => {
                  const src = incident.nodes.find((n) => n.id === edge.source);
                  const dst = incident.nodes.find((n) => n.id === edge.target);
                  if (!src || !dst) return null;
                  const isCurrent = currentReplayStep?.activeEdgeId === edge.id;
                  return (
                    <g key={edge.id}>
                      <line
                        x1={src.x + 60}
                        y1={src.y}
                        x2={dst.x - 60}
                        y2={dst.y}
                        stroke={isCurrent ? '#38BDF8' : '#F43F5E'}
                        strokeWidth={isCurrent ? 3 : 1.5}
                      />
                      <text
                        x={(src.x + dst.x) / 2}
                        y={(src.y + dst.y) / 2 - 8}
                        textAnchor="middle"
                        fill="#94A3B8"
                        fontSize="9"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {incident.nodes.map((node) => {
                  const isSelected = node.id === selectedNode?.id;
                  const isReplayActive = currentReplayStep?.activeNodeIds.includes(node.id);
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={-60}
                        y={-28}
                        width={120}
                        height={56}
                        rx={6}
                        fill="#090D16"
                        stroke={isSelected || isReplayActive ? '#38BDF8' : '#475569'}
                        strokeWidth={isSelected || isReplayActive ? 2 : 1}
                      />
                      <text x={0} y={-4} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                        {node.label}
                      </text>
                      <text x={0} y={12} textAnchor="middle" fill="#64748B" fontSize="8.5">
                        {node.type.toUpperCase()} · R:{node.riskScore}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <div className="text-xs font-mono text-sky-400">NODE FORENSICS</div>
            <h3 className="text-base font-bold text-white mt-1">{selectedNode.label}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{selectedNode.sublabel}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
              <div className="text-slate-400">Risk Score</div>
              <div className="font-mono text-rose-400 font-bold mt-0.5">{selectedNode.riskScore}/100</div>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
              <div className="text-slate-400">First Seen</div>
              <div className="font-mono text-slate-200 mt-0.5">{selectedNode.firstSeen}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Related Events ({relatedEvents.length})</div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {relatedEvents.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => onInspectLog(evt)}
                  className="w-full text-left p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-xs transition-colors cursor-pointer"
                >
                  <div className="text-sky-400 font-mono">[{evt.id}] {evt.eventType}</div>
                  <div className="text-slate-400 text-[11px] truncate mt-0.5">{evt.rawLog}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
