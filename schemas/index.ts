import * as z from "zod"

export const LoginSchema = z.object({
    email:z.string().email({message:"Email is required"}),
})

export const RegisterSchema = z.object({
    email:z.string().email({message:"Email is required"}),
})