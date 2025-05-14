"use client";

import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// Default data
const defaultChartData = [
    { name: "Housing", value: 35, color: "#3b82f6" },
    { name: "Food & Dining", value: 18, color: "#10b981" },
    { name: "Transportation", value: 13, color: "#f59e0b" },
    { name: "Shopping", value: 11, color: "#8b5cf6" },
    { name: "Entertainment", value: 10, color: "#ec4899" },
    { name: "Others", value: 13, color: "#6b7280" },
];

interface ChartItem {
    name: string;
    value: number;
    color: string;
}

interface PieDonutProps {
    data?: ChartItem[];
    centerText?: string;
    centerLabel?: string;
}

export function PieDonutShadcn({ data = defaultChartData, centerText, centerLabel = "Expenses" }: PieDonutProps) {
    // Use provided data or default
    const chartData = data.map(item => ({
        category: item.name,
        value: item.value,
        fill: item.color
    }));

    // Create dynamic config based on data
    const configEntries = chartData.reduce((acc, item) => {
        acc[item.category] = {
            label: item.category,
            color: item.fill,
        };
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>);

    // Add the value key config
    const chartConfig = {
        value: {
            label: "Value",
        },
        ...configEntries
    } as ChartConfig;

    // Calculate total for center text if not provided
    const totalValue = centerText || chartData.reduce((acc, item) => acc + item.value, 0).toString();

    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={0}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }: PieSectorDataItem) => (
                                <Sector {...props} outerRadius={outerRadius + 10} />
                            )}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalValue}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                    {centerLabel}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
        </div>
    );
}