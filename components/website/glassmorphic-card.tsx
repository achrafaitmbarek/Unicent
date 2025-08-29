"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface GlassmorphicCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  featured?: boolean
}

export function GlassmorphicCard({ icon, title, description, gradient, featured = false }: GlassmorphicCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        "group relative rounded-xl overflow-hidden backdrop-blur-sm border border-border/60",
        featured ? "shadow-lg" : "shadow-md",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
            gradient,
            isHovered ? "opacity-100" : "opacity-0",
          )}
        ></div>
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm",
            featured ? "bg-background/70" : "bg-background/80",
          )}
        ></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300",
            featured
              ? "bg-background/80 border border-border/60 shadow-md"
              : "bg-background/60 border border-border/40 shadow-sm",
            isHovered && "scale-110",
          )}
        >
          {icon}
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>

        <Button variant="ghost" className="group/btn p-0 h-auto text-sm font-medium">
          Learn more
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>

      {/* Border glow effect */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-300",
          isHovered || featured ? "opacity-100" : "opacity-0",
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
