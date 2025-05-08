"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
} from "@/components/ui/chart"

interface MonthlySpendChartProps {
    data: {
        month: string;
        expenses: number;
        income: number;
    }[];
    currencySymbol: string;
}

export function MonthlySpendChart({ data, currencySymbol }: MonthlySpendChartProps) {
    // Transform data to match the expected format
    const chartData = data.map(item => ({
        month: item.month,
        expenses: item.expenses,
        income: item.income,
    }));

    // Chart configuration
    const chartConfig = {
        expenses: {
            label: "Expenses",
            color: "#ff784b",
        },
        income: {
            label: "Income",
            color: "#27c661",
        },
    } satisfies ChartConfig;

    return (
        <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-[#03091d]">Monthly Spend</h2>
                    <Button
                        variant="outline"
                        className="bg-[#fafcfa] text-[#747682] h-8 border-[#edf2f6] hover:bg-[#f2f4fa] hover:text-[#03091d]"
                        size="sm"
                    >
                        Monthly <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1">
                    <ChartContainer config={chartConfig} className="h-full">
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} stroke="#edf2f6" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#747682" }}
                                tickMargin={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#747682" }}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                            />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-[#03091d] text-white p-3 rounded-lg shadow-lg">
                                                <p className="text-sm font-medium">{payload[0].payload.month}</p>
                                                {payload.map((entry, index) => (
                                                    <div key={`tooltip-item-${index}`} className="flex items-center gap-2 mt-1">
                                                        <span
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: entry.color }}
                                                        />
                                                        <span>
                                                            {String(entry.name).charAt(0).toUpperCase() + String(entry.name).slice(1)}: <strong>
                                                                {`${currencySymbol}${Number(entry.value).toFixed(2)}`}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <ChartLegend content={<ChartLegendContent className="mt-3" />} />
                            <Bar
                                dataKey="expenses"
                                fill="var(--color-expenses)"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                            <Bar
                                dataKey="income"
                                fill="var(--color-income)"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}