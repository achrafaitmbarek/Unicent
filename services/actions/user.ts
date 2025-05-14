'use server'

import { auth } from "@/auth"              
import { prisma } from "@/lib/prisma"                
import { InsightType, ReportType } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface UpdateUserPayload {
  name?: string
  reportTypes?: ReportType[]
  preferredInsightTypes?: InsightType[]
}

export async function updateUser(data: UpdateUserPayload) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated")
  }

  // find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isPremium: true },
  })
  if (!user) {
    throw new Error("User not found")
  }

  // enforce free user to only MONTHLY
  let finalReports = data.reportTypes
  if (!user.isPremium && data.reportTypes) {
    finalReports = [ReportType.MONTHLY]
  }
  
  // For free users, limit insight types to just one
  let finalInsightTypes = data.preferredInsightTypes
  if (!user.isPremium && data.preferredInsightTypes && data.preferredInsightTypes.length > 1) {
    // Only keep the first selected insight type
    finalInsightTypes = [data.preferredInsightTypes[0]]
  }

  const result = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      reportTypes: finalReports,
      preferredInsightTypes: finalInsightTypes,
    },
  })
  
  // Revalidate the profile page to show updated data
  revalidatePath('/dashboard/profile')
  
  return result
}