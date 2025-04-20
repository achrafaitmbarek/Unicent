import { categorizeTransaction } from '@/lib/categorizeTransaction';
import { prisma } from '@/lib/prisma';
import { BankAccount, Transaction } from '@/types'; 
import { TransactionCategory } from '@prisma/client';

/**
 * Example function to store/ update accounts in the DB.
 * Assumes you already fetched data from the API.
 */
export async function storeBankAccounts(connectionId: string, accounts: BankAccount[]) {
  for (const account of accounts) {
    await prisma.bankAccount.upsert({
      where: {
        connectionId_id: {
          connectionId: connectionId,
          id: account.id
        }
      },
      update: {
        number: account.number,
        balance: account.balance,
        name: account.name,
        iban: account.iban,
        currencyId: account.currency.id,
        currencySymbol: account.currency.symbol,
        updatedAt: new Date()
      },
      create: {
        connectionId: connectionId,
        id: account.id,
        number: account.number,
        balance: account.balance,
        name: account.name,
        iban: account.iban,
        currencyId: account.currency.id,
        currencySymbol: account.currency.symbol
      }
    });
  }
}

/**
 * Example function to store/ update transactions in the DB.
 * Assumes you already fetched data from the API.
 */

export async function storeTransactions(
  accountPk: string,  
  transactions: Transaction[]
) {

  if (!transactions || transactions.length === 0) {
    console.log(`No transactions to process for account ${accountPk}`);
    return;
  }

  console.log(`Processing ${transactions.length} transactions for account ${accountPk}`);

  const VALID_CATEGORIES = [
    'SUBSCRIPTION', 'INVESTING', 'GROCERIES', 'SHOPPING',
    'DINING', 'TRANSPORTATION', 'UTILITIES', 'ENTERTAINMENT',
    'HOUSING', 'HEALTHCARE', 'EDUCATION', 'TRAVEL', 'OTHER'
  ];


  const BATCH_SIZE = 5;
  let successCount = 0;

  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(transactions.length/BATCH_SIZE)}`);
    
    for (const tx of batch) {
      const flow = tx.value >= 0 ? 'INCOME' : 'EXPENSE';
      let category: TransactionCategory = 'OTHER';
      
      if (flow === 'EXPENSE') {
        try {

          if (!tx.wording) {
            console.warn(`Transaction ${tx.id} has no wording, using OTHER`);
            continue;
          }
          
          const categoryString = await categorizeTransaction(
            tx.wording, 
            Math.abs(tx.value), 
            tx.type
          );
          
          console.log(`Transaction: "${tx.wording.substring(0, 30)}" → ${categoryString}`);
          
          if (categoryString) {
            const normalizedCategory = categoryString.toUpperCase();
            
            if (VALID_CATEGORIES.includes(normalizedCategory)) {
              category = normalizedCategory as TransactionCategory;
            }
          }
        } catch (error) {
          console.error(`Error categorizing transaction "${tx.wording}":`, error);
        }
      }
      
      try {
        await prisma.transaction.upsert({
          where: {
            accountId_id: {
              accountId: accountPk,
              id: tx.id
            }
          },
          update: {
            wording: tx.wording,
            date: new Date(tx.date),
            rdate: new Date(tx.rdate),
            value: tx.value,
            type: tx.type,
            updatedAt: new Date(),
            flow: flow,
            category: category,
          },
          create: {
            accountId: accountPk,
            id: tx.id,
            wording: tx.wording,
            date: new Date(tx.date),
            rdate: new Date(tx.rdate),
            value: tx.value,
            type: tx.type,
            flow: flow,
            category: category,
          }
        });
        successCount++;
      } catch (dbError) {
        console.error(`Database error for transaction ${tx.id}:`, dbError);
      }
    }
    
    if (i + BATCH_SIZE < transactions.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Successfully processed ${successCount} of ${transactions.length} transactions`);
}