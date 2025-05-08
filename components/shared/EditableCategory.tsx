"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTransactionCategory } from "@/services/actions/transactions"


const categories = [

    { value: "SALARY", label: "Salary", group: "Income" },
    { value: "INVESTING", label: "Investing", group: "Income" },
    { value: "BUSINESS_INCOME", label: "Business Income", group: "Income" },
    { value: "RENTAL_INCOME", label: "Rental Income", group: "Income" },
    { value: "FREELANCE", label: "Freelance", group: "Income" },
    { value: "REFUND", label: "Refund", group: "Income" },
    { value: "PENSION", label: "Pension", group: "Income" },
    { value: "DIVIDEND", label: "Dividend", group: "Income" },
    { value: "GIFT_RECEIVED", label: "Gift Received", group: "Income" },
    { value: "INTEREST", label: "Interest", group: "Income" },

    { value: "SUBSCRIPTION", label: "Subscription", group: "Expense" },
    { value: "GROCERIES", label: "Groceries", group: "Expense" },
    { value: "SHOPPING", label: "Shopping", group: "Expense" },
    { value: "DINING", label: "Dining", group: "Expense" },
    { value: "TRANSPORTATION", label: "Transportation", group: "Expense" },
    { value: "UTILITIES", label: "Utilities", group: "Expense" },
    { value: "ENTERTAINMENT", label: "Entertainment", group: "Expense" },
    { value: "HOUSING", label: "Housing", group: "Expense" },
    { value: "HEALTHCARE", label: "Healthcare", group: "Expense" },
    { value: "EDUCATION", label: "Education", group: "Expense" },

    { value: "TRAVEL", label: "Travel", group: "Other" },
    { value: "TRANSFER", label: "Transfer", group: "Other" },
    { value: "OTHER", label: "Other", group: "Other" },
]

export function EditableCategory({
    transactionId,
    initialCategory,
    onUpdated,
}: {
    transactionId: string,
    initialCategory: string,
    onUpdated: () => void
}) {
    const [category, setCategory] = useState(initialCategory)
    const [isLoading, setIsLoading] = useState(false)

    const handleCategoryChange = async (newCategory: string) => {
        if (newCategory === category) return

        setIsLoading(true)
        try {
            await updateTransactionCategory(transactionId, newCategory)
            setCategory(newCategory)
            toast.success("Category updated")
            onUpdated()
        } catch {
            toast.error("Failed to update category")
            setCategory(initialCategory)
        } finally {
            setIsLoading(false)
        }
    }

    const getCategoryColorClass = (category: string): string => {
        switch (category?.toUpperCase()) {

            case "SALARY": return "bg-green-100 text-green-800 border-green-300"
            case "INVESTING": return "bg-emerald-100 text-emerald-800 border-emerald-300"
            case "BUSINESS_INCOME": return "bg-teal-100 text-teal-800 border-teal-300"
            case "RENTAL_INCOME": return "bg-lime-100 text-lime-800 border-lime-300"
            case "FREELANCE": return "bg-indigo-100 text-indigo-800 border-indigo-300"
            case "REFUND": return "bg-sky-100 text-sky-800 border-sky-300"
            case "PENSION": return "bg-blue-100 text-blue-800 border-blue-300"
            case "DIVIDEND": return "bg-violet-100 text-violet-800 border-violet-300"
            case "GIFT_RECEIVED": return "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300"
            case "INTEREST": return "bg-cyan-100 text-cyan-800 border-cyan-300"

            case "SUBSCRIPTION": return "bg-pink-100 text-pink-800 border-pink-300"
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
            case "TRANSFER": return "bg-sky-100 text-sky-800 border-sky-300"
            case "OTHER": return "bg-gray-100 text-gray-800 border-gray-300"

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
                <div className="font-semibold text-xs px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-b border-blue-200 sticky top-0 z-10">
                    Income Categories
                </div>
                {categories.filter(cat => cat.group === "Income").map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                    </SelectItem>
                ))}

                <div className="font-semibold text-xs px-3 py-1.5 mt-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-b border-orange-200 sticky top-0 z-10">
                    Expense Categories
                </div>
                {categories.filter(cat => cat.group === "Expense").map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                    </SelectItem>
                ))}

                <div className="font-semibold text-xs px-3 py-1.5 mt-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-b border-purple-200 sticky top-0 z-10">
                    Other Categories
                </div>
                {categories.filter(cat => cat.group === "Other").map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}