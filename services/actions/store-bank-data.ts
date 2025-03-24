import { prisma } from '@/lib/prisma';
import { BankAccount, Transaction } from '@/types'; // Adjust to your local types if needed

/**
 * Example function to store/ update accounts in the DB.
 * Assumes you already fetched data from the API.
 */
export async function storeBankAccounts(connectionId: string, accounts: BankAccount[]) {
  for (const account of accounts) {
    await prisma.bankAccount.upsert({
      where: {
        // Composite unique constraint from schema (connectionId + id)
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
  accountPk: string,  // The pk of the BankAccount in your DB
  transactions: Transaction[]
) {
  for (const tx of transactions) {
    await prisma.transaction.upsert({
      where: {
        // Composite unique constraint from schema (accountId + id)
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
        updatedAt: new Date()
      },
      create: {
        accountId: accountPk,
        id: tx.id,
        wording: tx.wording,
        date: new Date(tx.date),
        rdate: new Date(tx.rdate),
        value: tx.value,
        type: tx.type
      }
    });
  }
}