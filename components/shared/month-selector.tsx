"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function MonthSelector({
    currentMonth,
    currentYear,
    isPremium = false
}: {
    currentMonth: number;
    currentYear: number;
    isPremium?: boolean;
}) {
    const router = useRouter();

    const today = new Date();
    const currentSystemMonth = today.getMonth() + 1;
    const currentSystemYear = today.getFullYear();

    const maxMonthsBack = isPremium ? 3 : 1;

    const formatMonthYear = (month: number, year: number) => {
        return new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        let newMonth = currentMonth;
        let newYear = currentYear;

        if (direction === 'prev') {
            newMonth--;
            if (newMonth < 1) {
                newMonth = 12;
                newYear--;
            }

            const monthsBack = (currentSystemYear - newYear) * 12 + (currentSystemMonth - newMonth);
            if (monthsBack > maxMonthsBack) {
                return;
            }
        } else {
            newMonth++;
            if (newMonth > 12) {
                newMonth = 1;
                newYear++;
            }

            if (newYear > currentSystemYear || (newYear === currentSystemYear && newMonth > currentSystemMonth)) {
                return;
            }
        }

        router.push(`/dashboard/ai-insights/smart-budget?month=${newMonth}&year=${newYear}`);
    };

    const monthsBack = (currentSystemYear - currentYear) * 12 + (currentSystemMonth - currentMonth);
    const isPrevDisabled = monthsBack >= maxMonthsBack;

    const isNextDisabled = (currentYear === currentSystemYear && currentMonth === currentSystemMonth);

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
                disabled={isPrevDisabled}
                className="h-8 w-8"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm font-medium">
                {formatMonthYear(currentMonth, currentYear)}
            </span>

            <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
                disabled={isNextDisabled}
                className="h-8 w-8"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            {!isPremium && (
                <span className="ml-2 text-xs text-gray-500">
                    (Limited to last 1 month)
                </span>
            )}
        </div>
    );
}