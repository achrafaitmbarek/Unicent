import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { html, text } from "@/utils/email";

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Resend({
            from: "notifications@eloken.com", // Use Resend's default sender
            server: {
                host: 'smtp.resend.com',
                port: 465,
                auth: {
                    user: 'resend',
                    pass: process.env.AUTH_RESEND_KEY,
                }
            },
            sendVerificationRequest: async ({ identifier: email, url, provider, theme }) => {
                const { host } = new URL(url);
                const res = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${provider.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: provider.from,
                        to: email,
                        subject: `Sign in to ${host}`,
                        html: html({ url, host, theme }),
                        text: text({ url, host }),
                    }),
                });

                if (!res.ok) {
                    throw new Error("Resend error: " + JSON.stringify(await res.json()));
                }
            },
        })
    ]
} satisfies NextAuthConfig;