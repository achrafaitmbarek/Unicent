"use client"

import { useMemo, useState } from "react"
import { FinancialReportModal } from "@/components/dashboard/financial-report-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FinancialReportData } from "@/services/actions/financial-report"

type Props = { reports: FinancialReportData[] }

export default function ReportsClient({ reports }: Props) {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<FinancialReportData | undefined>()

    const grouped = useMemo(() => {
        const m = new Map<number, FinancialReportData[]>()
        for (const r of reports) {
            const arr = m.get(r.year) || []
            arr.push(r)
            m.set(r.year, arr)
        }
        // sort by month desc within year; years desc
        const entries = Array.from(m.entries()).sort((a, b) => b[0] - a[0])
        for (const [, arr] of entries) arr.sort((a, b) => b.month - a.month)
        return entries
    }, [reports])

    const openReport = (r: FinancialReportData) => {
        setActive(r)
        setOpen(true)
    }

    return (
        <div className="space-y-8">
            {grouped.map(([year, arr]) => (
                <section key={year} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{year}</h2>
                        <Badge variant="outline">{arr.length} reports</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {arr.map((r) => (
                            <Card key={r.id} className="hover:shadow-sm transition border-[#e9ebf2]">
                                <CardContent className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-muted-foreground">{r.monthName}</div>
                                            <div className="text-base font-semibold text-[#01254b]">{r.title || `Report ${r.month}/${r.year}`}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm ${r.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>{r.savingsRate.toFixed(1)}%</div>
                                            <div className="text-xs text-muted-foreground">Savings rate</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <div className="text-muted-foreground">Income</div>
                                            <div className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(r.totalIncome)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-muted-foreground">Expenses</div>
                                            <div className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(r.totalExpenses))}</div>
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={() => openReport(r)}>Open report</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            ))}

            <FinancialReportModal open={open} onOpenChange={setOpen} financialData={active} />
        </div>
    )
}
