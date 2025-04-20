-- CreateEnum
CREATE TYPE "TransactionFlow" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "flow" "TransactionFlow" NOT NULL DEFAULT 'EXPENSE';
