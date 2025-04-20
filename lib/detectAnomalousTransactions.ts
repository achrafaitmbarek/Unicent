import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';
import { Transaction } from '@prisma/client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type AnomalyResult = {
  id: string;
  isUnusual: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
  recommendedAmount: number | null;
};

export async function detectAnomalies(transactions: Transaction[]) {
  try {
    // Format transactions for Claude
    const formattedTransactions = transactions.map(tx => ({
      id: tx.pk,
      description: tx.wording,
      amount: tx.value,
      category: tx.category,
      date: tx.date.toISOString().split('T')[0],
      type: tx.type
    }));
    
    // Ask Claude to analyze the transactions
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.2,
      system: `You are a financial anomaly detection system. Analyze transactions to identify unusual spending patterns.
      For each anomaly:
      1. Identify the transaction ID
      2. Assign a risk level (LOW, MEDIUM, HIGH)
      3. Explain why it's unusual
      4. If spending is excessive, suggest a reasonable amount
      
      Format as JSON array of anomalies. If no anomalies, return empty array.`,
      messages: [{
        role: "user",
        content: `Analyze these ${transactions.length} transactions and identify any unusual activity:
        ${JSON.stringify(formattedTransactions, null, 2)}
        
        Return a JSON array of anomalous transactions in this format:
        [
          {
            "id": "transaction_pk",
            "isUnusual": true,
            "riskLevel": "MEDIUM", 
            "reason": "Amount is 3x higher than typical for this category",
            "recommendedAmount": 50.00
          }
        ]`
      }]
    });
    
    // Extract JSON from Claude's response
    const contentBlock = response.content[0];
    const content = 'type' in contentBlock && contentBlock.type === 'text' ? contentBlock.text : '';
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']') + 1;
    
    if (jsonStart === -1) {
      console.log("No JSON array found in Claude's response");
      console.log("Full response:", content);
      return [];
    }
    
    const jsonContent = content.substring(jsonStart, jsonEnd);
    const anomalies: AnomalyResult[] = JSON.parse(jsonContent);
    
    return anomalies;
  } catch (error) {
    console.error("Error detecting anomalies:", error);
    return [];
  }
}

// Test function
export async function testAnomalyDetection() {
  console.log("🔍 Testing transaction anomaly detection...");
  
  try {
    // Get 10 most recent transactions
    const transactions = await prisma.transaction.findMany({
      take: 20,
      orderBy: { date: 'desc' },
      include: { account: true }
    });
    
    console.log(`Found ${transactions.length} transactions to analyze`);
    
    const anomalies = await detectAnomalies(transactions);
    console.log(`\nDetected ${anomalies.length} anomalies:`);
    console.table(anomalies);
    
    // Update transactions with anomaly information
    if (anomalies.length > 0) {
      for (const anomaly of anomalies) {
        await prisma.transaction.update({
          where: { pk: anomaly.id },
          data: {
            isUnusual: true,
            riskLevel: anomaly.riskLevel,
            anomalyReason: anomaly.reason,
            recommendedAmount: anomaly.recommendedAmount
          }
        });
        console.log(`Updated transaction ${anomaly.id} in database`);
      }
    }
    
    return {
      success: true,
      totalTransactions: transactions.length,
      anomaliesDetected: anomalies.length,
      anomalies
    };
  } catch (error) {
    console.error("Error in anomaly detection test:", error);
    return { success: false, error };
  }
}