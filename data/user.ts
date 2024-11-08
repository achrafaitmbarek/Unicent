import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
    try{
        const user = await prisma.user.findUnique({
            where: {email},
            include:{accounts:true}
        })
        return user
    }catch{
        return null
    }
}

export const getUserById = async(id: string)=>{
    try{
        const user = await prisma.user.findUnique({
            where: { id },
            include: { accounts: true } 
        });
        return user
    }catch{
        return null
    }
}