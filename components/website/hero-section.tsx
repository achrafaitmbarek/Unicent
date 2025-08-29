"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, ChevronRight, Shield, Sparkles, BarChart3, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import ThumbnailImage from "@/public/Thumbnail.png"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)

    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
      observer.disconnect()
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const imageVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.3 },
    },
  }

  return (
    <section ref={sectionRef} className="relative pt-20 pb-28 md:pb-32 overflow-hidden">
      <motion.div
        className="container max-w-7xl"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="px-3 py-1.5 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                <span>AI budgeting & bank sync</span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Master your money with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI budgeting</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 max-w-lg">
              Securely connect your bank accounts (Powens), auto-categorize transactions, set financial goals, and get
              monthly reports with personalized savings tips and spending optimization.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="group relative overflow-hidden" aria-label="Get started for free">
                <Link href="/auth/register">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group" aria-label="View live dashboard demo">
                <Link href="#dashboard">
                  <span>View Demo</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Secure bank connections (Powens integration)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Auto-categorization + anomaly alerts</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Goals with personalized savings tips</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={imageVariants} className="relative">
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-border/60 shadow-2xl bg-white/5 backdrop-blur-sm">
              {/* Removed the overlay that was making the image less clear */}
              <Image
                src={ThumbnailImage}
                alt="UNICENT Dashboard Preview"
                fill
                className="object-contain" // Changed from object-cover to object-contain
                priority
              />

              {/* Floating elements - repositioned for better visibility */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-border/60 shadow-lg">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Bank-Grade Security</span>
              </div>

              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-border/60 shadow-lg">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Spending Optimization</span>
              </div>

              {/* Additional floating element for better visual */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-border/60 shadow-lg">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Goal Tracking</span>
              </div>
            </div>

            {/* Enhanced glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-lg blur-2xl opacity-20 dark:opacity-30 animate-pulse"></div>

            {/* Additional subtle glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-lg blur-xl"></div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
