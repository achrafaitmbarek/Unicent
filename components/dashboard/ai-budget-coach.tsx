'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { getAIPlansForGoals } from '@/services/actions/goal-planner';
import type { GoalPlan } from '@/services/actions/goal-planner';

type Props = {
    potentialSavings: number; // numeric amount for the selected month
};

export function AIBudgetCoach({ potentialSavings }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState<{ plans: GoalPlan[]; freeCash: number } | null>(null);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const res = await getAIPlansForGoals();
            setPlans(res);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    // Scale suggestedMonthly to not exceed available monthly savings (UI-level cap)
    function scaledPlans() {
        if (!plans) return [] as (GoalPlan & { displayMonthly: number })[];
        const totalSuggested = plans.plans.reduce((s, p) => s + (p.suggestedMonthly || 0), 0);
        const cap = Math.max(0, Math.min(plans.freeCash || 0, potentialSavings || 0));
        const factor = totalSuggested > 0 ? Math.min(1, cap / totalSuggested) : 0;
        return plans.plans.map((p) => ({ ...p, displayMonthly: parseFloat(((p.suggestedMonthly || 0) * factor).toFixed(2)) }));
    }

    const formattedPotential = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(potentialSavings || 0);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-primary">AI Budget Coach</h2>
                    <p className="text-sm text-gray-500">Potential monthly savings available: {formattedPotential}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setOpen(true)}>Allocate to Goals</Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Allocate Savings to Goals</DialogTitle>
                        <DialogDescription>
                            We&apos;ll generate an allocation plan across your goals. This uses your free cash and caps amounts by your potential savings for this month.
                        </DialogDescription>
                    </DialogHeader>

                    {!plans && !loading && (
                        <div className="flex justify-end">
                            <Button onClick={loadPlans}>Generate Plan</Button>
                        </div>
                    )}

                    {loading && <div className="text-sm text-gray-500">Generating plan…</div>}

                    {!loading && plans && (
                        <div className="space-y-3">
                            <div className="text-xs text-muted-foreground">
                                Free cash basis: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plans.freeCash || 0)} · UI cap by potential savings: {formattedPotential}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {scaledPlans().map((p) => (
                                    <div key={p.goalId} className="rounded-lg border p-4">
                                        <div className="text-xs text-muted-foreground mb-1">{p.priority} priority</div>
                                        <div className="font-semibold mb-1">{p.goalName}</div>
                                        <div className="text-sm">Allocating: <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.displayMonthly || 0)}</span></div>
                                        <div className="text-xs text-muted-foreground">Projected completion: {new Date(p.projectedCompletionDate).toLocaleDateString()}</div>
                                        {p.rationale && <div className="text-xs mt-2 text-[#475569]">{p.rationale}</div>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setOpen(false)}>Done</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
