# Bank Data Synchronization

This module implements real-time bank data synchronization using the Powens API, enabling automatic tracking and categorization of financial transactions for authenticated users within Unicent.

## Overview

The bank data synchronization feature serves as a core component of Unicent's financial management capabilities. It establishes secure connections with users' bank accounts through Powens API, regularly fetches transaction data, and maintains an up-to-date record of financial activities in our database.

## Key Features

- Secure bank account connection management
- Automated transaction synchronization
- Real-time balance updates
- Transaction categorization and storage
- Multi-account support per user
- Error handling and retry mechanisms
- Synchronization status monitoring

## Technical Architecture

### Data Flow

1. User authenticates and initiates bank connection
2. Powens API handles secure bank authentication
3. System receives transaction data through webhooks
4. Transactions are processed and stored in PostgreSQL
5. Data becomes available in user's dashboard

### Database Schema

```prisma
model BankConnection {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  powensId      String    @unique @map("powens_id")
  status        String    
  lastSync      DateTime? @map("last_sync")
  accounts      BankAccount[]
  user          User      @relation(fields: [userId], references: [id])
}

model BankAccount {
  id              String    @id @default(cuid())
  connectionId    String    @map("connection_id")
  accountNumber   String    @map("account_number")
  name           String
  balance        Decimal
  currency       String
  transactions   Transaction[]
  connection     BankConnection @relation(fields: [connectionId], references: [id])
}

model Transaction {
  id            String    @id @default(cuid())
  accountId     String    @map("account_id")
  amount        Decimal
  date          DateTime
  description   String
  category      String?
  type          TransactionType
  account       BankAccount @relation(fields: [accountId], references: [id])
}

enum TransactionType {
  INCOME
  EXPENSE
}
```

## Implementation Details

### Required Environment Variables

```bash
POWENS_CLIENT_ID=your_client_id
POWENS_CLIENT_SECRET=your_client_secret
POWENS_API_URL=https://api.powens.com
```

### API Integration

The feature implements the following Powens API endpoints:

- `/connect`: Initiates bank connection
- `/accounts`: Retrieves account information
- `/transactions`: Fetches transaction data
- `/webhooks`: Receives real-time updates

### Error Handling

The system implements robust error handling for:
- Connection timeouts
- API rate limiting
- Invalid credentials
- Network failures
- Data inconsistencies

## Usage in Frontend

Example of initiating bank connection:

```typescript
const connectBank = async (userId: string) => {
  const connection = await powensService.createConnection({
    userId,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/banks/callback`,
  });
  
  return connection.connectionUrl;
};
```

## Security Considerations

- All API communications use TLS encryption
- Bank credentials are never stored in our database
- Powens handles secure credential management
- Regular security audits are performed
- Data is encrypted at rest

## Monitoring and Maintenance

The system includes:
- Transaction sync status monitoring
- Error rate tracking
- Connection health checks
- Automated retry mechanisms
- Performance metrics collection

## Development Status

Currently in active development. Next steps include:
- Implementing transaction categorization
- Adding support for multiple currencies
- Enhancing error recovery mechanisms
- Improving sync performance
- Adding transaction search capabilities