export type ScoreSummary = {
  overall: number;
  delta7d: number;
  subScores: Array<{
    id: "liquidity" | "receivables" | "payables" | "profitability" | "concentration";
    label: string;
    value: number;
    delta7d: number;
  }>;
  bufferDays: { current: number; target: number };
  peerPercentile: number;
};

export type ActionCard = {
  id: string;
  title: string;
  summary: string;
  impactRange: string;
  reasonFactors: string[];
  cta: {
    label: string;
    action: "schedule_ach" | "send_rtp_rfp" | "open_reserve" | "view_playbook";
  };
  riskFlags?: string[];
  requiresConsent?: string[];
};

export type AssistantMessage = {
  role: "user" | "assistant";
  text: string;
  ts: string;
};

export type AssistantResponse = {
  answer: string;
  sources: Array<{ title: string; url?: string }>;
  complianceBrief: {
    risks: string[];
    mitigations: string[];
    policyLinks: string[];
  };
  nutritionLabelRef: AINutritionLabel;
};

export type AINutritionLabel = {
  featureId: string;
  purpose: string;
  dataUsed: string[];
  dataNotUsed: string[];
  model: {
    name: string;
    version: string;
    lastUpdated: string;
    method: string;
    validation: string;
  };
  topFactors: string[];
  uncertainty: string;
  limits: string[];
  controls: {
    toggles: Array<{ source: string; enabled: boolean }>;
  };
};

export type SandboxInput = {
  dsoDeltaDays?: number;
  shiftPayablesDays?: number;
  priceChangePct?: number;
  reserveSweepPct?: number;
};

export type SandboxResult = {
  projectedBufferDays: number;
  runwayDays: number;
  kpis: Array<{ label: string; value: string; delta?: string }>;
  warnings?: string[];
};
