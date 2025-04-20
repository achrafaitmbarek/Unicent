import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { categorizeTransaction } from "../lib/categorizeTransaction";

async function testCategorizationFunction() {
  console.log("🏦 Testing transaction categorization with Claude...\n");
  console.log("API Key:", process.env.ANTHROPIC_API_KEY ? "✅ Found" : "❌ Missing");
  

  
  const testTransactions = [
    { description: "NETFLIX MONTHLY", amount: 14.99, type: "card" },
    { description: "ALDI SUPERMARKET", amount: 87.32, type: "card" },
    { description: "UBER TRIP", amount: 23.45, type: "card" },
    { description: "VERIZON WIRELESS", amount: 89.99, type: "direct_debit" },
    { description: "AMZ*AMAZON.COM", amount: 156.78, type: "card" },
    { description: "TRANSFER TO VANGUARD", amount: 500.00, type: "transfer" },
    { description: "STARBUCKS", amount: 4.95, type: "card" },
    { description: "CHEVRON GAS", amount: 45.00, type: "card" },
    { description: "APPLE ITUNES", amount: 9.99, type: "card" }
  ];
  
  for (const tx of testTransactions) {
    process.stdout.write(`🔍 "${tx.description}" for ${tx.amount}... `);
    try {
      const category = await categorizeTransaction(tx.description, tx.amount, tx.type);
      console.log(`✅ Categorized as: ${category}`);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

testCategorizationFunction()
  .then(() => console.log("\n✨ All tests completed!"))
  .catch(err => console.error("\n💥 Test failed:", err));