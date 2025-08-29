"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Login from "@/assets/demos-dashboard/Login.png"
import Register from "@/assets/demos-dashboard/regiter.png"
import dashboard1 from "@/assets/demos-dashboard/dashboard1.png"
import dashboard2 from "@/assets/demos-dashboard/dashboard2.png"
import dashboard3 from "@/assets/demos-dashboard/dashboard3.png"
import dashboard4 from "@/assets/demos-dashboard/dashboard4.png"

export function DashboardPreview() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [current, setCurrent] = useState(0)
    const [isHover, setIsHover] = useState(false)
    const [touchStartX, setTouchStartX] = useState<number | null>(null)
    const [tilt, setTilt] = useState({ x: 0, y: 0 })

    const slides: { src: StaticImageData; label: string }[] = [
        { src: Login, label: "Login" },
        { src: Register, label: "Register" },
        { src: dashboard1, label: "Overview" },
        { src: dashboard2, label: "Spending" },
        { src: dashboard3, label: "Goals" },
        { src: dashboard4, label: "Insights" },
    ]

    useEffect(() => {
        const node = containerRef.current
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
        return () => observer.unobserve(node)
    }, [])

    useEffect(() => {
        if (!isVisible) return
        const id = setInterval(() => {
            if (!isHover) setCurrent((i) => (i + 1) % slides.length)
        }, 4000)
        return () => clearInterval(id)
    }, [isVisible, isHover, slides.length])

    const prev = () => setCurrent((i) => (i - 1 + slides.length) % slides.length)
    const next = () => setCurrent((i) => (i + 1) % slides.length)

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }

    return (
        <div ref={containerRef} className="relative">
            <motion.div
                className="relative max-w-5xl mx-auto"
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <div
                    className="relative rounded-xl overflow-hidden border border-border/60 shadow-2xl bg-background"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => {
                        setIsHover(false)
                        setTilt({ x: 0, y: 0 })
                    }}
                    onMouseMove={(e) => {
                        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                        const px = (e.clientX - rect.left) / rect.width
                        const py = (e.clientY - rect.top) / rect.height
                        const rotateY = (px - 0.5) * 10 // +/- 5deg
                        const rotateX = (0.5 - py) * 10
                        setTilt({ x: rotateX, y: rotateY })
                    }}
                    onTouchStart={(e) => setTouchStartX(e.changedTouches[0].clientX)}
                    onTouchEnd={(e) => {
                        const endX = e.changedTouches[0].clientX
                        if (touchStartX === null) return
                        const dx = endX - touchStartX
                        if (Math.abs(dx) > 40) {
                            if (dx > 0) prev()
                            else next()
                        }
                        setTouchStartX(null)
                    }}
                >
                    <div
                        className="relative w-full"
                        style={{
                            // Match the slide's native aspect ratio to avoid cropping
                            aspectRatio:
                                slides[current].src.width && slides[current].src.height
                                    ? `${slides[current].src.width}/${slides[current].src.height}`
                                    : "16/10",
                        }}
                    >
                        {/* Blurred background fill to avoid empty bars while keeping foreground fully visible */}
                        <Image
                            src={slides[current].src}
                            alt=""
                            aria-hidden
                            fill
                            className="object-cover scale-110 blur-2xl opacity-30"
                            priority={current === 0}
                        />
                        <AnimatePresence mode="wait">
                            <motion.figure
                                key={current}
                                className="absolute inset-0 will-change-transform"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                style={{
                                    transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                                    transition: isHover ? "transform 60ms linear" : "transform 200ms ease-out",
                                }}
                            >
                                <Image
                                    src={slides[current].src}
                                    alt={`${slides[current].label} preview`}
                                    fill
                                    className="object-contain p-2 md:p-4"
                                    priority={current === 0}
                                />

                                {/* Top-right label */}
                                <div className="absolute top-3 right-3">
                                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                                        {slides[current].label}
                                    </Badge>
                                </div>
                            </motion.figure>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-3">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm border border-border/60"
                            onClick={prev}
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm border border-border/60"
                            onClick={next}
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={cn(
                                    "h-2 w-2 rounded-full transition-all",
                                    i === current ? "bg-primary w-4" : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                                )}
                            />
                        ))}
                    </div>

                    {/* Autoplay progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/60">
                        <motion.div
                            key={`${current}-${isHover ? "paused" : "running"}`}
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={isHover ? { width: 0 } : { width: "100%" }}
                            transition={{ duration: 4, ease: "linear" }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-3xl opacity-10 dark:opacity-20 -z-10"></div>
        </div>
    )
}
