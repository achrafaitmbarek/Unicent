
import { getFinancialTips } from "../services/actions/financial-tips";

async function testFinancialTips() {
  console.log("🧪 Testing Financial Tips functionality...");
  
  try {
    console.log("📊 Fetching financial tips...");
    const tips = await getFinancialTips();
    
    console.log("\n✅ Successfully generated financial tips:");
    console.log("----------------------------------------");
    
    tips.forEach((tip, index) => {
      console.log(`\n📌 TIP ${index + 1}: ${tip.title}`);
      console.log(`   ${tip.description}`);
    });
    
    console.log("\n----------------------------------------");
    return tips;
  } catch (error) {
    console.error("❌ Error testing financial tips:", error);
    process.exit(1);
  }
}

testFinancialTips()
  .then(() => {
    console.log("✨ Test completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test failed:", error);
    process.exit(1);
  });