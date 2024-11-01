import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";
import { sendVerificationRequest } from "@/utils/authSendRequest";

export default {
    providers:[
        Resend({
            from: process.env.AUTH_RESEND_FROM,
            sendVerificationRequest
        })
    ]
} satisfies NextAuthConfig;