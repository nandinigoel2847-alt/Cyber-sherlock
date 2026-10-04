import React, { useState } from 'react';
import { Search, Download, Printer } from 'lucide-react';
import { IncidentCase, LogEvent } from '../types/cyber';
import { NORMAL_BACKGROUND_EVENTS, TEST_SUITE_CASES } from '../data/syntheticScenarios';
import {
  buildDeterministicInvestigatorResponse,
  InvestigatorAnswer,
  ingestAndAnalyzeRawLogs,
  IngestionAnalysisResult,
} from '../services/detectionAndCorrelationEngine';

export const LiveEventsAndLogExplorerView: React.FC<{
  incident: IncidentCase;
  onInspectLog: (event: LogEvent) => void;
}> = ({ incident, onInspectLog }) => {
  const [query, setQuery] = useState('');
  const allLogs = [...incident.events, ...NORMAL_BACKGROUND_EVENTS];
  const filtered = allLogs.filter((l) =>
    l.rawLog.toLowerCase().includes(query.toLowerCase()) ||
    l.sourceIp.includes(query) ||
    l.user.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs font-mono text-sky-400">FORENSIC LOG EXPLORER · {filtered.length} LOGS</div>
          <h2 className="text-xl font-bold text-white mt-1">Multi-Source Telemetry Stream</h2>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs, IPs, users..."
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
          />
        </div>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">IP</th>
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3">Event Type</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Raw Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filtered.map((log) => (
              <tr
                key={log.id}
                onClick={() => onInspectLog(log)}
                className="hover:bg-slate-900 cursor-pointer"
              >
                <td className="py-2 px-3 text-slate-300">{log.timestamp}</td>
                <td className="py-2 px-3 text-amber-300">{log.sourceIp}</td>
                <td className="py-2 px-3 text-sky-300">{log.user}</td>
                <td className="py-2 px-3 text-white">{log.eventType}</td>
                <td className="py-2 px-3 text-rose-400">{log.severity}</td>
                <td className="py-2 px-3 text-slate-400 truncate max-w-xs">{log.rawLog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AIInvestigatorView: React.FC<{
  incident: IncidentCase;
  onInspectLog: (event: LogEvent) => void;
  onNavigateToEvidence: (findingId?: string) => void;
}> = ({ incident, onInspectLog, onNavigateToEvidence }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<InvestigatorAnswer[]>([
    buildDeterministicInvestigatorResponse('Why is this IP suspicious?', incident),
  ]);

  const handleAsk = (qText: string) => {
    if (!qText.trim()) return;
    const ans = buildDeterministicInvestigatorResponse(qText, incident);
    setConversation([ans, ...conversation]);
    setQuestion('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="text-xs font-mono text-sky-400">AI FORENSIC INVESTIGATOR · CITING EXACT LOGS</div>
        <h2 className="text-xl font-bold text-white mt-1">Ask Cyber-Sherlock about Incident #{incident.id}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Suggested Questions</div>
          {[
            'What happened in this incident?',
            'Why is this IP suspicious?',
            'Show all events connected to this user.',
            'What is the likely next step?',
          ].map((q, i) => (
            <button
              key={i}
              onClick={() => handleAsk(q)}
              className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 cursor-pointer"
            >
              “{q}”
            </button>
          ))}

          <div className="pt-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask custom question..."
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk(question)}
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {conversation.map((item, idx) => (
            <div key={idx} className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="text-sm font-bold text-sky-400">Q: “{item.question}”</div>
              <p className="text-xs text-slate-200 leading-relaxed">{item.answer}</p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300">
                <span className="font-semibold text-amber-400 font-mono">WHY: </span>
                {item.whyExplanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ReportsView: React.FC<{ incident: IncidentCase }> = ({ incident }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex justify-between items-center">
        <div>
          <div className="text-xs font-mono text-sky-400">FORENSIC REPORT GENERATOR</div>
          <h2 className="text-xl font-bold text-white mt-1">Incident Report #{incident.id}</h2>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 inline mr-1.5" />
          Print / Save PDF
        </button>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">CASE #{incident.id}: {incident.title}</h1>
        <p className="text-xs text-slate-300 leading-relaxed">{incident.narrativeSummary}</p>
        <div className="text-xs font-mono text-rose-400 font-bold">
          Risk Score: {incident.riskBreakdown.totalScore}/100 · Severity: {incident.severity}
        </div>
      </div>
    </div>
  );
};

export const SettingsAndTestSuitesView: React.FC = () => {
  const [selectedTc, setSelectedTc] = useState(TEST_SUITE_CASES[0]);
  const [output, setOutput] = useState<IngestionAnalysisResult | null>(() =>
    ingestAndAnalyzeRawLogs(TEST_SUITE_CASES[0].sampleRawLogs)
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="text-xs font-mono text-sky-400">SYSTEM HEALTH &amp; 14 TEST SUITES</div>
        <h2 className="text-xl font-bold text-white mt-1">Interactive Verification Runner</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2">
          {TEST_SUITE_CASES.map((tc) => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTc(tc);
                setOutput(ingestAndAnalyzeRawLogs(tc.sampleRawLogs));
              }}
              className={`w-full text-left p-3 rounded-lg border text-xs cursor-pointer ${
                tc.id === selectedTc.id ? 'bg-slate-900 border-sky-400' : 'bg-[#0F172A] border-slate-800'
              }`}
            >
              <div className="text-sky-400 font-mono">TEST 0{tc.number}: {tc.title}</div>
              <div className="text-slate-400 mt-1">{tc.description}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="text-sm font-bold text-white">{selectedTc.title}</div>
          <div className="text-xs text-slate-300">Edge Case: {selectedTc.edgeCaseHandled}</div>
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-[11px] font-mono text-emerald-300">
            {selectedTc.sampleRawLogs}
          </pre>
          {output && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs space-y-1">
              <div className="text-sky-400 font-mono">Engine Output: {output.reconstructedNarrative}</div>
              <div className="text-rose-400 font-mono">Computed Risk: {output.overallRiskScore}/100</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
