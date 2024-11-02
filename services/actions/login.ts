"use server"

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"

export const login = async (values: z.infer<typeof LoginSchema>)=> {
    // Client-side validation can always be bypassed, that's why we need to validate on the server side as well
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields ! ' }
    }

    const signInResult = await signIn("resend", values)
    return {
        success: 'Please check your email for the verification link',
        signInResult
    } 
}