"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link as LinkIcon, PieChart, AlertTriangle, Target } from "lucide-react"

import { cn } from "@/lib/utils"

export function Web3Stats() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    {
      value: "120+",
      label: "Bank Connections Synced",
      icon: <LinkIcon className="h-4 w-4" />,
    },
    {
      value: "45K+",
      label: "Transactions Categorized",
      icon: <PieChart className="h-4 w-4" />,
    },
    {
      value: "2.1K",
      label: "Anomaly Alerts Detected",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      value: "3.8K",
      label: "Goals Tracked",
      icon: <Target className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "relative rounded-lg border border-border/60 bg-background/80 backdrop-blur-sm p-4 shadow-sm",
            "hover:shadow-md transition-shadow duration-300",
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {stat.icon}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>

          {/* Progress bar */}
          <div className="mt-3 h-1 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={isVisible ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1.5, delay: 0.2 + index * 0.1 }}
            ></motion.div>
          </div>

          {/* Border glow effect */}
          <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
