"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"

export function AnimatedChainLink() {
    const controls = useAnimation()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start("visible")
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.1 },
        )

        const el = containerRef.current
        if (el) {
            observer.observe(el)
        }

        return () => {
            if (el) {
                observer.unobserve(el)
            }
        }
    }, [controls])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    }

    const nodeVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    }

    const lineVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
        },
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-md h-[300px]">
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 400 300"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
                className="overflow-visible"
            >
                {/* Connecting Lines */}
                <motion.path
                    d="M 100,50 L 200,100 L 300,50 L 350,150 L 250,200 L 150,200 L 50,150 Z"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="5,5"
                    variants={lineVariants}
                />

                <motion.path
                    d="M 100,50 L 50,150 L 150,200"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    variants={lineVariants}
                />

                <motion.path
                    d="M 300,50 L 350,150 L 250,200"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    variants={lineVariants}
                />

                {/* Nodes */}
                <motion.circle cx="100" cy="50" r="15" fill="url(#nodeGradient1)" variants={nodeVariants} />
                <motion.circle cx="200" cy="100" r="15" fill="url(#nodeGradient2)" variants={nodeVariants} />
                <motion.circle cx="300" cy="50" r="15" fill="url(#nodeGradient3)" variants={nodeVariants} />
                <motion.circle cx="350" cy="150" r="15" fill="url(#nodeGradient1)" variants={nodeVariants} />
                <motion.circle cx="250" cy="200" r="15" fill="url(#nodeGradient2)" variants={nodeVariants} />
                <motion.circle cx="150" cy="200" r="15" fill="url(#nodeGradient3)" variants={nodeVariants} />
                <motion.circle cx="50" cy="150" r="15" fill="url(#nodeGradient1)" variants={nodeVariants} />

                {/* Gradients */}
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>

                    <radialGradient id="nodeGradient1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </radialGradient>

                    <radialGradient id="nodeGradient2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </radialGradient>

                    <radialGradient id="nodeGradient3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                    </radialGradient>
                </defs>
            </motion.svg>

            {/* Pulse animations */}
            <div className="absolute top-[50px] left-[100px] -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-blue-500/20 animate-ping"></div>
            <div className="absolute top-[200px] left-[150px] -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-purple-500/20 animate-ping [animation-delay:1s]"></div>
            <div className="absolute top-[50px] left-[300px] -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-indigo-500/20 animate-ping [animation-delay:2s]"></div>
        </div>
    )
}
