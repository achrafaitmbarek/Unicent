'use client'

import { useState } from 'react'
import { initiateConnection } from '@/services/actions/bank-actions'
import { fetchBankAccounts, fetchAllTransactions } from '@/services/actions/fetch-bank-data'
import { Button } from '@/components/ui/button'
interface Currency {
    id: string;
    symbol: string;
    prefix: boolean;
    crypto: boolean;
    precision: number;
    name: string;
    marketcap: null | number;
    datetime: null | string;
}

// Account interface
interface BankAccount {
    id: number;
    id_connection: number;
    id_user: number;
    number: string;
    webid: string;
    original_name: string;
    name: string;
    balance: number;
    coming: number;
    coming_balance: number;
    formatted_balance: string;
    iban: string;
    bic: string;
    type: string;
    usage: string;
    ownership: string;
    currency: Currency;
    last_update: string;
    // Additional fields omitted for brevity
}

// Transaction interface
interface Transaction {
    id: number;
    id_account: number;
    date: string;
    application_date: string;
    value: number;
    formatted_value: string;
    original_wording: string;
    wording: string;
    simplified_wording: string;
    type: string;
    coming: boolean;
    active: boolean;
    // Additional fields omitted for brevity
}

// Account response interface
interface AccountsResponse {
    success: boolean;
    data?: {
        balance: number;
        balances: Record<string, number>;
        coming_balances: Record<string, number>;
        accounts: BankAccount[];
        total: number;
    };
    connectionId?: string;
    error?: string;
}

// Transaction response interface
interface TransactionsResponse {
    success: boolean;
    transactions?: Transaction[];
    metadata?: {
        first_date: string;
        last_date: string;
        total: number;
        has_more: boolean;
    };
    error?: string;
}

// Union type for API responses
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

            {response && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Response:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}