"use server"

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { rateLimiter } from "@/lib/rate-limit"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    // Client-side validation can always be bypassed, that's why we need to validate on the server side as well
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { email } = validatedFields.data;

    const canProceed = await rateLimiter(email);
    if (!canProceed) {
        return { error: 'Too many requests. Please try again later ' }
    }
    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {

            return { error: 'User does not exist. Redirecting to the registration page...', redirect: '/auth/register' }
        }
        const googleAccount = existingUser.accounts.find((account) => account.provider === "google");
        if (googleAccount) {
            return { error: 'User exists with Google. Please log in with Google.'}}

        await signIn("resend", {
            email: values.email,
            redirect: false
        });
        
        return { success: 'Please check your email for the verification link' }
    } catch (error) {
        console.error('Error during login:', error);
        return { error: 'An error occurred during login' }
    }
}
export const  handleGoogleSignIn = async () => {
    
    await signIn("google", {
        callbackUrl: "/dashboard"
    })
}