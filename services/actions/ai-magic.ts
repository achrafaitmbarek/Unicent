"use server";

import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { getFinancialReportData } from "./financial-report";

export type MagicNarrative = {
  title: string;
  subtitle: string;
  keyStats: { label: string; value: string; delta?: string }[];
  story: string;
  highlights: string[];
};

export type WhatIfInput = {
  diningReductionPct?: number; // 0-100
  shoppingReductionPct?: number; // 0-100
  subscriptionsReductionPct?: number; // 0-100
  incomeBoostPct?: number; // 0-100
  month?: number;
  year?: number;
};

export type WhatIfResult = {
  baseline: { income: number; expenses: number; savingsRate: number };
  scenario: { income: number; expenses: number; savingsRate: number };
  breakdownDeltas: { category: string; before: number; after: number; savings: number }[];
  explanation: string;
};

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Utility
function currency(n: number) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function monthYearDefault(): { month: number; year: number } {
  const today = new Date();
  // default to previous month for stable history
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const month = currentMonth === 1 ? 12 : currentMonth - 1;
  const year = currentMonth === 1 ? currentYear - 1 : currentYear;
  return { month, year };
}

export async function generateMagicNarrative(month?: number, year?: number): Promise<MagicNarrative> {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Authentication required");

  const target = month && year ? { month, year } : monthYearDefault();
  const report = await getFinancialReportData(target.month, target.year);

  const summaryBlock = `Income: ${currency(report.totalIncome)}\nExpenses: ${currency(report.totalExpenses)}\nSavings rate: ${report.savingsRate.toFixed(1)}%`;
  const breakdownLines = report.spendingBreakdown
    .slice(0, 6)
    .map((c) => `${c.name}: ${currency(c.amount)} (${c.percentage}%)`) // top categories
    .join("\n");

  const prompt = `Craft a short, cinematic financial story for the user based on the data below. Use vivid, encouraging language, but stay factual. Start with a punchy one‑liner, then a 3-5 sentence narrative, and end with 3 ultra-specific wins as bullets (<=12 words each).\n\nMONTH: ${report.monthName} ${report.year}\n${summaryBlock}\n\nTop categories:\n${breakdownLines}`;

  let storyText = "";
  try {
    const resp = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 700,
      temperature: 0.7,
      system: "You're a world-class financial storyteller. Be concise, concrete, and motivational without fluff.",
      messages: [{ role: "user", content: prompt }],
    });
    if ("text" in resp.content[0]) storyText = resp.content[0].text.trim();
  } catch {
    storyText = `You're building momentum. With disciplined spending and smarter choices, your money is quietly working harder each month. Keep focus on 1–2 categories and make tiny, repeatable wins.`;
  }

  const keyStats = [
    { label: "Income", value: currency(report.totalIncome) },
    { label: "Expenses", value: currency(report.totalExpenses) },
    { label: "Savings rate", value: `${report.savingsRate.toFixed(1)}%` },
  ];

  // Extract bullet wins if present, else generate minimal highlights from breakdown
  const highlights: string[] = [];
  const bulletMatches = storyText.match(/^[\-*•]\s*(.+)$/gim) || [];
  if (bulletMatches.length) {
    bulletMatches.slice(0, 3).forEach((b) => highlights.push(b.replace(/^[\-*•]\s*/, "").trim()))
  } else {
    report.spendingBreakdown
      .slice(0, 3)
      .forEach((c) => highlights.push(`${c.name}: target −${Math.max(5, Math.min(20, Math.round(c.percentage / 2)))}% next month`));
  }

  return {
    title: `Your ${report.monthName} story`,
    subtitle: `Personalized by Unicent Magic`,
    keyStats,
    story: storyText,
    highlights,
  };
}

export async function simulateWhatIf(input: WhatIfInput): Promise<WhatIfResult> {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Authentication required");

  const { month, year } = input.month && input.year ? { month: input.month, year: input.year } : monthYearDefault();
  const report = await getFinancialReportData(month, year);

  const diningCut = Math.max(0, Math.min(100, input.diningReductionPct ?? 0)) / 100;
  const shoppingCut = Math.max(0, Math.min(100, input.shoppingReductionPct ?? 0)) / 100;
  const subsCut = Math.max(0, Math.min(100, input.subscriptionsReductionPct ?? 0)) / 100;
  const incomeBoost = Math.max(0, Math.min(100, input.incomeBoostPct ?? 0)) / 100;

  const baselineIncome = report.totalIncome;
  const baselineExpenses = report.totalExpenses;
  const baselineSavingsRate = baselineIncome > 0 ? ((baselineIncome - baselineExpenses) / baselineIncome) * 100 : -100;

  // Map reductions to categories by friendly name
  const lower = (s: string) => s.toLowerCase();
  const categoryAdjustments: Record<string, number> = {};
  for (const c of report.spendingBreakdown) {
    const name = lower(c.name);
    if (name.includes("dining")) categoryAdjustments[c.name] = diningCut;
    else if (name.includes("shopping")) categoryAdjustments[c.name] = shoppingCut;
    else if (name.includes("subscription")) categoryAdjustments[c.name] = subsCut;
    else categoryAdjustments[c.name] = 0;
  }

  const breakdownDeltas = report.spendingBreakdown.map((c) => {
    const cut = categoryAdjustments[c.name] || 0;
    const after = Math.max(0, c.amount * (1 - cut));
    return { category: c.name, before: c.amount, after, savings: c.amount - after };
  });

  const afterExpenses = breakdownDeltas.reduce((sum, d) => sum + d.after, 0);
  const afterIncome = baselineIncome * (1 + incomeBoost);
  const afterSavingsRate = afterIncome > 0 ? ((afterIncome - afterExpenses) / afterIncome) * 100 : -100;

  // Ask AI for an explanation paragraph
  const analysisPrompt = `Baseline: income ${currency(baselineIncome)}, expenses ${currency(baselineExpenses)}, savings rate ${baselineSavingsRate.toFixed(1)}%.\n\nScenario: income ${currency(afterIncome)}, expenses ${currency(afterExpenses)}, savings rate ${afterSavingsRate.toFixed(1)}%.\n\nTop deltas:\n${breakdownDeltas
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 3)
    .map((d) => `- ${d.category}: save ${currency(d.savings)}`)
    .join("\n")}\n\nExplain the impact in 2-3 upbeat sentences, ending with one punchy imperative.`;

  let explanation = "";
  try {
    const resp = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      temperature: 0.6,
      system: "You're a concise, practical financial coach.",
      messages: [{ role: "user", content: analysisPrompt }],
    });
    if ("text" in resp.content[0]) explanation = resp.content[0].text.trim();
  } catch {
    explanation = "Small, focused tweaks unlock real momentum. Lock your gains this month.";
  }

  return {
    baseline: { income: baselineIncome, expenses: baselineExpenses, savingsRate: parseFloat(baselineSavingsRate.toFixed(2)) },
    scenario: { income: afterIncome, expenses: afterExpenses, savingsRate: parseFloat(afterSavingsRate.toFixed(2)) },
    breakdownDeltas,
    explanation,
  };
}

export async function askFinancialCopilot(question: string, month?: number, year?: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Authentication required");
  if (!question || question.trim().length < 3) throw new Error("Ask a more specific question");

  const target = month && year ? { month, year } : monthYearDefault();
  const report = await getFinancialReportData(target.month, target.year);

  const context = `Income ${currency(report.totalIncome)}, Expenses ${currency(report.totalExpenses)}, Savings rate ${report.savingsRate.toFixed(1)}%. Top categories: ${report.spendingBreakdown
    .slice(0, 5)
    .map((c) => `${c.name} ${currency(c.amount)} (${c.percentage}%)`)
    .join("; ")}`;

  const resp = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 600,
    temperature: 0.5,
    system:
      "You're Unicent Copilot: precise, friendly, and actionable. Use the user's context if relevant and keep answers under 180 words with concrete steps.",
    messages: [
      {
        role: "user",
        content: `User context: ${context}\n\nQuestion: ${question}\n\nAnswer:`,
      },
    ],
  });

  if ("text" in resp.content[0]) return resp.content[0].text.trim();
  return "I couldn't generate a response right now. Please try again.";
}
