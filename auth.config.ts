import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";

export default {
    providers:[
        Resend({
            from: process.env.AUTH_RESEND_FROM
        })
    ]
} satisfies NextAuthConfig;