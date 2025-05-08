"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { categoryColors } from "./category‐colors";

interface CategoryData {
    categories: { name: string; value: number; amount: number }[]
    total: number
    currencySymbol: string
}

export function ActivityChart({ data }: { data: CategoryData }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Clear previous renders
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        const chartData = data.categories.length
            ? data.categories.slice(0, 5)
            : [{ name: "OTHER", value: 100, amount: 0 }]

        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const radius = Math.min(centerX, centerY) - 10
        let startAngle = -0.5 * Math.PI

        chartData.forEach(item => {
            const sliceAngle = (2 * Math.PI * item.value) / 100
            const color = categoryColors[item.name] ?? "#6b7280"

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
        ctx.fillStyle = "#fff"
        ctx.fill()

        ctx.fillStyle = "#01162c"
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("Total", centerX, centerY - 10)
        ctx.font = "bold 16px Arial"
        ctx.fillText(`${data.currencySymbol}${data.total.toLocaleString()}`, centerX, centerY + 10)
    }, [data])

    const displayCategories = data.categories.slice(0, 4)

    return (
        <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#03091d]">Activity</h2>
                    <Button
                        variant="outline"
                        className="bg-[#fafcfa] text-[#747682] h-8 border-[#edf2f6] hover:bg-[#f2f4fa] hover:text-[#03091d]"
                        size="sm"
                    >
                        Monthly <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 flex items-center justify-between">
                    <div className="w-1/2 h-full flex items-center justify-center">
                        <canvas ref={canvasRef} width={200} height={200} className="max-w-full max-h-full" />
                    </div>
                    <div className="w-1/2 space-y-3">
                        {displayCategories.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: categoryColors[item.name] ?? "#6b7280" }}
                                />
                                <span className="text-sm text-[#8f939f]">
                                    {item.name.charAt(0) + item.name.slice(1).toLowerCase()}
                                </span>
                                <span className="ml-auto font-medium">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}