import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Resend({
            from: "onboarding@resend.dev", // Use Resend's default sender
            server: {
                host: 'smtp.resend.com',
                port: 465,
                auth: {
                    user: 'resend',
                    pass: process.env.AUTH_RESEND_KEY,
                }
            },
        })
    ]
} satisfies NextAuthConfig;