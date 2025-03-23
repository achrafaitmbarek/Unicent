/*
  Warnings:

  - You are about to drop the column `connectionName` on the `BankConnection` table. All the data in the column will be lost.
  - You are about to drop the column `connectionWebhookId` on the `BankConnection` table. All the data in the column will be lost.
  - You are about to drop the column `lastSync` on the `BankConnection` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncStatus` on the `BankConnection` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `BankConnection` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `BankConnection` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `BankConnection` table. All the data in the column will be lost.
  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_connectionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- AlterTable
ALTER TABLE "BankConnection" DROP COLUMN "connectionName",
DROP COLUMN "connectionWebhookId",
DROP COLUMN "lastSync",
DROP COLUMN "lastSyncStatus",
DROP COLUMN "logoUrl",
DROP COLUMN "provider",
DROP COLUMN "status";

-- DropTable
DROP TABLE "BankAccount";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "WebhookEvent";

-- DropEnum
DROP TYPE "BankAccountType";

-- DropEnum
DROP TYPE "BankConnectionStatus";

-- DropEnum
DROP TYPE "TransactionType";
