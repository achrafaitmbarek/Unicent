import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSpendingOptimizationReport } from "@/services/actions/spending-optimization";

export async function GET(request: Request) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const month = url.searchParams.get('month') ? 
      parseInt(url.searchParams.get('month')!) : undefined;
    const year = url.searchParams.get('year') ? 
      parseInt(url.searchParams.get('year')!) : undefined;

    // Get the report data
    const report = await getSpendingOptimizationReport(month, year);
    
    // Return formatted response
    return NextResponse.json({
      month: report.month,
      year: report.year,
      totalCurrentSpending: report.totalCurrentSpending,
      totalRecommendedSpending: report.totalRecommendedSpending,
      totalPotentialSavings: report.totalPotentialSavings,
      recommendations: report.recommendations
    });
  } catch (error) {
    console.error("Error in spending optimization API:", error);
    return NextResponse.json(
      { error: "Failed to generate spending optimization report" }, 
      { status: 500 }
    );
  }
}