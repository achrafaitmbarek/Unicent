"use server"

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"

export const login=async (values: z.infer<typeof LoginSchema>)=> {
    // Client-side validation can always be bypassed, that's why we need to validate on the server side as well
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields ! ' }
    }

    const { email } = validatedFields.data;
    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return { error: 'You don\'t have access to this space' };
        }

        await signIn("resend", { email: values.email, redirect: false });
        
        return {
            success: 'Please check your email for the verification link',
        };
    } catch (error) {
        console.error('Error during sign-in:', error);
        return { error: 'An error occurred during sign-in' };
    }
}