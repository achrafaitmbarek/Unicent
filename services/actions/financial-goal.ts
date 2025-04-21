"use server";

import { FinancialGoalSchema } from "@/schemas";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Category, FinancialGoal } from "@prisma/client";

type CreateFinancialGoalResponse = {
  success: boolean;
  data?: z.infer<typeof FinancialGoalSchema>;
  error?: string;
};

type GetFinancialGoalResponse = {
  success: boolean;
  data?:FinancialGoal[];
  error?: string;
}
type DeleteFinancialGoalResponse = {
  success: boolean;
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

    revalidatePath("/dashboard/analytics/financial-planning");

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

export async function getUserFinancialGoals():Promise<GetFinancialGoalResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to fetch financial goals",
      };
    }

    const financialGoals = await prisma.financialGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: financialGoals,
    };
  } catch (error) {
    console.error("Error fetching financial goals:", error);
    return {
      success: false,
      error: "Failed to fetch financial goals. Please try again.",
    };
  }
}

export async function deleteFinancialGoal(goalId: string): Promise<DeleteFinancialGoalResponse> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete a financial goal",
      };
    }

    const goal = await prisma.financialGoal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      return {
        success: false,
        error: "Financial goal not found",
      };
    }

    if (goal.userId !== session.user.id) {
      return {
        success: false,
        error: "You can only delete your own financial goals",
      };
    }

    await prisma.financialGoal.delete({
      where: { id: goalId },
    });

    revalidatePath("/dashboard/analytics/financial-planning");

    return { success: true };
  } catch (error) {
    console.error("Error deleting financial goal:", error);
    return {
      success: false,
      error: "Failed to delete financial goal. Please try again.",
    };
  }
}