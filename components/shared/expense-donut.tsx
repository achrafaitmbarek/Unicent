"use client"

import { useEffect, useRef } from "react"

export function ExpenseDonut() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const radius = Math.min(centerX, centerY) - 10

        const data = [
            { value: 50, color: "#23c55e" },
            { value: 35, color: "#fa7a4b" },
            { value: 15, color: "#edf2f6" },
        ]

        const total = data.reduce((sum, item) => sum + item.value, 0)

        let startAngle = -0.5 * Math.PI

        data.forEach((item) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI

            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
            ctx.arc(centerX, centerY, radius * 0.6, startAngle + sliceAngle, startAngle, true)
            ctx.closePath()

            ctx.fillStyle = item.color
            ctx.fill()

            startAngle += sliceAngle
        })

        ctx.fillStyle = "#01162c"
        ctx.font = "bold 24px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("80%", centerX, centerY - 10)

        ctx.fillStyle = "#8993a4"
        ctx.font = "12px Arial"
        ctx.fillText("Total count", centerX, centerY + 10)
    }, [])

    return <canvas ref={canvasRef} className="w-64 h-64" />
}

