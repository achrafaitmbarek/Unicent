import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { prisma } from '../lib/prisma';
import { storeTransactions } from '../services/actions/store-bank-data';

async function testTransactionCategorization() {
  console.log("🔄 Testing transaction categorization directly...\n");
  
  try {
    // 1. Get the most recently active connection
    const connection = await prisma.bankConnection.findFirst({
      where: {
        accessToken: { not: null }
      },
      orderBy: { lastRefresh: 'desc' },
      include: {
        user: true
      }
    });
    
    if (!connection) {
      console.error("❌ No active bank connection found");
      return;
    }
    
    console.log(`Found connection for user: ${connection.user.email}`);
    
    // 2. Get an account from this connection
    const account = await prisma.bankAccount.findFirst({
      where: { connectionId: connection.id }
    });
    
    if (!account) {
      console.error("❌ No bank accounts found for this connection");
      return;
    }
    
    console.log(`Using account: ${account.name} (ID: ${account.id})`);
    
    // 3. Fetch sample transactions directly from the API
    console.log("Fetching transactions from API...");
    
    const url = `https://unicenttest-sandbox.biapi.pro/2.0/users/me/accounts/${account.id}/transactions/?limit=20`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${connection.accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ API Error (${response.status}): ${await response.text()}`);
      return;
    }
    
    const data = await response.json();
    
    if (!data.transactions || !data.transactions.length) {
      console.log("No transactions returned from API");
      return;
    }
    
    console.log(`Found ${data.transactions.length} transactions, categorizing...`);
    
    // 4. Process a few transactions with full categorization
    const samplesToProcess = data.transactions.slice(0, 5);
    
    // Count existing transactions before process
    const beforeCount = await prisma.transaction.count({
      where: { accountId: account.pk }
    });
    
    // Process transactions through the categorization function
    await storeTransactions(account.pk, samplesToProcess);
    
    // Count after processing
    const afterCount = await prisma.transaction.count({
      where: { accountId: account.pk }
    });
    
    console.log(`Transactions processed: ${afterCount - beforeCount}`);
    
    // 5. Check the categorization results
    const categorizedTransactions = await prisma.transaction.findMany({
      where: {
        accountId: account.pk,
        id: {
          in: samplesToProcess.map(tx => tx.id)
        }
      },
      select: {
        wording: true,
        value: true,
        category: true
      }
    });
    
    console.log("\n📊 Categorization results:");
    console.table(
      categorizedTransactions.map(tx => ({
        Description: tx.wording.substring(0, 30),
        Amount: Math.abs(tx.value),
        Category: tx.category
      }))
    );
  } catch (error) {
    console.error("💥 Error during test:", error);
  }
}

// Run the test
testTransactionCategorization()
  .then(() => {
    console.log("\n✨ Test completed!");
    process.exit(0);
  })
  .catch(err => {
    console.error("\n💥 Test failed:", err);
    process.exit(1);
  });