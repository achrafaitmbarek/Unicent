"use client"

import { useState } from "react"
import { ReportType } from "@prisma/client"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from 'sonner'
import { updateUser } from "@/services/actions/user"
import { Info } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ReportTypeSelectorProps {
    initialReportTypes: ReportType[]
    isPremium: boolean
}

export function ReportTypeSelector({ initialReportTypes, isPremium }: ReportTypeSelectorProps) {
    const [selectedTypes, setSelectedTypes] = useState<ReportType[]>(initialReportTypes || [ReportType.MONTHLY])

    const handleValueChange = async (types: string[]) => {
        // For free users, only allow MONTHLY
        if (!isPremium) {
            toast.info("Upgrade to premium to access more report types")
            return
        }

        // Ensure at least one type is selected
        if (types.length === 0) return

        const validTypes = types as ReportType[]
        setSelectedTypes(validTypes)

        try {
            await updateUser({ reportTypes: validTypes })
            toast.success("Your report preferences have been updated")
        } catch (error) {
            toast.error("Failed to update your preferences", {
                description: error instanceof Error ? error.message : String(error)
            })
            setSelectedTypes(initialReportTypes)
        }
    }

    return (
        <div>
            <ToggleGroup
                type="multiple"
                value={selectedTypes}
                onValueChange={handleValueChange}
                className="flex flex-wrap gap-2"
            >
                {Object.values(ReportType).map((type) => (
                    <ToggleGroupItem
                        key={type}
                        value={type}
                        disabled={!isPremium && type !== ReportType.MONTHLY}
                        className="px-4 py-1.5 bg-[#f5f6f7] text-sm data-[state=on]:bg-blue-200"
                    >
                        {type}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            {!isPremium && (
                <div className="flex items-center mt-2 text-xs text-[#8f939f]">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-3 w-3 mr-1" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Free users can only select Monthly reports.<br />Upgrade to Premium for all report types.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span>Upgrade to Premium to access all report types</span>
                </div>
            )}
        </div>
    )
}