import { prisma } from "../lib/prisma";
import { categorizeTransaction } from "../lib/categorizeTransaction";

async function categorizeRealTransactions() {
  console.log("🏦 Testing transaction categorization with real transaction data...\n");
  
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        flow: 'EXPENSE' 
      },
      orderBy: {
        date: 'desc' 
      },
      take: 10,
      include: {
        account: {
          select: {
            currencySymbol: true
          }
        }
      }
    });
    
    console.log(`Found ${transactions.length} transactions to categorize.\n`);
    
    console.log("| Description | Amount | Type | Category |");
    console.log("|------------|--------|------|----------|");
    
    for (const tx of transactions) {
      try {

        const category = await categorizeTransaction(tx.wording, Math.abs(tx.value), tx.type);
        
        console.log(`| ${tx.wording.substring(0, 20).padEnd(20)} | ${tx.account.currencySymbol}${Math.abs(tx.value).toFixed(2)} | ${tx.type.padEnd(6)} | ${category} |`);
      } catch (error) {
        console.error(`❌ Error categorizing transaction "${tx.wording}": ${error}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
  }
}

categorizeRealTransactions()
  .then(() => {
    console.log("\n✨ Categorization completed!");
    process.exit(0);
  })
  .catch(err => {
    console.error("\n💥 Script failed:", err);
    process.exit(1);
  });