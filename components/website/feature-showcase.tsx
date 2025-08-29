"use client"

import { useState } from "react"
import Image from "next/image"
import { LineChart, PiggyBank, Shield, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState("ai-insights")

  const features = [
    {
      id: "ai-insights",
      title: "AI Insights",
      description: "Get personalized financial recommendations and insights powered by advanced AI.",
      icon: Sparkles,
      image: "/images/ai-insights.png",
    },
    {
      id: "budget-tracking",
      title: "Budget Tracking",
      description: "Set budgets, track expenses, and visualize your spending patterns in real-time.",
      icon: LineChart,
      image: "/images/dashboard-full.png",
    },
    {
      id: "savings-goals",
      title: "Savings Goals",
      description: "Set and track savings goals with automated plans to help you reach them faster.",
      icon: PiggyBank,
      image: "/images/dashboard-preview.png",
    },
    {
      id: "secure-banking",
      title: "Secure Banking",
      description: "Connect your bank accounts securely with bank-level encryption and protection.",
      icon: Shield,
      image: "/images/login-screen.png",
    },
  ]

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="space-y-2">
          {features.map((feature) => (
            <Button
              key={feature.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 p-4 h-auto",
                activeFeature === feature.id
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                  : "hover:bg-gray-100",
              )}
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className={cn("p-2 rounded-lg", activeFeature === feature.id ? "bg-blue-100" : "bg-gray-100")}>
                <feature.icon
                  className={cn("h-5 w-5", activeFeature === feature.id ? "text-blue-600" : "text-gray-500")}
                />
              </div>
              <div className="text-left">
                <div className="font-medium">{feature.title}</div>
                <div className={cn("text-sm", activeFeature === feature.id ? "text-blue-600" : "text-gray-500")}>
                  {feature.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2">
        <Card className="overflow-hidden border-0 shadow-lg h-full">
          <CardContent className="p-0">
            <div className="relative w-full h-[400px]">
              <Image
                src={features.find((f) => f.id === activeFeature)?.image || "/placeholder.svg"}
                alt={features.find((f) => f.id === activeFeature)?.title || "Feature"}
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
