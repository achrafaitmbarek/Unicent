import { getUserFinancialTips, saveFinancialTipsToDatabase } from "@/services/actions/financial-tips";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { TipType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    // Parse the URL to get query parameters
    const url = new URL(request.url);
    const tipTypeParam = url.searchParams.get('tipType') || 'DAILY_INSIGHT';
    
    // Convert string parameter to TipType enum
    let tipType: TipType;
    switch (tipTypeParam.toUpperCase()) {
      case 'GOAL_BASED':
        tipType = TipType.GOAL_BASED;
        break;
      case 'SPIKE':
        tipType = TipType.SPIKE;
        break;
      case 'DAILY_INSIGHT':
      default:
        tipType = TipType.DAILY_INSIGHT;
        break;
    }
    
    // Option 1: Save first, then return what's in the database
    try {
      const session = await auth();
      if (session?.user?.id) {
        await saveFinancialTipsToDatabase(tipType);
      }
    } catch (saveError) {
      console.error("Error saving tips to database:", saveError);
    }
    
    // Get tips from database to ensure consistency
    const databaseTips = await getUserFinancialTips(tipType);
    
    return NextResponse.json({ 
      tipType,
      tips: databaseTips,  // Return what's in the database
      saved: true 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}