'use client'

import { useState } from 'react'
import { initiateConnection } from '@/services/actions/bank-actions'
import { fetchBankAccounts, fetchAllTransactions } from '@/services/actions/fetch-bank-data'
import { Button } from '@/components/ui/button'
interface Currency {
    id: string;
    symbol: string;
}

interface BankAccount {
    id: number;
    number: string;
    balance: number;
    currency: Currency;
    name: string;
    iban: string;
}
interface Transaction {
    id: number;
    wording: string;
    date: string;
    rdate: string;
    value: number;
    type: string;
}

interface AccountsResponse {
    success: boolean;
    data?: {
        accounts: BankAccount[];
        balance: number;
        coming_balances: {
            EUR: number;
        };
    };
    error?: string;
    connectionId?: string;
}

interface TransactionsResponse {
    success: boolean;
    transactions?: Transaction[];
    first_date?: string;
    last_date?: string;
    error?: string;
}


type ApiResponse = AccountsResponse | TransactionsResponse | null;

export default function TestPage() {
    const [response, setResponse] = useState<ApiResponse>(null)
    const [selectedAccount, setSelectedAccount] = useState<string>('')
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const connectBank = async () => {
        setIsLoading(true)
        try {
            const url = await initiateConnection()
            window.location.href = url
        } catch (error) {
            setResponse({ success: false, error: (error as Error).message })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchAccounts = async () => {
        setIsLoading(true)
        try {
            const result = await fetchBankAccounts()
            setResponse(result)
            console.log('Fetched accounts:', result.data?.balance)
            console.log('coming balance ' + JSON.stringify(result.data?.coming_balances.EUR))

            if (result.success && result.data && result.data.accounts) {
                setAccounts(result.data.accounts)
            }
        } catch (error) {
            setResponse({ success: false, error: (error as Error).message })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTransactions = async () => {
        if (!selectedAccount) {
            setResponse({ success: false, error: 'Please select an account first' })
            return
        }

        setIsLoading(true)
        try {
            const data = await fetchAllTransactions(selectedAccount, 50)
            setResponse(data)
        } catch (error) {
            setResponse({ success: false, error: (error as Error).message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Bank API Test</h1>

            <div className="space-y-4">
                <Button
                    onClick={connectBank}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={isLoading}
                >
                    Connect Your Bank
                </Button>

                <Button
                    onClick={fetchAccounts}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    disabled={isLoading}
                >
                    Fetch Bank Accounts
                </Button>

                {accounts.length > 0 && (
                    <div className="flex gap-2">
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="">Select an account</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name} ({account.balance} {account.currency.symbol})
                                </option>
                            ))}
                        </select>

                        <Button
                            onClick={fetchTransactions}
                            className="px-4 py-2 bg-purple-600 text-white rounded"
                            disabled={isLoading || !selectedAccount}
                        >
                            Fetch Transactions
                        </Button>
                    </div>
                )}
            </div>

            {isLoading && <div className="mt-4">Loading...</div>}

            {response && 'data' in response && response.data?.accounts && response.data.accounts.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Bank Accounts:</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {response.data.accounts.map(account => (
                            <div key={account.id} className="border rounded p-4 bg-white shadow">
                                <div className="font-medium">Account # {account.number}</div>
                                <div className="text-gray-600">{account.name}</div>
                                <div className="text-xl font-bold mt-1">
                                    {account.balance} {account.currency.symbol}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {response && 'transactions' in response && response.transactions && response.transactions.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Transactions:</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {response.transactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.wording}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.rdate}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.value < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {transaction.value}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {response && 'error' in response && response.error && (
                <div className="mt-8 p-4 bg-red-50 text-red-700 rounded">
                    <p className="font-semibold">Error:</p>
                    <p>{response.error}</p>
                </div>
            )}
        </div>
    )
}