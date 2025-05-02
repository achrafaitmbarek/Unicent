"use client"

import { useEffect, useRef } from "react"


interface IncomeChartProps {
    data: {
        month: string;
        income?: number;
        expense?: number;
        year: string;
    }[];
    currencySymbol: string;
    maxValue?: number;
}

export function IncomeChart({ data = [], currencySymbol = '€', maxValue: propMaxValue }: IncomeChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            ? data.map(item => (item.income !== undefined ? item.income : item.expense ?? 0))
            : [70, 60, 75, 55, 80, 65, 75, 60, 70];
        const maxValue = propMaxValue || (Math.max(...values) > 0 ? Math.max(...values) * 1.2 : 90);

        const chartWidth = rect.width;
        const chartHeight = rect.height - 30;
        const padding = { top: 20, right: 10, bottom: 30, left: 40 };
        const graphWidth = chartWidth - padding.left - padding.right;
        const graphHeight = chartHeight - padding.top - padding.bottom;

        ctx.clearRect(0, 0, chartWidth, chartHeight);

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.font = "10px Arial";
        ctx.fillStyle = "#8993a4";

        const yLabelCount = 5;
        const yLabels = Array.from({ length: yLabelCount }, (_, i) => {
            const value = (maxValue * i / (yLabelCount - 1)).toFixed(0);
            const numValue = parseInt(value);
            return numValue >= 1000 ? `${(numValue / 1000).toFixed(0)}k` : value;
        }).reverse();

        yLabels.forEach((label, i) => {
            const y = padding.top + (i / (yLabels.length - 1)) * graphHeight;
            ctx.fillText(label, padding.left - 5, y);
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        months.forEach((month, i) => {
            const x = padding.left + (i / (months.length - 1)) * graphWidth;
            ctx.fillText(month, x, chartHeight - padding.bottom + 5);
        });

        const currentMonthIndex = months.length - 1;
        if (currentMonthIndex !== -1) {
            const x = padding.left + (currentMonthIndex / (months.length - 1)) * graphWidth;
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = "#8993a4";
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + graphHeight);
            ctx.stroke();
            ctx.setLineDash([]);

            const y = padding.top + graphHeight - (values[currentMonthIndex] / maxValue) * graphHeight;

            ctx.fillStyle = "#01162c";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "bold 12px Arial";
            const formattedValue = currencySymbol + (values[currentMonthIndex] >= 1000
                ? (values[currentMonthIndex] / 1000).toFixed(1) + 'K'
                : values[currentMonthIndex].toFixed(0));
            ctx.fillText(formattedValue, x, padding.top - 10);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#01162c";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + graphHeight);

        values.forEach((value, i) => {
            const x = padding.left + (i / (values.length - 1)) * graphWidth;
            const y = padding.top + graphHeight - (value / maxValue) * graphHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = padding.left + ((i - 1) / (values.length - 1)) * graphWidth;
                const prevY = padding.top + graphHeight - (values[i - 1] / maxValue) * graphHeight;

                const cpX1 = prevX + (x - prevX) / 3;
                const cpX2 = prevX + (2 * (x - prevX)) / 3;

                ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
            }
        });

        const lastX = padding.left + graphWidth;
        ctx.lineTo(lastX, padding.top + graphHeight);
        ctx.lineTo(padding.left, padding.top + graphHeight);

        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphHeight);
        gradient.addColorStop(0, "rgba(53, 101, 151, 0.2)");
        gradient.addColorStop(1, "rgba(53, 101, 151, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        values.forEach((value, i) => {
            const x = padding.left + (i / (values.length - 1)) * graphWidth;
            const y = padding.top + graphHeight - (value / maxValue) * graphHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = padding.left + ((i - 1) / (values.length - 1)) * graphWidth;
                const prevY = padding.top + graphHeight - (values[i - 1] / maxValue) * graphHeight;

                const cpX1 = prevX + (x - prevX) / 3;
                const cpX2 = prevX + (2 * (x - prevX)) / 3;

                ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
            }
        });

        ctx.strokeStyle = "#356597";
        ctx.lineWidth = 2;
        ctx.stroke();
    }, [data, currencySymbol, propMaxValue]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
}