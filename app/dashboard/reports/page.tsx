import { listUserFinancialReports } from "@/services/actions/financial-report"
import { Suspense } from "react"
import ReportsClient from "@/app/dashboard/reports/reports-client"

export const dynamic = "force-dynamic"

export default async function ReportsPage() {
    const reports = await listUserFinancialReports()
    return (
        <div className="container py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#01254b]">Financial Reports</h1>
                <p className="text-sm text-muted-foreground">Browse all your generated reports and open details in a modal.</p>
            </div>
            <Suspense>
                <ReportsClient reports={reports} />
            </Suspense>
        </div>
    )
}
