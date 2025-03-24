-- DropEnum
DROP TYPE "TransactionStatus";

-- CreateTable
CREATE TABLE "BankAccount" (
    "pk" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "pk" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "wording" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rdate" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("pk")
);

-- CreateIndex
CREATE INDEX "BankAccount_connectionId_idx" ON "BankAccount"("connectionId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_connectionId_id_key" ON "BankAccount"("connectionId", "id");

-- CreateIndex
CREATE INDEX "Transaction_accountId_idx" ON "Transaction"("accountId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_accountId_id_key" ON "Transaction"("accountId", "id");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "BankConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("pk") ON DELETE CASCADE ON UPDATE CASCADE;
