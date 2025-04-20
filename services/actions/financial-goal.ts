"use server";

import { FinancialGoalSchema } from "@/schemas";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Category } from "@prisma/client";

type CreateFinancialGoalResponse = {
  success: boolean;
  data?: z.infer<typeof FinancialGoalSchema>;
  error?: string;
};

export async function createFinancialGoal(
  formData: z.infer<typeof FinancialGoalSchema>
): Promise<CreateFinancialGoalResponse> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to create a financial goal",
      };
    }

    const validatedData = FinancialGoalSchema.parse({
      ...formData,
      userId: session.user.id,
    });

    const financialGoal = await prisma.financialGoal.create({
      data: {
        name: validatedData.name,
        amount: validatedData.amount,
        targetDate: validatedData.targetDate,
        category: validatedData.category as Category,
        monthlyAllocationPct: validatedData.monthlyAllocationPct,
        userId: validatedData.userId,
      },
    });

    revalidatePath("/dashboard/goals");

    return {
      success: true,
      data: financialGoal,
    };
  } catch (error) {
    console.error("Error creating financial goal:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error: " + error.errors.map(e => e.message).join(", "),
      };
    }
    
    return {
      success: false,
      error: "Failed to create financial goal. Please try again.",
    };
  }
}