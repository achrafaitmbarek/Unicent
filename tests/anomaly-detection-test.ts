import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { testAnomalyDetection } from "../lib/detectAnomalousTransactions";

async function runTest() {
  console.log("🏦 Testing transaction anomaly detection with Claude...\n");
  console.log("API Key:", process.env.ANTHROPIC_API_KEY ? "✅ Found" : "❌ Missing");
  
  const result = await testAnomalyDetection();
  
  if (result.success) {
    console.log("\n✅ Test completed successfully!");
    console.log(`Analyzed ${result.totalTransactions} transactions`);
    console.log(`Found ${result.anomaliesDetected} anomalies`);
    
    if (result.anomaliesDetected > 0) {
      console.log("\nAnomaly Details:");
      for (const anomaly of result.anomalies) {
        console.log(`\n🚨 Anomaly (${anomaly.riskLevel} risk):`);
        console.log(`   ID: ${anomaly.id}`);
        console.log(`   Reason: ${anomaly.reason}`);
        if (anomaly.recommendedAmount) {
          console.log(`   Recommended Amount: $${anomaly.recommendedAmount.toFixed(2)}`);
        }
      }
    }
  } else {
    console.error("❌ Test failed:", result.error);
  }
}

runTest()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("\n💥 Test failed with error:", err);
    process.exit(1);
  });