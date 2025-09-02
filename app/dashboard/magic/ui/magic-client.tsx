"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { generateMagicNarrative, simulateWhatIf, askFinancialCopilot, type WhatIfResult } from "@/services/actions/ai-magic";

function Money({ n }: { n: number }) {
    try {
        return <>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)}</>;
    } catch {
        return <>${n.toFixed(2)}</>;
    }
}

export default function MagicClient() {
    const [loading, setLoading] = useState(false);
    const [narrative, setNarrative] = useState<Awaited<ReturnType<typeof generateMagicNarrative>> | null>(null);
    const [whatIf, setWhatIf] = useState<WhatIfResult | null>(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string>("");

    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const data = await generateMagicNarrative();
                if (isMounted) setNarrative(data);
            } catch {
                toast.error("Unable to load magic right now");
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const [dining, setDining] = useState(10);
    const [shopping, setShopping] = useState(10);
    const [subs, setSubs] = useState(10);
    const [income, setIncome] = useState(5);

    const runWhatIf = async () => {
        setLoading(true);
        try {
            const res = await simulateWhatIf({
                diningReductionPct: dining,
                shoppingReductionPct: shopping,
                subscriptionsReductionPct: subs,
                incomeBoostPct: income,
            });
            setWhatIf(res);
            toast.success("Scenario modeled");
        } catch {
            toast.error("Couldn't simulate scenario");
        } finally {
            setLoading(false);
        }
    };

    const ask = async () => {
        if (!question.trim()) return toast.message("Ask something specific");
        setLoading(true);
        try {
            const res = await askFinancialCopilot(question);
            setAnswer(res);
        } catch {
            toast.error("AI couldn't answer right now");
        } finally {
            setLoading(false);
        }
    };

    const KeyStat = ({ label, value, delta }: { label: string; value: string; delta?: string }) => (
        <div className="rounded-lg bg-[#0b1220] text-white p-4 border border-white/10">
            <div className="text-sm text-white/70">{label}</div>
            <div className="text-xl font-semibold mt-1">{value}</div>
            {delta && <div className="text-xs text-emerald-400 mt-1">{delta}</div>}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#01162c] flex items-center justify-center text-white">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">Unicent Magic</h1>
                    <p className="text-muted-foreground">A cinematic, interactive view of your money — powered by AI.</p>
                </div>
            </div>

            <Tabs defaultValue="narrative" className="w-full">
                <TabsList>
                    <TabsTrigger value="narrative">Narrative</TabsTrigger>
                    <TabsTrigger value="whatif">What‑If</TabsTrigger>
                    <TabsTrigger value="copilot">Ask Copilot</TabsTrigger>
                </TabsList>

                <TabsContent value="narrative" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-[#01162c]" /> {narrative?.title || "Your story"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loading && !narrative ? (
                                <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading magic…</div>
                            ) : narrative ? (
                                <>
                                    <div className="text-muted-foreground">{narrative.subtitle}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {narrative.keyStats.map((k) => (
                                            <KeyStat key={k.label} label={k.label} value={k.value} delta={k.delta} />
                                        ))}
                                    </div>
                                    <Separator />
                                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">{narrative.story}</div>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {narrative.highlights.map((h, i) => (
                                            <div key={i} className="rounded-md border p-3 text-sm bg-white">• {h}</div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-muted-foreground">No data yet.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="whatif" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>What‑If Simulator</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Dining −%</label>
                                    <Input type="number" min={0} max={100} value={dining} onChange={(e) => setDining(parseFloat(e.target.value || "0"))} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Shopping −%</label>
                                    <Input type="number" min={0} max={100} value={shopping} onChange={(e) => setShopping(parseFloat(e.target.value || "0"))} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Subscriptions −%</label>
                                    <Input type="number" min={0} max={100} value={subs} onChange={(e) => setSubs(parseFloat(e.target.value || "0"))} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Income +%</label>
                                    <Input type="number" min={0} max={100} value={income} onChange={(e) => setIncome(parseFloat(e.target.value || "0"))} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={runWhatIf} disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Simulate
                                </Button>
                            </div>

                            {whatIf && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="rounded-lg border p-4">
                                        <div className="font-medium mb-2">Baseline</div>
                                        <div className="text-sm text-muted-foreground">Income: <Money n={whatIf.baseline.income} /> · Expenses: <Money n={whatIf.baseline.expenses} /> · Savings: {whatIf.baseline.savingsRate}%</div>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="font-medium mb-2">Scenario</div>
                                        <div className="text-sm text-muted-foreground">Income: <Money n={whatIf.scenario.income} /> · Expenses: <Money n={whatIf.scenario.expenses} /> · Savings: {whatIf.scenario.savingsRate}%</div>
                                    </div>
                                    <div className="md:col-span-2 rounded-lg border p-4">
                                        <div className="font-medium mb-2">Category impact</div>
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {whatIf.breakdownDeltas.map((d) => (
                                                <div key={d.category} className="rounded-md bg-white p-3 border">
                                                    <div className="text-sm font-medium">{d.category}</div>
                                                    <div className="text-xs text-muted-foreground">Before <Money n={d.before} /> → After <Money n={d.after} /></div>
                                                    <div className="text-xs text-emerald-600 mt-1">Save <Money n={d.savings} /></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 rounded-lg border p-4">
                                        <div className="text-sm whitespace-pre-wrap">{whatIf.explanation}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="copilot" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ask Unicent Copilot</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <Input placeholder="e.g. How can I free $200 this month?" value={question} onChange={(e) => setQuestion(e.target.value)} />
                                <Button onClick={ask} disabled={loading}>Ask</Button>
                            </div>
                            {answer && (
                                <div className="rounded-lg border p-4 bg-white text-sm whitespace-pre-wrap">{answer}</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
