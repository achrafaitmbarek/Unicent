import * as z from "zod"

export const LoginSchema = z.object({
    email:z.string().email({message:"Email is required"}),
})

export const RegisterSchema = z.object({
    email:z.string().email({message:"Email is required"}),
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
})