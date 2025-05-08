import React, { ReactNode } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface GoalCardProps {
    icon: ReactNode;
    title: string;
    currentAmount: number;
    targetAmount: number;
    progress: number; // 0-100
    hasBackground?: boolean;
    onDelete?: () => void;
}

export function GoalCard({
    icon,
    title,
    currentAmount,
    targetAmount,
    progress,
    hasBackground = false,
    onDelete
}: GoalCardProps) {

    const formattedCurrent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(currentAmount);

    const formattedTarget = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(targetAmount);

    const dashOffset = 100 - progress;

    return (
        <div
            className={`
        rounded-xl p-5 h-auto flex flex-col relative
        ${hasBackground
                    ? "bg-primary text-white border-none"
                    : "border border-blue-100 text-gray-800"
                }
      `}
        >
            <div className="absolute top-3 right-3">
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <div className={`p-1 rounded-full hover:bg-opacity-10 hover:bg-black`}>
                            <MoreVertical
                                className={`h-4 w-4 ${hasBackground ? "text-white" : "text-gray-500"}`}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="mb-3">
                <div
                    className={`
            h-10 w-10 rounded-md flex items-center justify-center
            ${hasBackground
                            ? "bg-primary"
                            : "bg-[#F0EFFD]"
                        }
          `}
                >
                    {hasBackground
                        ? React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-white" })
                        : React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-primary-dark" })
                    }
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h3
                        className={`
              text-lg font-semibold mb-2
              ${hasBackground ? "text-white" : "text-gray-500"}
            `}
                    >
                        {title}
                    </h3>
                    <div>
                        <p
                            className={`
                text-xl font-extrabold 
                ${hasBackground ? "text-white" : "text-primary"}
              `}
                        >
                            <span>{formattedCurrent}</span>/
                            <span className={hasBackground ? "text-white/70" : "text-gray-500"}>
                                {formattedTarget}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="relative h-12 w-12">
                    <svg className="h-12 w-12" viewBox="0 0 36 36">
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke={hasBackground ? "#ffffff33" : "#e6e6e6"}
                            strokeWidth="2"
                        />

                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke={hasBackground ? "#ffffff" : "#4338CA"}
                            strokeWidth="2"
                            strokeDasharray="100"
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                        />

                        {progress > 0 && (
                            <circle
                                cx={18 + 16 * Math.cos((progress * 3.6 - 90) * Math.PI / 180)}
                                cy={18 + 16 * Math.sin((progress * 3.6 - 90) * Math.PI / 180)}
                                r="2"
                                fill={hasBackground ? "#ffffff" : "#4338CA"}
                            />
                        )}
                    </svg>
                    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                        <span
                            className={`
                             text-xs font-bold
                             ${hasBackground ? "text-white" : "text-[#4338CA]"}
                             `}
                        >
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}