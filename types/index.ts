export interface Currency {
    id: string;
    symbol: string;
}

export interface BankAccount {
    id: number;
    number: string;
    balance: number;
    currency: Currency;
    name: string;
    iban: string;
}
export interface Transaction {
    id: number;
    wording: string;
    date: string;
    rdate: string;
    value: number;
    type: string;
}

export interface AccountsResponse {
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

export interface TransactionsResponse {
    success: boolean;
    transactions?: Transaction[];
    first_date?: string;
    last_date?: string;
    error?: string;
}