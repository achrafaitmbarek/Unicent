"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Free",
      description: "Basic financial tracking for individuals",
      price: {
        monthly: 0,
        annually: 0,
      },
      features: [
        "Basic budget tracking",
        "Up to 2 bank accounts",
        "Monthly financial summary",
        "Mobile app access",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced features for serious financial planning",
      price: {
        monthly: 9.99,
        annually: 7.99,
      },
      features: [
        "Everything in Free",
        "Unlimited bank accounts",
        "AI-powered insights",
        "Custom budget categories",
        "Savings goals",
        "Expense forecasting",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Family",
      description: "Comprehensive solution for families",
      price: {
        monthly: 19.99,
        annually: 16.99,
      },
      features: [
        "Everything in Pro",
        "Up to 5 user accounts",
        "Family budget planning",
        "Shared savings goals",
        "Bill splitting",
        "Financial education resources",
        "24/7 premium support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ]

  return (
    <div>
      <div className="flex justify-center items-center mb-8 gap-3">
        <span className={cn("text-sm", !isAnnual && "font-medium text-[#0a1929]")}>Monthly</span>
        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
        <div className="flex items-center gap-2">
          <span className={cn("text-sm", isAnnual && "font-medium text-[#0a1929]")}>Annual</span>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Save 20%</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn("flex flex-col", plan.popular && "border-blue-200 shadow-lg shadow-blue-100")}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0a1929]">
                  ${isAnnual ? plan.price.annually : plan.price.monthly}
                </span>
                <span className="text-gray-500 ml-2">{plan.price.monthly > 0 ? "/month" : ""}</span>
                {isAnnual && plan.price.monthly > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Billed annually (${(isAnnual ? plan.price.annually : plan.price.monthly) * 12}/year)
                  </div>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                      <Check className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  "w-full",
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-[#0a1929] hover:bg-[#0a1929]/90 text-white",
                )}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
