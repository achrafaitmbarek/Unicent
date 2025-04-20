"use client"

import { useEffect, useRef } from "react"

interface CategoryData {
    categories: {
        name: string;
        value: number;
        amount: number;
    }[];
    total: number;
    currencySymbol: string;
}

export function ActivityChart({ data }: { data: CategoryData }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Color map for categories
    const categoryColors: Record<string, string> = {
        SUBSCRIPTION: "#01162c",
        INVESTING: "#27c661",
        GROCERIES: "#ff784b",
        SHOPPING: "#facc16",
        DINING: "#9333ea",
        TRANSPORTATION: "#0ea5e9",
        UTILITIES: "#f59e0b",
        ENTERTAINMENT: "#ec4899",
        HOUSING: "#64748b",
        HEALTHCARE: "#10b981",
        EDUCATION: "#8b5cf6",
        TRAVEL: "#f97316",
        OTHER: "#6b7280"
    };

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        // Use real data or fallback to empty array
        const chartData = data.categories.length > 0
            ? data.categories.slice(0, 5) // Limit to top 5 categories
            : [
                { name: "OTHER", value: 100, amount: 0 }
            ];

        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const radius = Math.min(centerX, centerY) - 10

        let startAngle = -0.5 * Math.PI

        chartData.forEach((item) => {
            const sliceAngle = (2 * Math.PI * item.value) / 100
            const color = categoryColors[item.name] || "#6b7280" // Default gray

            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
            ctx.closePath()
            ctx.fillStyle = color
            ctx.fill()

            startAngle += sliceAngle
        })

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
        ctx.fillStyle = "white"
        ctx.fill()

        ctx.fillStyle = "#01162c"
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("Total", centerX, centerY - 10)
        ctx.font = "bold 16px Arial"
        ctx.fillText(`${data.currencySymbol}${data.total.toLocaleString()}`, centerX, centerY + 10)

    }, [data])

    // Display up to 4 categories for the legend
    const displayCategories = data.categories.slice(0, 4);

    return (
        <div className="flex items-center justify-between">
            <canvas ref={canvasRef} width={200} height={200} />
            <div className="ml-4 space-y-3">
                {displayCategories.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: categoryColors[item.name] || "#6b7280" }}
                        ></div>
                        <span className="text-sm text-[#8f939f]">
                            {item.name.charAt(0) + item.name.slice(1).toLowerCase()}
                        </span>
                        <span className="ml-auto font-medium">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}