import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import SupabaseProvider from "next-auth/providers/supabase"
import prisma from "./lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    SupabaseProvider({
      clientId: process.env.SUPABASE_CLIENT_ID!,
      clientSecret: process.env.SUPABASE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
})