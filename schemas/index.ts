import * as z from "zod"
import { Category } from "@prisma/client"

export const LoginSchema = z.object({
    email:z.string().email({message:"Email is required"}),
})

export const RegisterSchema = z.object({
    email:z.string().email({message:"Email is required"}),
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
})

export const FinancialGoalSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    amount: z.number().positive({ message: "Amount must be a positive number" }),
    targetDate: z.date(),
    category: z.nativeEnum(Category),
    monthlyAllocationPct: z.number().min(0).max(100, { message: "Percentage must be between 0 and 100" }),
    userId: z.string(),
})