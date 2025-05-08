import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FinancialPlanningLoading() {
    return (
        <div className="container">
            {/* Header with title and button */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-primary">Create Budget & Goals</h1>
                <Button className="bg-primary hover:bg-primary/90" disabled>
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Set New Target</span>
                </Button>
            </div>

            {/* Goals Summary section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-primary">Goals Summary</h2>
                    <div className="text-sm text-gray-500">Loading goals...</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl border p-4 animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center"></div>
                                    <div className="h-5 w-28 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                            </div>
                            <div className="my-4">
                                <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
                                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                            </div>
                            <div className="mt-4">
                                <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                                <div className="flex justify-between items-center mt-1.5">
                                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Goals History table */}
            <div className="bg-white rounded-xl shadow-sm p-3 mb-6">
                <h2 className="text-xl font-medium text-[#01162c] p-6">Goals History</h2>

                <div className="overflow-x-auto p-4">
                    <div className="rounded-xl overflow-hidden">
                        <div className="border-b">
                            <div className="border-none bg-[#f6fafd] grid grid-cols-6 gap-4 px-4 py-3">
                                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                <div className="h-5 w-full bg-gray-200 rounded"></div>
                                <div className="h-5 w-full bg-gray-200 rounded"></div>
                                <div className="h-5 w-full bg-gray-200 rounded"></div>
                                <div className="h-5 w-full bg-gray-200 rounded"></div>
                                <div className="h-5 w-full bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="animate-pulse">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="grid grid-cols-6 gap-4 px-4 py-4 border-b">
                                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                    <div className="h-5 w-full bg-gray-200 rounded"></div>
                                    <div className="h-5 w-full bg-gray-200 rounded"></div>
                                    <div className="h-5 w-full bg-gray-200 rounded"></div>
                                    <div className="h-5 w-full bg-gray-200 rounded"></div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Tips section */}
            <div className="mx-auto p-4 rounded-lg">
                <h1 className="text-2xl font-bold mb-6">AI Tips for Goal Achievement</h1>

                <div className="space-y-4 animate-pulse">
                    {/* First two tips */}
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className={`flex items-center justify-between p-4 bg-white rounded-lg mb-4 ${i % 2 === 1 ? 'border border-gray-100' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-lg bg-purple-100"></div>
                                <div className="space-y-2">
                                    <div className="h-5 w-48 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-72 bg-gray-100 rounded"></div>
                                    <div className="h-4 w-64 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        </div>
                    ))}

                    {/* Locked tips */}
                    {[1, 2].map((i) => (
                        <div
                            key={`locked-${i}`}
                            className={`flex items-center justify-between p-4 bg-white rounded-lg mb-4 ${i % 2 === 0 ? 'border border-gray-100' : ''} relative overflow-hidden`}
                        >
                            <div className="flex items-center gap-4 filter blur-sm">
                                <div className="h-14 w-14 rounded-lg bg-purple-100"></div>
                                <div className="space-y-2">
                                    <div className="h-5 w-48 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-72 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                            <div className="h-5 w-5 bg-gray-200 rounded filter blur-sm"></div>
                            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                <div className="h-8 w-8 bg-purple-200 rounded-full"></div>
                            </div>
                        </div>
                    ))}

                    {/* Premium upgrade banner */}
                    <div className="bg-gradient-to-r from-[#675AE7] to-[#8A7CF7] rounded-lg p-4 mt-6 mb-4 shadow-sm">
                        <div className="flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-white/20"></div>
                                <div>
                                    <div className="h-5 w-40 bg-white/30 rounded mb-2"></div>
                                    <div className="h-3 w-32 bg-white/20 rounded"></div>
                                </div>
                            </div>
                            <div className="h-10 w-24 bg-white/20 rounded-lg"></div>
                        </div>
                    </div>

                    {/* FAQs section */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-lg bg-purple-100"></div>
                            <div className="space-y-2">
                                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                                <div className="h-4 w-56 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}