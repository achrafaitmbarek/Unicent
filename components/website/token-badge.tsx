"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface TokenBadgeProps {
  name: string
  value: string
  change: string
  positive: boolean
}

export function TokenBadge({ name, value, change, positive }: TokenBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        "relative rounded-lg overflow-hidden border border-border/60 bg-background/80 backdrop-blur-sm px-3 py-2 shadow-sm transition-all duration-300",
        isHovered && "shadow-md",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            name === "ETH"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
              : name === "BTC"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400",
          )}
        >
          {name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{name}</span>
            <span
              className={cn(
                "text-xs flex items-center",
                positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {positive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {change}
            </span>
          </div>
          <div className="text-sm font-medium">{value}</div>
        </div>
      </div>

      {/* Border glow effect */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
      </div>
    </motion.div>
  )
}
