"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    ArrowUpRight,
    BarChart3,
    Clock,
    PiggyBank,
    Shield,
    Link2,
    PieChart,
    AlertTriangle,
    Target,
    FileBarChart,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureGrid() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const features = [
        {
            icon: <Link2 className="h-5 w-5 text-blue-500" />,
            title: "Secure Bank Sync (Powens)",
            description: "Connect your bank accounts securely via Powens and keep balances in sync.",
            gradient: "from-blue-500/20 to-indigo-500/20",
        },
        {
            icon: <PieChart className="h-5 w-5 text-purple-500" />,
            title: "Auto Categorization",
            description: "Transactions are auto-tagged into categories for clear spending insights.",
            gradient: "from-purple-500/20 to-pink-500/20",
        },
        {
            icon: <AlertTriangle className="h-5 w-5 text-emerald-500" />,
            title: "Anomaly Detection",
            description: "Spot unusual transactions with risk level and reason to act quickly.",
            gradient: "from-emerald-500/20 to-teal-500/20",
        },
        {
            icon: <BarChart3 className="h-5 w-5 text-violet-500" />,
            title: "Spending Optimization",
            description: "Get category recommendations to reduce spending and boost savings.",
            gradient: "from-violet-500/20 to-purple-500/20",
        },
        {
            icon: <PiggyBank className="h-5 w-5 text-rose-500" />,
            title: "Smart Savings Goals",
            description: "Set goals with monthly allocation and track progress toward targets.",
            gradient: "from-rose-500/20 to-red-500/20",
        },
        {
            icon: <FileBarChart className="h-5 w-5 text-sky-500" />,
            title: "Monthly Reports",
            description: "Income, expenses, savings rate, breakdowns and tailored tips each month.",
            gradient: "from-sky-500/20 to-cyan-500/20",
        },
        {
            icon: <Clock className="h-5 w-5 text-lime-500" />,
            title: "Transaction History",
            description: "Full history with filters by category, date and income/expense flow.",
            gradient: "from-lime-500/20 to-green-500/20",
        },
        {
            icon: <Target className="h-5 w-5 text-amber-500" />,
            title: "Personalized Tips",
            description: "Goal-based tips and daily insights to keep your finances on track.",
            gradient: "from-amber-500/20 to-orange-500/20",
        },
        {
            icon: <Shield className="h-5 w-5 text-fuchsia-500" />,
            title: "Bank-Grade Security",
            description: "Strong encryption and access controls to protect your financial data.",
            gradient: "from-fuchsia-500/20 to-pink-500/20",
        },
    ]

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <Card
                    key={index}
                    className={cn(
                        "group relative overflow-hidden border border-border/60 bg-background/80 backdrop-blur-sm transition-all duration-300",
                        hoveredIndex === index ? "shadow-lg" : "shadow-md",
                    )}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <div className="absolute inset-0 -z-10">
                        <div
                            className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                                feature.gradient,
                                hoveredIndex === index ? "opacity-100" : "opacity-0",
                            )}
                        ></div>
                    </div>

                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-background border border-border/60 shadow-sm">
                                {feature.icon}
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: hoveredIndex === index ? 1 : 0,
                                    scale: hoveredIndex === index ? 1 : 0.8,
                                }}
                                transition={{ duration: 0.2 }}
                                className="h-7 w-7 rounded-full flex items-center justify-center bg-background border border-border/60 shadow-sm"
                            >
                                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </motion.div>
                        </div>
                        <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                    </CardContent>

                    {/* Border glow effect on hover */}
                    <div
                        className={cn(
                            "absolute inset-0 pointer-events-none transition-opacity duration-300",
                            hoveredIndex === index ? "opacity-100" : "opacity-0",
                        )}
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
