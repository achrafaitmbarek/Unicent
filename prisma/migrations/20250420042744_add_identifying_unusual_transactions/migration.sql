-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "anomalyReason" TEXT,
ADD COLUMN     "isUnusual" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recommendedAmount" DOUBLE PRECISION,
ADD COLUMN     "riskLevel" TEXT;
