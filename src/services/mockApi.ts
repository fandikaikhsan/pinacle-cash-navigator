import type {
  ScoreSummary,
  ActionCard,
  AssistantMessage,
  AssistantResponse,
  AINutritionLabel,
  SandboxInput,
  SandboxResult,
} from "@/types";

// Mock data
const mockScoreSummary: ScoreSummary = {
  overall: 68,
  delta7d: 3,
  subScores: [
    { id: "liquidity", label: "Liquidity & Runway", value: 64, delta7d: 2 },
    { id: "receivables", label: "Receivables Health", value: 58, delta7d: -4 },
    { id: "payables", label: "Payables Discipline", value: 72, delta7d: 1 },
    { id: "profitability", label: "Profitability", value: 70, delta7d: 0 },
    { id: "concentration", label: "Concentration & Volatility", value: 63, delta7d: 0 },
  ],
  bufferDays: { current: 28, target: 45 },
  peerPercentile: 62,
};

const mockActions: ActionCard[] = [
  {
    id: "action-1",
    title: "Auto-remind 5 invoices 7–14d past due",
    summary: "Nudge late payers with automated, professional reminders",
    impactRange: "Likely +6–10 buffer days",
    reasonFactors: ["DSO ↑ 7d", "3 invoices >60d"],
    cta: { label: "Set up reminders", action: "send_rtp_rfp" },
    riskFlags: ["customer fatigue risk low"],
    requiresConsent: ["invoices"],
  },
  {
    id: "action-2",
    title: "Open Reserve & sweep 4.2% inflows weekly",
    summary: "Automatically build your cash cushion from incoming revenue",
    impactRange: "Likely +8–12 buffer days",
    reasonFactors: ["Low reserve balance", "Consistent weekly inflows"],
    cta: { label: "Open Reserve", action: "open_reserve" },
  },
  {
    id: "action-3",
    title: "Shift 2 vendor payments by 7 days within terms",
    summary: "Optimize payment timing without damaging supplier relationships",
    impactRange: "Likely +4–6 buffer days",
    reasonFactors: ["Available payment slack", "Terms allow flexibility"],
    cta: { label: "Schedule payments", action: "schedule_ach" },
    requiresConsent: ["bills"],
  },
];

const mockNutritionLabel: AINutritionLabel = {
  featureId: "wellness_score",
  purpose: "Calculate financial wellness score and predict cash buffer days",
  dataUsed: ["transactions", "balances", "invoices", "bills"],
  dataNotUsed: ["owner_demographics", "personal_credit_history"],
  model: {
    name: "Cash Health Predictor v2",
    version: "2.3.1",
    lastUpdated: "2025-09-15",
    method: "Gradient boosting ensemble",
    validation: "90-day rolling validation; MAE ±3.2 days",
  },
  topFactors: ["DSO trend (7d)", "LOC utilization", "Payment velocity", "Seasonal variance"],
  uncertainty: "±4 score points; buffer days ±3–5 days (80% confidence)",
  limits: ["<6 weeks history reduces stability", "Seasonal businesses may see wider bands"],
  controls: {
    toggles: [
      { source: "transactions", enabled: true },
      { source: "balances", enabled: true },
      { source: "invoices", enabled: true },
      { source: "bills", enabled: true },
    ],
  },
};

// API functions
export const getScore = async (): Promise<ScoreSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockScoreSummary;
};

export const getActions = async (): Promise<ActionCard[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockActions;
};

export const sendAssistantMessage = async (
  messages: AssistantMessage[]
): Promise<AssistantResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const userMessage = messages[messages.length - 1]?.text || "";
  
  return {
    answer: `Based on your current wellness score of 68 and buffer of 28 days, here's my recommendation: ${
      userMessage.toLowerCase().includes("buffer")
        ? "To reach your 45-day buffer target, focus on three areas: (1) Set up automated reminders for the 5 invoices that are 7-14 days past due—this alone could add 6-10 buffer days. (2) Consider opening a Reserve account and sweeping 4.2% of weekly inflows, adding another 8-12 days. (3) Review your payables schedule and shift 2 vendor payments by 7 days within terms for an additional 4-6 days. These actions combined could get you to your target within 30-45 days."
        : userMessage.toLowerCase().includes("dso")
        ? "Your Days Sales Outstanding (DSO) increased by 7 days recently. This is affecting your receivables health score (currently 58). The primary drivers are: 3 invoices over 60 days past due and slower payment velocity from 2 major customers. I recommend setting up automated payment reminders and potentially offering early payment incentives for these accounts."
        : "I can help you improve your cash position. Your wellness score of 68 shows room for improvement, especially in receivables (58) and concentration (63). Would you like specific recommendations for improving buffer days, reducing DSO, or managing seasonal volatility?"
    }`,
    sources: [
      { title: "Your transaction history (last 90 days)" },
      { title: "Industry benchmark data", url: "#" },
      { title: "PNC Cash Flow Best Practices", url: "#" },
    ],
    complianceBrief: {
      risks: [
        "Automated reminders may increase customer friction if overused",
        "Payment term changes require careful communication",
      ],
      mitigations: [
        "Limit reminders to 1 per week per customer",
        "Provide advance notice for any payment schedule changes",
        "Monitor customer satisfaction metrics",
      ],
      policyLinks: [
        "PNC Fair Collection Practices Policy",
        "Automated Communication Guidelines",
        "Customer Relationship Protection Standards",
      ],
    },
    nutritionLabelRef: {
      ...mockNutritionLabel,
      featureId: "assistant",
      purpose: "Provide personalized cash management coaching with compliance guidance",
    },
  };
};

export const runSandbox = async (input: SandboxInput): Promise<SandboxResult> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const baseBuffer = 28;
  const baseRunway = 52;
  
  let bufferDelta = 0;
  if (input.dsoDeltaDays) bufferDelta += input.dsoDeltaDays * -0.8;
  if (input.shiftPayablesDays) bufferDelta += input.shiftPayablesDays * 0.5;
  if (input.priceChangePct) bufferDelta += input.priceChangePct * 1.2;
  if (input.reserveSweepPct) bufferDelta += input.reserveSweepPct * 0.9;
  
  const projectedBuffer = Math.round(baseBuffer + bufferDelta);
  const projectedRunway = Math.round(baseRunway + bufferDelta * 1.3);
  
  const warnings: string[] = [];
  if (input.dsoDeltaDays && input.dsoDeltaDays > 5) {
    warnings.push("Significant DSO increase may stress customer relationships");
  }
  if (input.priceChangePct && input.priceChangePct > 5) {
    warnings.push("Price increases above 5% may impact demand");
  }
  
  return {
    projectedBufferDays: projectedBuffer,
    runwayDays: projectedRunway,
    kpis: [
      {
        label: "Projected Buffer",
        value: `${projectedBuffer} days`,
        delta: bufferDelta > 0 ? `+${Math.round(bufferDelta)}` : `${Math.round(bufferDelta)}`,
      },
      {
        label: "Cash Runway",
        value: `${projectedRunway} days`,
        delta: bufferDelta > 0 ? `+${Math.round(bufferDelta * 1.3)}` : `${Math.round(bufferDelta * 1.3)}`,
      },
      {
        label: "Projected Score",
        value: `${Math.min(100, 68 + Math.round(bufferDelta / 2))}`,
        delta: bufferDelta > 0 ? `+${Math.round(bufferDelta / 2)}` : `${Math.round(bufferDelta / 2)}`,
      },
    ],
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

export const getConsent = async (): Promise<Array<{ source: string; enabled: boolean }>> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [
    { source: "transactions", enabled: true },
    { source: "invoices", enabled: true },
    { source: "bills", enabled: true },
    { source: "balances", enabled: true },
  ];
};

export const updateConsent = async (
  source: string,
  enabled: boolean
): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`Consent updated: ${source} = ${enabled}`);
  return { success: true };
};
