import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateFinancialPredictions } from "@/services/actions/financial-predictions";
import { generateFinancialReport, getFinancialReportData } from "@/services/actions/financial-report";

/**
 * Test API route for financial predictions and reports
 * Allows testing various financial functions without UI integration
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action") || "all";
    const month = searchParams.get("month") ? parseInt(searchParams.get("month") as string) : undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year") as string) : undefined;
    
    // Perform authentication check (required for all actions)
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const results: Record<string, unknown> = {};
    
    // Execute requested action(s)
    if (action === "all" || action === "predictions") {
      // Generate financial predictions
      console.log(`Generating financial predictions for ${month}/${year || "current"}`);
      const predictions = await generateFinancialPredictions(month, year);
      results.predictions = predictions;
    }
    
    if (action === "all" || action === "report") {
      // Generate complete financial report
      console.log(`Generating financial report`);
      const report = await generateFinancialReport();
      results.report = report;
    }
    
    if (action === "all" || action === "data") {
      // Get financial data
      console.log(`Getting financial data for ${month}/${year || "current"}`);
      const data = await getFinancialReportData(month, year);
      results.data = data;
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred during testing";
    const errorStack = error instanceof Error && process.env.NODE_ENV === "development" ? error.stack : undefined;
    
    console.error("Error testing financial functions:", error);
    return NextResponse.json(
      { 
        error: errorMessage, 
        stack: errorStack
      },
      { status: 500 }
    );
  }
}