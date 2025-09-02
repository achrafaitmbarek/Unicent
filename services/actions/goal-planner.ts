"use server";

import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMonthlyFinancialSummary } from "./financial-report";
import { FinancialGoal } from "@prisma/client";

export type GoalPlan = {
  goalId: string;
  goalName: string;
  suggestedMonthly: number;
  projectedCompletionDate: string; // ISO
  priority: "HIGH" | "MEDIUM" | "LOW";
  rationale: string;
};

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function monthYearDefault(): { month: number; year: number } {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const month = currentMonth === 1 ? 12 : currentMonth - 1; // use previous month for stable summary
  const year = currentMonth === 1 ? currentYear - 1 : currentYear;
  return { month, year };
}

export async function getAIPlansForGoals(): Promise<{ plans: GoalPlan[]; freeCash: number }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Authentication required");

  // Load user goals
  const goals = await prisma.financialGoal.findMany({ where: { userId: session.user.id } });
  if (goals.length === 0) return { plans: [], freeCash: 0 };

  // Get last month's summary as baseline for available monthly cash
  const { month, year } = monthYearDefault();
  const summary = await getMonthlyFinancialSummary(month, year);
  const freeCash = Math.max(0, summary.totalIncome - summary.totalExpenses);

  // Create prompt context
  const now = new Date();
  const goalsBlock = goals
    .map((g) => {
      const remaining = Math.max(0, g.amount);
      const target = new Date(g.targetDate).toISOString().split("T")[0];
      return `{"id":"${g.id}","name":"${g.name}","category":"${g.category}","remainingAmount":${remaining},"targetDate":"${target}"}`;
    })
    .join(",\n");

  const prompt = `You are an expert financial coach. The user has $${freeCash.toFixed(
    2
  )} of monthly free cash to allocate to goals.
Goals JSON array (each object per line):
[
${goalsBlock}
]

For each goal, produce an optimized monthly contribution that fits within the total $${freeCash.toFixed(
    2
  )} and aims to hit or improve the target date.
Return a JSON array with exactly these keys per item: id, suggestedMonthly, projectedCompletionDate (ISO YYYY-MM-DD), priority (HIGH|MEDIUM|LOW), rationale.
Notes:
- Be realistic: do not allocate more than total free cash across goals.
- Use HIGH for urgent or short-deadline goals, MEDIUM for moderate, LOW for flexible.
- If free cash is insufficient, still proportionally allocate and explain the trade-off in rationale.`;

  // Default fallback proportional allocation
  function fallbackPlan(gs: FinancialGoal[]): GoalPlan[] {
    // Weight by urgency: months until target (sooner -> higher weight)
    const weights = gs.map((g) => {
      const months = Math.max(1, Math.ceil((new Date(g.targetDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      return { id: g.id, name: g.name, weight: 1 / months };
    });
    const sumW = weights.reduce((s, w) => s + w.weight, 0) || 1;
    return weights.map((w) => ({
      goalId: w.id,
      goalName: w.name,
      suggestedMonthly: parseFloat(((freeCash * (w.weight / sumW)) || 0).toFixed(2)),
      projectedCompletionDate: new Date(now.getFullYear(), now.getMonth() + 12, now.getDate()).toISOString(),
      priority: w.weight > (sumW / weights.length) ? "HIGH" : "MEDIUM",
      rationale: "Proportional allocation by urgency (closer deadlines get more).",
    }));
  }

  try {
    const resp = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1200,
      temperature: 0.4,
      system: "You output concise, valid JSON only.",
      messages: [{ role: "user", content: prompt }],
    });
    if ("text" in resp.content[0]) {
      const text = resp.content[0].text;
      const jsonMatch = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      if (jsonMatch) {
        // Map AI response to plans, enforce budget cap approximately
        type Item = { id: string; suggestedMonthly: number; projectedCompletionDate: string; priority: "HIGH"|"MEDIUM"|"LOW"; rationale: string };
        const items: Item[] = JSON.parse(jsonMatch[0]);
        const nameMap = new Map(goals.map(g => [g.id, g.name] as const));
        let total = 0;
        const plans: GoalPlan[] = items.map((it) => {
          const amt = Math.max(0, Number(it.suggestedMonthly || 0));
          total += amt;
          return {
            goalId: it.id,
            goalName: nameMap.get(it.id) || "Goal",
            suggestedMonthly: parseFloat(amt.toFixed(2)),
            projectedCompletionDate: new Date(it.projectedCompletionDate || now).toISOString(),
            priority: (it.priority || "MEDIUM") as GoalPlan["priority"],
            rationale: it.rationale || "",
          };
        });
        if (total > freeCash && total > 0) {
          const factor = freeCash / total;
          plans.forEach((p) => (p.suggestedMonthly = parseFloat((p.suggestedMonthly * factor).toFixed(2))));
        }
        return { plans, freeCash };
      }
    }
    return { plans: fallbackPlan(goals), freeCash };
  } catch (e) {
    console.error("AI goal planning failed:", e);
    return { plans: fallbackPlan(goals), freeCash };
  }
}
