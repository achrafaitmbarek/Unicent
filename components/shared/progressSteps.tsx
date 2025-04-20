"use client"

import * as React from "react"
import { ChevronDown, Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressStepProps {
    steps: {
        id: number
        label: string
    }[]
    currentStep: number
    className?: string
}

export function ProgressSteps({
    steps,
    currentStep,
    className
}: ProgressStepProps) {
    return (
        <div className={cn("w-full max-w-4xl mx-auto", className)}>
            <div className="relative">
                <div
                    className="absolute ml-11 -top-6 transition-all duration-300"
                    style={{
                        left: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 8px)`,
                        display: currentStep > steps.length ? 'none' : 'block'
                    }}
                >
                    <ChevronDown className="h-6 w-6 text-primary" />
                </div>

                <div className="relative flex justify-between items-center">
                    {/* Background track */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gray-200"></div>

                    <div
                        className="absolute left-0 h-0.5 bg-primary transition-all duration-300"
                        style={{
                            width: `${Math.max(0, Math.min(100, ((currentStep - 1) / (steps.length - 1)) * 100))}%`
                        }}
                    ></div>

                    {steps.map((step) => (
                        <div key={step.id} className="relative flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-200",
                                    step.id < currentStep
                                        ? "bg-primary border-primary text-white"
                                        : step.id === currentStep
                                            ? "bg-primary border-primary text-white"
                                            : "bg-white border-gray-300 text-gray-500"
                                )}
                            >
                                {step.id < currentStep ? (
                                    <Check className="h-5 w-5" />
                                ) : step.id === currentStep && step.label.toLowerCase().includes("wait") ? (
                                    <Clock className="h-5 w-5" />
                                ) : (
                                    <span className="text-sm font-medium">{step.id}</span>
                                )}
                            </div>

                            <span
                                className={cn(
                                    "mt-2 text-sm text-center max-w-[120px]",
                                    step.id === currentStep ? "font-medium text-primary" : "text-gray-500"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}