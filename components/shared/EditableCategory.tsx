"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTransactionCategory } from "@/services/actions/transactions"
import { useRouter } from "next/navigation"

// All available categories from our schema
const categories = [
    { value: "SUBSCRIPTION", label: "Subscription" },
    { value: "INVESTING", label: "Investing" },
    { value: "GROCERIES", label: "Groceries" },
    { value: "SHOPPING", label: "Shopping" },
    { value: "DINING", label: "Dining" },
    { value: "TRANSPORTATION", label: "Transportation" },
    { value: "UTILITIES", label: "Utilities" },
    { value: "ENTERTAINMENT", label: "Entertainment" },
    { value: "HOUSING", label: "Housing" },
    { value: "HEALTHCARE", label: "Healthcare" },
    { value: "EDUCATION", label: "Education" },
    { value: "TRAVEL", label: "Travel" },
    { value: "OTHER", label: "Other" },
]

export function EditableCategory({
    transactionId,
    initialCategory
}: {
    transactionId: string,
    initialCategory: string
}) {
    const [category, setCategory] = useState(initialCategory)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCategoryChange = async (newCategory: string) => {
        if (newCategory === category) return

        setIsLoading(true)
        try {
            await updateTransactionCategory(transactionId, newCategory)
            setCategory(newCategory)
            toast.success("Category updated")
            router.refresh()
        } catch {
            toast.error("Failed to update category")
            setCategory(initialCategory)
        } finally {
            setIsLoading(false)
        }
    }

    const getCategoryColorClass = (category: string): string => {
        switch (category?.toUpperCase()) {
            case "SUBSCRIPTION": return "bg-blue-100 text-blue-800 border-blue-300"
            case "INVESTING": return "bg-green-100 text-green-800 border-green-300"
            case "GROCERIES": return "bg-emerald-100 text-emerald-800 border-emerald-300"
            case "SHOPPING": return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "DINING": return "bg-purple-100 text-purple-800 border-purple-300"
            case "TRANSPORTATION": return "bg-cyan-100 text-cyan-800 border-cyan-300"
            case "UTILITIES": return "bg-amber-100 text-amber-800 border-amber-300"
            case "ENTERTAINMENT": return "bg-pink-100 text-pink-800 border-pink-300"
            case "HOUSING": return "bg-slate-100 text-slate-800 border-slate-300"
            case "HEALTHCARE": return "bg-teal-100 text-teal-800 border-teal-300"
            case "EDUCATION": return "bg-indigo-100 text-indigo-800 border-indigo-300"
            case "TRAVEL": return "bg-orange-100 text-orange-800 border-orange-300"
            default: return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }

    const getLabel = (value: string) => {
        return categories.find(c => c.value === value?.toUpperCase())?.label ||
            (value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "Other")
    }

    return (
        <Select
            value={category}
            onValueChange={handleCategoryChange}
            disabled={isLoading}
        >
            <SelectTrigger className={`h-8 text-xs ${getCategoryColorClass(category)}`}>
                <SelectValue placeholder={getLabel(category)} />
            </SelectTrigger>
            <SelectContent>
                {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}