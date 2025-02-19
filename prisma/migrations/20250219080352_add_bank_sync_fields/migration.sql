/*
  Warnings:

  - You are about to drop the `PendingRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BankConnectionStatus" AS ENUM ('PENDING', 'CONNECTED', 'DISCONNECTED', 'ERROR', 'SYNCING');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT', 'LOAN', 'INVESTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'POSTED', 'CANCELED');

-- DropTable
DROP TABLE "PendingRegistration";

-- CreateTable
CREATE TABLE "BankConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "BankConnectionStatus" NOT NULL,
    "lastSync" TIMESTAMP(3),
    "lastRefresh" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BankAccountType" NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "lastSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankConnection_userId_idx" ON "BankConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankConnection_userId_providerId_key" ON "BankConnection"("userId", "providerId");

-- CreateIndex
CREATE INDEX "BankAccount_currency_idx" ON "BankAccount"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_connectionId_externalId_key" ON "BankAccount"("connectionId", "externalId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_accountId_externalId_key" ON "Transaction"("accountId", "externalId");

-- AddForeignKey
ALTER TABLE "BankConnection" ADD CONSTRAINT "BankConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "BankConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
