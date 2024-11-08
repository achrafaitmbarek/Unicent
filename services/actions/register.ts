"use server"

import * as z from "zod"
import { RegisterSchema } from "@/schemas"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { prisma } from "@/lib/prisma"



export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { email, name } = validatedFields.data;

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: 'User already exists',redirect: '/auth/login'  };
        }

        // Save temporary registration data
        await prisma.user.create({
            data: { email, name },
        });

        await signIn("resend", { email, redirect: false });

        return { success: 'Please check your email for the verification link' };
    } catch (error) {
        console.error('Error during registration:', error);
        return { error: 'An error occurred during registration' };
    }
};

export const  handleGoogleSignIn = async () => {
    await signIn("google", {
        callbackUrl: "/dashboard"
    })
}