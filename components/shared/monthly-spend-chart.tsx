"use client"

import { useEffect, useRef } from "react"

interface MonthlySpendChartProps {
    data: {
        month: string;
        expenses: number;
        income: number;
    }[];
    currencySymbol: string;
}

export function MonthlySpendChart({ data, currencySymbol }: MonthlySpendChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

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

        // Margins
        const topMargin = 40
        const bottomMargin = 35 // Increased for legend
        const leftMargin = 50
        const rightMargin = 20

        const months = data.map(item => item.month);
        const expenses = data.map(item => item.expenses);
        const incomes = data.map(item => item.income);

        // Find max value for scale (from either dataset)
        const maxValue = Math.max(...[...expenses, ...incomes, 1000]);

        // Bar settings
        const barWidth = 15
        const chartWidth = rect.width - leftMargin - rightMargin
        const chartHeight = rect.height - topMargin - bottomMargin
        // Each month now has 2 bars with a small gap between them
        const monthWidth = 2 * barWidth + 5 // 5px between expense and income bar
        const barSpacing = (chartWidth - monthWidth * months.length) / (months.length + 1)

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height)

        // Draw Y-axis labels
        ctx.fillStyle = "#8f939f"
        ctx.font = "10px Arial"
        ctx.textAlign = "right"

        const yLabelCount = 5;
        const yLabels = Array.from({ length: yLabelCount }, (_, i) => {
            const value = Math.round(maxValue * (i / (yLabelCount - 1)));
            return `${currencySymbol}${(value / 1000).toFixed(0)}K`;
        }).reverse();

        const yStep = chartHeight / (yLabels.length - 1)

        // Draw y-axis labels and grid lines
        yLabels.forEach((label, i) => {
            const y = topMargin + i * yStep
            ctx.fillText(label, leftMargin - 10, y + 3)

            // Grid lines
            ctx.beginPath()
            ctx.strokeStyle = "#edf2f6"
            ctx.moveTo(leftMargin, y)
            ctx.lineTo(rect.width - rightMargin, y)
            ctx.stroke()
        })

        // Determine the current month
        const currentMonthIndex = months.length - 1;

        // Draw bars for each month
        months.forEach((month, i) => {
            const monthX = leftMargin + barSpacing + i * (monthWidth + barSpacing)

            // EXPENSE BAR
            const expenseHeight = expenses[i] > 0 ? (expenses[i] / maxValue) * chartHeight : 0
            const expenseY = topMargin + chartHeight - expenseHeight

            // Draw expense tooltip
            ctx.fillStyle = i === currentMonthIndex ? "#01162c" : "#8f939f"
            ctx.beginPath()
            ctx.roundRect(monthX - 12, expenseY - 25, 50, 20, 5)
            ctx.fill()

            ctx.fillStyle = "white"
            ctx.font = "bold 10px Arial"
            ctx.textAlign = "center"
            ctx.fillText(`${currencySymbol}${(expenses[i] / 1000).toFixed(1)}K`, monthX + barWidth / 2, expenseY - 12)

            // Draw expense bar
            if (i === currentMonthIndex) {
                const gradient = ctx.createLinearGradient(monthX, expenseY, monthX, topMargin + chartHeight)
                gradient.addColorStop(0, "#ff784b")
                gradient.addColorStop(1, "#ff4d6d")
                ctx.fillStyle = gradient
            } else {
                ctx.fillStyle = "#ff784b"
            }

            ctx.beginPath()
            ctx.roundRect(monthX, expenseY, barWidth, expenseHeight, 5)
            ctx.fill()

            // INCOME BAR
            const incomeX = monthX + barWidth + 5 // 5px gap between bars
            const incomeHeight = incomes[i] > 0 ? (incomes[i] / maxValue) * chartHeight : 0
            const incomeY = topMargin + chartHeight - incomeHeight

            // Draw income tooltip
            ctx.fillStyle = i === currentMonthIndex ? "#01162c" : "#8f939f"
            ctx.beginPath()
            ctx.roundRect(incomeX - 12, incomeY - 25, 50, 20, 5)
            ctx.fill()

            ctx.fillStyle = "white"
            ctx.font = "bold 10px Arial"
            ctx.textAlign = "center"
            ctx.fillText(`${currencySymbol}${(incomes[i] / 1000).toFixed(1)}K`, incomeX + barWidth / 2, incomeY - 12)

            // Draw income bar
            if (i === currentMonthIndex) {
                const gradient = ctx.createLinearGradient(incomeX, incomeY, incomeX, topMargin + chartHeight)
                gradient.addColorStop(0, "#27c661")
                gradient.addColorStop(1, "#1a9d4d")
                ctx.fillStyle = gradient
            } else {
                ctx.fillStyle = "#27c661"
            }

            ctx.beginPath()
            ctx.roundRect(incomeX, incomeY, barWidth, incomeHeight, 5)
            ctx.fill()

            // Draw month label
            ctx.fillStyle = "#8f939f"
            ctx.font = "11px Arial"
            ctx.textAlign = "center"
            ctx.fillText(month, monthX + monthWidth / 2, topMargin + chartHeight + 15)
        })

        // Draw legend
        ctx.fillStyle = "#ff784b"
        ctx.beginPath()
        ctx.roundRect(leftMargin, rect.height - 15, 10, 10, 2)
        ctx.fill()

        ctx.fillStyle = "#8f939f"
        ctx.font = "10px Arial"
        ctx.textAlign = "left"
        ctx.fillText("Expenses", leftMargin + 15, rect.height - 6)

        ctx.fillStyle = "#27c661"
        ctx.beginPath()
        ctx.roundRect(leftMargin + 80, rect.height - 15, 10, 10, 2)
        ctx.fill()

        ctx.fillStyle = "#8f939f"
        ctx.fillText("Income", leftMargin + 95, rect.height - 6)

    }, [data, currencySymbol])

    return <canvas ref={canvasRef} className="h-full w-full" />
}