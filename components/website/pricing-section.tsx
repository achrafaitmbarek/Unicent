"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PricingSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // English EUR currency formatter
  const formatEUR = useMemo(
    () => new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }),
    [],
  )

  const plans = [
    {
      name: "Free",
      description: "Essential financial tracking to get started",
      priceMonthly: 0,
      features: [
        "Simple budget tracking",
        "1 synced account",
        "Basic tips",
        "Monthly email summary",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium — Monthly",
      description: "Advanced power to optimize your finances",
      priceMonthly: 3.33, // €3.33/mo
      features: [
        "Advanced recommendations",
        "Smart alerts",
        "Multi-account sync",
        "Goals tracking",
        "Detailed reports (weekly, monthly, annual)",
        "Category spending optimization",
      ],
      cta: "Try Premium",
      popular: false,
    },
    {
      name: "Premium — Annual",
      description: "Best value",
      priceMonthly: 3.0, // €3.00/mo
      annualTotal: 36.0, // 3 × 12 = €36/year
      features: [
        "Advanced recommendations",
        "Smart alerts",
        "Multi-account sync",
        "Goals tracking",
        "Detailed reports (weekly, monthly, annual)",
        "Category spending optimization",
      ],
      cta: "Choose Annual",
      popular: true,
      savingsBadge: "Save ~10%",
    },
  ] as const

  return (
    <div>
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">Simple, transparent pricing. Choose the plan that fits you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Card
              className={cn(
                "relative h-full flex flex-col border-border/60 bg-background/80 backdrop-blur-sm transition-all duration-300",
                plan.popular ? "shadow-lg" : "shadow-md",
                hoveredIndex === index && "shadow-xl",
              )}
            >
              {/* Glow effect on hover */}
              <div
                className={cn(
                  "absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 transition-opacity duration-300 -z-10",
                  hoveredIndex === index ? "opacity-20 dark:opacity-30" : "opacity-0",
                )}
              ></div>

              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="mb-6">
                  {plan.priceMonthly === 0 ? (
                    <span className="text-4xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">{formatEUR.format(plan.priceMonthly)}</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </>
                  )}
                  {"annualTotal" in plan && plan.annualTotal !== undefined && plan.priceMonthly > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Billed annually ({formatEUR.format(plan.annualTotal)}/year)
                    </div>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 mt-0.5">
                        <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={cn(
                    "w-full group relative overflow-hidden",
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      : "bg-primary hover:bg-primary/90",
                  )}
                >
                  <span className="relative z-10">{plan.cta}</span>
                  {!plan.popular && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  )}
                </Button>
              </CardFooter>

              {/* Border glow effect */}
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none transition-opacity duration-300",
                  hoveredIndex === index || plan.popular ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
