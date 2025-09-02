import { DeleteAccountModal } from "@/components/dashboard/delete-account-modal"
import Image from "next/image"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import avatar from "@/assets/avatars/Erick.png"
import { EditableUserName } from "@/components/dashboard/editable-name"
import { InsightTypeSelector } from "@/components/dashboard/insight-type-selector"
import { ReportTypeSelector } from "@/components/dashboard/report-type-selector"
import { Sparkles, Mail, CalendarDays, Crown, BarChart3, Activity, Wand2, Banknote, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { getUserFinancialTips } from "@/services/actions/financial-tips"
import { TipType } from "@prisma/client"

export default async function Profile() {
    const session = await auth()

    if (!session?.user?.email) {
        return <div>Not authenticated</div>
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        return <div>User not found</div>
    }

    // Stats and quick data
    const [connectionsCount, accountsAgg, maxSync, unusualCount] = await Promise.all([
        prisma.bankConnection.count({ where: { userId: user.id } }),
        prisma.bankAccount.aggregate({
            _sum: { balance: true },
            where: { connection: { userId: user.id } },
        }),
        prisma.bankAccount.aggregate({ _max: { lastSyncedTransactionDate: true }, where: { connection: { userId: user.id } } }),
        // Unusual in current month
        (async () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return prisma.transaction.count({
                where: {
                    account: { connection: { userId: user.id } },
                    isUnusual: true,
                    date: { gte: start },
                },
            })
        })(),
    ])

    const totalBalance = accountsAgg._sum.balance ?? 0
    const tips = await getUserFinancialTips(TipType.DAILY_INSIGHT)

    function fmt(n: number) {
        try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) } catch { return `$${n.toFixed(0)}` }
    }

    return (
        <div className="container max-w-6xl">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl border border-[#e9ebf2] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 mb-8">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full ring-4 ring-white/80 overflow-hidden shadow-sm">
                            <Image src={avatar} alt={user.name || "User"} width={96} height={96} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#01254b] dark:text-white truncate">{user.name || "User"}</h1>
                                {user.isPremium ? (
                                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-300 text-white gap-1">
                                        <Crown className="h-3.5 w-3.5" /> Premium
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[#8f939f] border-amber-200 bg-amber-50">Free plan</Badge>
                                )}
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-sm text-[#8f939f] flex-wrap">
                                <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="ml-auto hidden sm:flex items-center gap-3">
                            <Link href="/dashboard/reports">
                                <Button variant="outline" className="gap-2">
                                    <BarChart3 className="h-4 w-4" /> All Reports
                                </Button>
                            </Link>
                            {!user.isPremium ? (
                                <Button className="bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-600 hover:to-amber-400 text-white px-6 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> Upgrade Plan
                                </Button>
                            ) : (
                                <div className="bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-md text-sm">Premium benefits active</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Total Balance</div>
                            <div className="text-xl font-semibold">
                                <span className="inline-block blur-sm hover:blur-none transition duration-200 cursor-default select-none">
                                    {fmt(totalBalance)}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 rounded-md bg-emerald-50 text-emerald-700"><Banknote className="h-5 w-5" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Connections</div>
                            <div className="text-xl font-semibold">{connectionsCount}</div>
                        </div>
                        <div className="p-2 rounded-md bg-blue-50 text-blue-700"><LayoutDashboard className="h-5 w-5" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Unusual this month</div>
                            <div className="text-xl font-semibold">{unusualCount}</div>
                        </div>
                        <div className="p-2 rounded-md bg-amber-50 text-amber-700"><Activity className="h-5 w-5" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Last sync</div>
                            <div className="text-xl font-semibold">
                                {maxSync._max.lastSyncedTransactionDate ? new Date(maxSync._max.lastSyncedTransactionDate).toLocaleDateString() : '—'}
                            </div>
                        </div>
                        <div className="p-2 rounded-md bg-indigo-50 text-indigo-700"><BarChart3 className="h-5 w-5" /></div>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Personal Info */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-4">
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your basic information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm text-[#8f939f] mb-1">Full Name</label>
                                <EditableUserName initialName={user.name || ""} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-[#8f939f] mb-1">Email</label>
                                    <div className="text-base">{user.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8f939f] mb-1">Member Since</label>
                                    <div className="text-base">{new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: AI Settings */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>AI Settings</CardTitle>
                                <CardDescription>Customize your insights and reports</CardDescription>
                            </div>
                            {user.isPremium && (
                                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> Premium
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium mb-3">Preferred Insight Types</label>
                                <InsightTypeSelector initialInsightTypes={user.preferredInsightTypes} isPremium={user.isPremium} />
                            </div>
                            <Separator />
                            <div>
                                <label className="block text-sm font-medium mb-3">Report Type</label>
                                <ReportTypeSelector initialReportTypes={user.reportTypes} isPremium={user.isPremium} />
                            </div>
                            <div className="rounded-lg border bg-muted/20 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground">History</div>
                                        <div className="font-medium">Browse all your past reports</div>
                                    </div>
                                    <Link href="/dashboard/reports">
                                        <Button variant="secondary" size="sm" className="gap-2"><BarChart3 className="h-4 w-4" /> View</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Copilot tip + Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5 text-[#01162c]" /> Copilot Tips</CardTitle>
                        <CardDescription>Personalized, quick wins to try this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tips && tips.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {tips.slice(0, 2).map((t, i) => (
                                    <div key={i} className="rounded-lg border p-4 bg-white">
                                        <div className="text-sm text-muted-foreground mb-1">{t.title}</div>
                                        <div className="text-sm">{t.description}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">No tips yet.</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Jump to popular tools</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Link href="/dashboard/magic"><Button className="w-full justify-start gap-2"><Wand2 className="h-4 w-4" /> Open Magic</Button></Link>
                        <Link href="/dashboard/ai-insights/financial-watch"><Button variant="outline" className="w-full justify-start gap-2"><Activity className="h-4 w-4" /> Financial Watch</Button></Link>
                        <Link href="/dashboard/reports"><Button variant="secondary" className="w-full justify-start gap-2"><BarChart3 className="h-4 w-4" /> Reports</Button></Link>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile upgrade/premium state */}
            <div className="sm:hidden mt-6 space-y-3">
                <Link href="/dashboard/reports">
                    <Button variant="outline" className="w-full gap-2"><BarChart3 className="h-4 w-4" /> All Reports</Button>
                </Link>
                {!user.isPremium ? (
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-600 hover:to-amber-400 text-white">
                        <Sparkles className="h-4 w-4 mr-2" /> Upgrade Plan
                    </Button>
                ) : (
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-md text-sm text-center">Premium benefits active</div>
                )}
            </div>

            {/* Danger zone: Delete Account */}
            <DeleteAccountModal />
        </div>
    );
}