import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn("⚠️ No Anthropic API key found in environment variables");
}


const anthropic = new Anthropic({
  apiKey,
});

export async function categorizeTransaction(description: string, amount: number, type: string) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", 
      max_tokens: 10,
      temperature: 0.2,
      system: "You are a financial transaction categorizer. Return only the category name, nothing else.",
      messages: [{
        role: "user",
        content: `Categorize this transaction: "${description}" for ${amount}, type: ${type}. 
        Categories: SALARY, INVESTING, BUSINESS_INCOME, RENTAL_INCOME, FREELANCE, REFUND, PENSION, DIVIDEND, 
        GIFT_RECEIVED, INTEREST, SUBSCRIPTION, GROCERIES, SHOPPING, DINING, TRANSPORTATION, UTILITIES, 
        ENTERTAINMENT, HOUSING, HEALTHCARE, EDUCATION, TRAVEL, TRANSFER, OTHER.`
      }]
    });
    
    if ('text' in response.content[0]) {
      return response.content[0].text.trim();
    }
    return "Other"; 
  } catch (error) {
    console.error("Error categorizing transaction:", error);
    return "Other"; 
  }
}