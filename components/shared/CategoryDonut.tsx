"use client"

import { useEffect, useRef } from "react"

export type CategoryData = {
    name: string;
    value: number;
    color: string;
};

type CategoryDonutProps = {
    data: CategoryData[];
    centerText?: string;
    centerSubtext?: string;
    title?: string;
};

export function CategoryDonut({
    data,
    centerText,
    centerSubtext = "Total",
    title = "Categories"
}: CategoryDonutProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current || !data.length) return

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
        const baseRadius = Math.min(centerX, centerY) - 20 // Slightly smaller base radius for overlap effect

        // Sort data by value (ascending) so larger segments appear on top
        const sortedData = [...data].sort((a, b) => a.value - b.value)

        const total = sortedData.reduce((sum, item) => sum + item.value, 0)

        // Calculate maximum radius increase for the largest value
        const maxRadiusIncrease = 15
        const maxValue = Math.max(...sortedData.map(item => item.value))

        let startAngle = -0.5 * Math.PI

        // First, draw shadows for all segments to create depth
        sortedData.forEach((item) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI

            // Calculate radius increase based on value proportion
            const radiusIncrease = (item.value / maxValue) * maxRadiusIncrease
            const radius = baseRadius + radiusIncrease

            // Draw shadow first
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
            ctx.arc(centerX, centerY, radius * 0.6, startAngle + sliceAngle, startAngle, true)
            ctx.closePath()
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
            ctx.shadowBlur = 4
            ctx.shadowOffsetX = 1
            ctx.shadowOffsetY = 1
            ctx.fillStyle = item.color
            ctx.fill()

            startAngle += sliceAngle
        })

        // Reset for actual segments
        startAngle = -0.5 * Math.PI
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        // Then draw actual segments
        sortedData.forEach((item) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI

            // Calculate radius increase based on value proportion
            const radiusIncrease = (item.value / maxValue) * maxRadiusIncrease
            const radius = baseRadius + radiusIncrease

            // Create a slight offset for each segment to enhance layered look
            const midAngle = startAngle + (sliceAngle / 2)
            const offsetDistance = radiusIncrease * 0.1
            const offsetX = Math.cos(midAngle) * offsetDistance
            const offsetY = Math.sin(midAngle) * offsetDistance

            // Draw the main segment with offset
            ctx.beginPath()
            ctx.arc(centerX + offsetX, centerY + offsetY, radius, startAngle, startAngle + sliceAngle)
            ctx.arc(centerX + offsetX, centerY + offsetY, radius * 0.6, startAngle + sliceAngle, startAngle, true)
            ctx.closePath()

            ctx.fillStyle = item.color
            ctx.fill()

            // Add a white stroke to create separation between segments
            ctx.strokeStyle = "white"
            ctx.lineWidth = 1.5
            ctx.stroke()

            startAngle += sliceAngle
        })

        // Draw center text
        if (centerText) {
            // Draw white circle in center to ensure text is readable
            ctx.beginPath()
            ctx.arc(centerX, centerY, baseRadius * 0.55, 0, Math.PI * 2)
            ctx.fillStyle = "white"
            ctx.fill()

            // Draw text
            ctx.fillStyle = "#01162c"
            ctx.font = "bold 24px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(centerText, centerX, centerY - 10)

            ctx.fillStyle = "#8993a4"
            ctx.font = "12px Arial"
            ctx.fillText(centerSubtext, centerX, centerY + 10)
        }
    }, [data, centerText, centerSubtext])

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <div className="flex justify-center">
                <canvas ref={canvasRef} className="w-64 h-64" />
            </div>
            <div className="flex justify-center gap-6 flex-wrap mt-4">
                {(() => {
                    const totalSum = data.reduce((sum, item) => sum + item.value, 0);

                    // Sort legend items by value (descending) for better readability
                    const sortedData = [...data].sort((a, b) => b.value - a.value);

                    return sortedData.map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm">{category.name}</span>
                            <span className="text-sm font-semibold">
                                {((category.value / totalSum) * 100).toFixed(2)}%
                            </span>
                        </div>
                    ));
                })()}
            </div>
        </div>
    );
}