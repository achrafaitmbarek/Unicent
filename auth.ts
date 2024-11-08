import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  session:{
    strategy: 'jwt',
  },
  events:{
    async linkAccount ({user}){
      await prisma.user.update({
        where:{id:user.id},
        data:{emailVerified:new Date()}
      })
    }
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle redirect URLs
      if (url.startsWith(baseUrl)) return url;
      // Allows relative callback URLs
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    // Add other callbacks as needed
    async signIn({}) {
      return true;
  },
  },
})