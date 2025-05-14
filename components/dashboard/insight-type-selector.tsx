"use client"

import { useState } from "react"
import { InsightType } from "@prisma/client"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from 'sonner'
import { updateUser } from "@/services/actions/user"

interface InsightTypeSelectorProps {
    initialInsightTypes: InsightType[]
    isPremium: boolean
}

export function InsightTypeSelector({ initialInsightTypes, isPremium }: InsightTypeSelectorProps) {
    const [selectedTypes, setSelectedTypes] = useState<InsightType[]>(initialInsightTypes || [InsightType.SAVINGS])

    const handleValueChange = async (types: string[]) => {
        // Ensure at least one type is selected
        if (types.length === 0) return

        const validTypes = types as InsightType[]
        setSelectedTypes(validTypes)

        try {
            await updateUser({ preferredInsightTypes: validTypes })
            toast.success("Your insight preferences have been updated")
        } catch (error) {
            toast.error("Failed to update your preferences", {
                description: error instanceof Error ? error.message : String(error)
            })
            setSelectedTypes(initialInsightTypes)
        }
    }

    return (
        <ToggleGroup
            type="multiple"
            value={selectedTypes}
            onValueChange={handleValueChange}
            className="flex flex-wrap gap-2"
        >
            {Object.values(InsightType).map((type) => (
                <ToggleGroupItem
                    key={type}
                    value={type}
                    disabled={!isPremium && selectedTypes.includes(type) && selectedTypes.length === 1}
                    className="px-4 py-1.5 bg-[#f5f6f7] text-sm data-[state=on]:bg-blue-200"
                >
                    {type.replace("_", " ")}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}