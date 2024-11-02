"use server"

import * as z from "zod"
import { RegisterSchema } from "@/schemas"
import { signIn } from "@/auth"
// import { prisma } from "@/lib/prisma"
import { getUserByEmail } from "@/data/user"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    // Client-side validation can always be bypassed, that's why we need to validate on the server side as well
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { email } = validatedFields.data;
    try {
    const existingUser = await getUserByEmail(email)


    if (existingUser) {
        return { error: 'User already exists' };
    }


        await signIn("resend", {email: values.email,
                                redirect:false});
        
        return {
            success: 'Please check your email for the verification link',
        };
    } catch (error) {
        console.error('Error during sign-in:', error);
        return { error: 'An error occurred during sign-in' };
    }
}