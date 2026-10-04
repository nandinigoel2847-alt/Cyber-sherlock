export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type LogSourceType = 'auth' | 'server' | 'application' | 'network';

export type AttackStageName =
  | 'Reconnaissance'
  | 'Credential Attack'
  | 'Account Compromise'
  | 'Privilege Escalation'
  | 'Lateral Movement'
  | 'Sensitive Resource Access'
  | 'Data Exfiltration'
  | 'Normal Activity';

export interface LogEvent {
  id: string;
  timestamp: string;
  epochMs: number;
  sourceIp: string;
  destination: string;
  user: string;
  eventType: string;
  logSource: LogSourceType;
  severity: SeverityLevel;
  status: 'FLAGGED' | 'CORRELATED' | 'NORMAL' | 'DEDUPLICATED' | 'SANITIZED';
  correlationId: string;
  stage: AttackStageName;
  rawLog: string;
  whyItMatters: string;
  anomalyScore: number;
  ruleMatched?: string;
  mitreTechnique?: string;
  edgeCaseNote?: string;
}

export type GraphNodeType =
  | 'ip'
  | 'user'
  | 'device'
  | 'server'
  | 'application'
  | 'database'
  | 'event';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  sublabel: string;
  riskScore: number;
  firstSeen: string;
  lastSeen: string;
  relatedEventIds: string[];
  evidenceIds: string[];
  stageIndex: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  eventType: string;
  timestamp: string;
  stageIndex: number;
  evidenceId: string;
  eventId: string;
  severity: SeverityLevel;
}

export interface EvidenceFinding {
  id: string;
  finding: string;
  stage: AttackStageName;
  confidence: number;
  severity: SeverityLevel;
  summary: string;
  supportingBullets: string[];
  eventIds: string[];
  whyItMatters: string;
  recommendedAction: string;
}

export interface ReplayStep {
  stepIndex: number;
  timestamp: string;
  title: string;
  stage: AttackStageName;
  severity: SeverityLevel;
  activeNodeIds: string[];
  activeEdgeId?: string;
  eventId: string;
  evidenceId: string;
  description: string;
  metricsSummary: string;
}

export interface PredictionOption {
  stage: string;
  probability: number;
  mitreId: string;
  rationale: string;
  evidenceBasis: string[];
  preemptiveAction: string;
}

export interface StagePredictionState {
  currentStageLabel: string;
  nextLikelyAction: string;
  primaryProbability: number;
  explanationWhy: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  candidates: PredictionOption[];
}

export interface WhatIfAction {
  id: string;
  label: string;
  category: 'block_ip' | 'disable_user' | 'revoke_session' | 'remove_privilege' | 'isolate_server';
  targetEntity: string;
  stopsAtStageIndex: number;
  stoppedStageName: AttackStageName;
  blockedNodeId: string;
  riskBefore: number;
  riskAfter: number;
  stagesPrevented: number;
  technicalMechanism: string;
  impactNote: string;
}

export interface AttackerFingerprint {
  signatureId: string;
  clusterName: string;
  loginPattern: string;
  targetSelection: string;
  timingPattern: string;
  privilegeBehavior: string;
  resourceAccess: string;
  eventSequence: string[];
  behavioralTraits: string[];
  similarIncidents: {
    incidentA: string;
    incidentB: string;
    similarityPercent: number;
    sharedBehaviors: string[];
    ipChangedNote: string;
  }[];
}

export interface RiskBreakdown {
  totalScore: number;
  authAnomalies: { score: number; max: number; detail: string };
  privilegeChanges: { score: number; max: number; detail: string };
  unusualAccess: { score: number; max: number; detail: string };
  eventCorrelation: { score: number; max: number; detail: string };
  sequenceConfidence: { score: number; max: number; detail: string };
}

export interface AttackStoryStage {
  stageNumber: number;
  stageName: AttackStageName;
  timestamp: string;
  title: string;
  description: string;
  eventCount: number;
  confidence: number;
  severity: SeverityLevel;
  keyEventIds: string[];
  evidenceId: string;
}

export interface IncidentCase {
  id: string;
  title: string;
  chainTitle: string;
  severity: SeverityLevel;
  status: 'ACTIVE INVESTIGATION' | 'CONTAINED (SIMULATED)' | 'NEEDS REVIEW';
  attackerIp: string;
  attackerGeo: string;
  targetAsset: string;
  affectedUser: string;
  firstSeen: string;
  lastSeen: string;
  confidence: number;
  attackPattern: string;
  evidenceCount: number;
  affectedAssetsCount: number;
  affectedAssetsList: string[];
  narrativeSummary: string;
  sixAnswers: {
    whatHappened: string;
    whoDidIt: string;
    howItHappened: string;
    whatEvidenceProvesIt: string;
    whatLikelyNext: string;
    whatActionStopsIt: string;
  };
  recommendedActions: string[];
  storyStages: AttackStoryStage[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  replaySteps: ReplayStep[];
  findings: EvidenceFinding[];
  predictionsByStage: Record<number, StagePredictionState>;
  whatIfActions: WhatIfAction[];
  fingerprint: AttackerFingerprint;
  riskBreakdown: RiskBreakdown;
  events: LogEvent[];
}

export interface SuspiciousIpRecord {
  ip: string;
  risk: number;
  eventsCount: number;
  country: string;
  asn: string;
  attackStage: AttackStageName;
  status: 'ACTIVE THREAT' | 'MONITORING' | 'BLOCKED (SIM)';
  linkedIncidentId: string;
}

export interface TestCaseDefinition {
  id: string;
  number: number;
  title: string;
  category: 'Detection' | 'Correlation' | 'Edge Case' | 'Reliability';
  description: string;
  edgeCaseHandled: string;
  sampleRawLogs: string;
  expectedDetection: string;
  expectedConfidence: number;
  expectedSeverity: SeverityLevel;
}

export type NavigationTab =
  | 'overview'
  | 'live-events'
  | 'investigations'
  | 'attack-graph'
  | 'timeline'
  | 'evidence'
  | 'predictions'
  | 'what-if'
  | 'ai-investigator'
  | 'reports'
  | 'settings';
