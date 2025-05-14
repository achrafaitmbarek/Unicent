import Image from "next/image"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import avatar from "@/assets/avatars/Erick.png"
import { EditableUserName } from "@/components/dashboard/editable-name"
import { InsightTypeSelector } from "@/components/dashboard/insight-type-selector"
import { ReportTypeSelector } from "@/components/dashboard/report-type-selector"
import { Sparkles } from "lucide-react"

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

    return (
        <div className="container">
            <h1 className="text-2xl font-bold text-[#01254b] mb-6">My profile</h1>

            <div className="flex items-center gap-6 mb-10 bg-white p-6 rounded-lg border border-[#e9ebf2]">
                <div className="h-24 w-24 rounded-full overflow-hidden">
                    <Image src={avatar} alt={user.name || "User"} width={96} height={96} className="h-full w-full object-cover" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-1">{user.name || "User"}</h2>
                    {user.isPremium ? (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-600 hover:to-amber-400 text-white mb-1 px-3">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Premium User
                        </Badge>
                    ) : (
                        <div className="text-sm text-[#8f939f] mb-1">
                            Free plan
                        </div>
                    )}
                    <div className="text-base text-[#8f939f]">Welcome Back!</div>
                </div>

                {!user.isPremium && (
                    <div className="ml-auto">
                        <Button className="bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-600 hover:to-amber-400 text-white px-6 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Upgrade Plan
                        </Button>
                    </div>
                )}

                {user.isPremium && (
                    <div className="ml-auto">
                        <div className="bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-md text-sm">
                            Premium benefits active
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-[#e9ebf2] p-6">
                    <h3 className="text-lg font-semibold mb-6">Personal Information</h3>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm text-[#8f939f] mb-1">Full Name</label>
                            <EditableUserName initialName={user.name || ""} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-sm text-[#8f939f] mb-1">Email</label>
                                <div className="text-base">{user.email}</div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm text-[#8f939f] mb-1">Member Since</label>
                                <div className="text-base">{new Date(user.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-[#e9ebf2] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">AI Settings</h3>
                        {user.isPremium && (
                            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                Premium Features
                            </Badge>
                        )}
                    </div>

                    <div className="mb-6">
                        <p className="text-[#8f939f]">Customize your AI insights and notifications</p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium mb-3">Preferred Insight Types</label>
                            <InsightTypeSelector
                                initialInsightTypes={user.preferredInsightTypes}
                                isPremium={user.isPremium}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Report Type</label>
                            <ReportTypeSelector
                                initialReportTypes={user.reportTypes}
                                isPremium={user.isPremium}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}