"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

interface IncomeChartProps {
    data: {
        month: string;
        income?: number;
        expense?: number;
        year: string;
    }[];
    currencySymbol: string;
    maxValue?: number;
    type: "income" | "expense";
}

export function IncomeChart({ data = [], currencySymbol = '€', maxValue: propMaxValue, type }: IncomeChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Tooltip state (prepared for hover functionality)
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
    const [hoverDistance, setHoverDistance] = useState<number>(Infinity);
    const HOVER_THRESHOLD = 10; // px - how close you need to be to a point

    function calculatePercentChange(previous: number, current: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }

    function formatCurrency(value: number): string {
        if (value >= 1000000) {
            return `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K`;
        } else {
            return value.toLocaleString();
        }
    }

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const months = data.length > 0 ? data.map(item => item.month) : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
        const values = data.length > 0
            ? data.map(item => (item[type] !== undefined ? item[type] as number : 0))
            : [70, 60, 75, 55, 80, 65, 75, 60, 70];
        const maxValue = propMaxValue || (Math.max(...values) > 0 ? Math.max(...values) * 1.2 : 90);

        const chartWidth = rect.width;
        const chartHeight = rect.height - 30;

        // INCREASED PADDING - particularly on right and left sides
        const padding = { top: 20, right: 30, bottom: 30, left: 50 };
        const graphWidth = chartWidth - padding.left - padding.right;
        const graphHeight = chartHeight - padding.top - padding.bottom;

        ctx.clearRect(0, 0, chartWidth, chartHeight);

        // Draw background grid
        ctx.beginPath();
        const yLabelCount = 5;
        for (let i = 0; i < yLabelCount; i++) {
            const y = padding.top + (i / (yLabelCount - 1)) * graphHeight;
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + graphWidth, y);
        }
        ctx.strokeStyle = "#f0f2f5";
        ctx.stroke();

        // Draw Y-axis labels
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.font = "10px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#8993a4";

        const yLabels = Array.from({ length: yLabelCount }, (_, i) => {
            const value = maxValue * i / (yLabelCount - 1);
            return formatCurrency(value);
        }).reverse();

        yLabels.forEach((label, i) => {
            const y = padding.top + (i / (yLabels.length - 1)) * graphHeight;
            ctx.fillText(label, padding.left - 8, y);
        });

        // Draw month labels - with improved spacing
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        months.forEach((month, i) => {
            const x = padding.left + (i / (Math.max(1, months.length - 1))) * graphWidth;

            // Make month labels shorter if too many months
            const displayMonth = months.length > 6 ? month.slice(0, 3) : month;
            ctx.fillText(displayMonth, x, chartHeight - padding.bottom + 5);

            // Highlight current month with subtle marker
            if (i === months.length - 1) {
                ctx.fillStyle = "#e9f7fe";
                ctx.fillRect(x - 15, padding.top, 30, graphHeight);
                ctx.fillStyle = "#8993a4";
            }
        });

        // Draw line for current month
        const currentMonthIndex = months.length - 1;
        if (currentMonthIndex !== -1) {
            const x = padding.left + (currentMonthIndex / Math.max(1, (months.length - 1))) * graphWidth;

            // Draw vertical dotted line
            ctx.beginPath();
            ctx.setLineDash([2, 3]);
            ctx.strokeStyle = "#8993a4";
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + graphHeight);
            ctx.stroke();
            ctx.setLineDash([]);

            const y = padding.top + graphHeight - (values[currentMonthIndex] / maxValue) * graphHeight;

            // Draw trend indicator
            const isIncrease = currentMonthIndex > 0 && values[currentMonthIndex] > values[currentMonthIndex - 1];

            // Calculate if value is too close to top or right edge
            const spaceToTop = y - padding.top;
            const spaceToRight = chartWidth - x;

            // Adjust position for values near the right edge
            const textOffsetX = spaceToRight < 40 ? -30 : 0;
            const valueOffsetY = spaceToTop < 40 ? 50 : 30; // Move down if too close to top

            // Draw current month value with position adjustment
            ctx.fillStyle = "#01162c";
            ctx.textAlign = spaceToRight < 40 ? "right" : "center"; // Align right if near edge
            ctx.textBaseline = "bottom";
            ctx.font = "bold 12px Inter, system-ui, sans-serif";

            const formattedValue = currencySymbol + formatCurrency(values[currentMonthIndex]);
            ctx.fillText(formattedValue, x + textOffsetX, y - valueOffsetY);

            // Adjust percentage change position based on edge proximity
            if (currentMonthIndex > 0) {
                ctx.font = "10px Inter, system-ui, sans-serif";
                ctx.fillStyle = isIncrease ? "#27c661" : "#ff784b";

                const change = calculatePercentChange(values[currentMonthIndex - 1], values[currentMonthIndex]);
                ctx.fillText(
                    `${isIncrease ? "+" : ""}${change.toFixed(1)}%`,
                    x + textOffsetX, // Removed the +10 offset
                    y - (valueOffsetY - 14)
                );
            }

            // Current month point
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#01162c";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        // Draw the line chart with smooth curves
        ctx.beginPath();
        values.forEach((value, i) => {
            const x = padding.left + (i / Math.max(1, (values.length - 1))) * graphWidth;
            const y = padding.top + graphHeight - (value / maxValue) * graphHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = padding.left + ((i - 1) / Math.max(1, (values.length - 1))) * graphWidth;
                const prevY = padding.top + graphHeight - (values[i - 1] / maxValue) * graphHeight;

                const cpX1 = prevX + (x - prevX) / 3;
                const cpX2 = prevX + (2 * (x - prevX)) / 3;

                ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
            }
        });

        // Draw area under the curve
        const lastX = padding.left + graphWidth;
        ctx.lineTo(lastX, padding.top + graphHeight);
        ctx.lineTo(padding.left, padding.top + graphHeight);

        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphHeight);

        // Set gradient colors based on type
        if (type === "income") {
            gradient.addColorStop(0, "rgba(39, 198, 97, 0.15)");
            gradient.addColorStop(1, "rgba(39, 198, 97, 0)");
        } else {
            gradient.addColorStop(0, "rgba(255, 120, 75, 0.15)");
            gradient.addColorStop(1, "rgba(255, 120, 75, 0)");
        }

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw the line again (over the fill)
        ctx.beginPath();
        values.forEach((value, i) => {
            const x = padding.left + (i / Math.max(1, (values.length - 1))) * graphWidth;
            const y = padding.top + graphHeight - (value / maxValue) * graphHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = padding.left + ((i - 1) / Math.max(1, (values.length - 1))) * graphWidth;
                const prevY = padding.top + graphHeight - (values[i - 1] / maxValue) * graphHeight;

                const cpX1 = prevX + (x - prevX) / 3;
                const cpX2 = prevX + (2 * (x - prevX)) / 3;

                ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
            }

            // Draw all points
            if (i !== currentMonthIndex) { // Skip current month (already drawn larger)
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = type === "income" ? "#27c661" : "#ff784b";
                ctx.fill();
            }
        });

        ctx.strokeStyle = type === "income" ? "#27c661" : "#ff784b";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw tooltip for hovered month
        if (hoveredMonth !== null && hoveredMonth !== currentMonthIndex) {
            const x = padding.left + (hoveredMonth / Math.max(1, (values.length - 1))) * graphWidth;
            const y = padding.top + graphHeight - (values[hoveredMonth] / maxValue) * graphHeight;

            // Draw point highlight
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = type === "income" ? "rgba(39, 198, 97, 0.3)" : "rgba(255, 120, 75, 0.3)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = type === "income" ? "#27c661" : "#ff784b";
            ctx.fill();

            // Draw tooltip background
            const tooltipValue = currencySymbol + formatCurrency(values[hoveredMonth]);
            const tooltipWidth = ctx.measureText(tooltipValue).width + 20;
            const tooltipHeight = 28;
            const tooltipX = Math.min(x - tooltipWidth / 2, chartWidth - tooltipWidth - 5);
            const tooltipY = y - tooltipHeight - 10;

            // Draw tooltip background
            ctx.fillStyle = "#01162c";
            ctx.beginPath();

            try {
                // Use roundRect if supported
                ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 4);
            } catch {
                // Fallback for browsers that don't support roundRect
                const radius = 4;
                ctx.moveTo(tooltipX + radius, tooltipY);
                ctx.lineTo(tooltipX + tooltipWidth - radius, tooltipY);
                ctx.quadraticCurveTo(tooltipX + tooltipWidth, tooltipY, tooltipX + tooltipWidth, tooltipY + radius);
                ctx.lineTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight - radius);
                ctx.quadraticCurveTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight, tooltipX + tooltipWidth - radius, tooltipY + tooltipHeight);
                ctx.lineTo(tooltipX + radius, tooltipY + tooltipHeight);
                ctx.quadraticCurveTo(tooltipX, tooltipY + tooltipHeight, tooltipX, tooltipY + tooltipHeight - radius);
                ctx.lineTo(tooltipX, tooltipY + radius);
                ctx.quadraticCurveTo(tooltipX, tooltipY, tooltipX + radius, tooltipY);
                ctx.closePath();
            }

            ctx.fill();

            // Draw tooltip value
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "12px Inter, system-ui, sans-serif";
            ctx.fillText(tooltipValue, tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight / 2);

            // Draw a vertical guide line
            ctx.beginPath();
            ctx.setLineDash([2, 2]);
            ctx.strokeStyle = type === "income" ? "rgba(39, 198, 97, 0.5)" : "rgba(255, 120, 75, 0.5)";
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + graphHeight);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw month label highlight
            ctx.fillStyle = type === "income" ? "rgba(39, 198, 97, 0.2)" : "rgba(255, 120, 75, 0.2)";
            ctx.fillRect(x - 15, chartHeight - padding.bottom + 2, 30, 16);
        }

        // Add hover effect handler
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let closestPointIndex = -1;
            let minDistance = Infinity;

            // Find the closest point
            values.forEach((value, i) => {
                const x = padding.left + (i / Math.max(1, (values.length - 1))) * graphWidth;
                const y = padding.top + graphHeight - (value / maxValue) * graphHeight;

                const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));

                if (distance < minDistance) {
                    minDistance = distance;
                    closestPointIndex = i;
                }
            });

            // Only set the hovered month if we're close enough to a point
            if (minDistance <= HOVER_THRESHOLD) {
                setHoveredMonth(closestPointIndex);
                setHoverDistance(minDistance);
            } else {
                setHoveredMonth(null);
                setHoverDistance(Infinity);
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [data, currencySymbol, propMaxValue, type, hoveredMonth, hoverDistance]);

    // Current month data
    const currentMonthData = data.length > 0 ? data[data.length - 1] : null;
    const previousMonthData = data.length > 1 ? data[data.length - 2] : null;

    const currentAmount = currentMonthData && type in currentMonthData ?
        (currentMonthData[type] as number || 0) : 0;
    const previousAmount = previousMonthData && type in previousMonthData ?
        (previousMonthData[type] as number || 0) : 0;
    const isIncrease = currentAmount > previousAmount;
    const percentDiff = previousAmount === 0 ?
        (currentAmount > 0 ? 100 : 0) :
        ((currentAmount - previousAmount) / previousAmount * 100);

    return (
        <div className="relative w-full h-full">
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                        {currencySymbol}{formatCurrency(currentAmount)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#f2f4fa]">
                        <span className={isIncrease ? "text-green-500" : "text-red-500"} style={{ display: "flex", alignItems: "center" }}>
                            {isIncrease ?
                                <TrendingUp className="w-3 h-3 mr-0.5" /> :
                                <TrendingDown className="w-3 h-3 mr-0.5" />
                            }
                            {Math.abs(percentDiff).toFixed(1)}%
                        </span>
                        <span className="text-[#8993a4] ml-1">vs prev month</span>
                    </span>
                </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}