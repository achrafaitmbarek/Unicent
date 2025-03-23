-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "availableBalance" DECIMAL(15,2),
ADD COLUMN     "iban" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "swift" TEXT;

-- AlterTable
ALTER TABLE "BankConnection" ADD COLUMN     "connectionName" TEXT,
ADD COLUMN     "connectionWebhookId" TEXT,
ADD COLUMN     "lastSyncStatus" TEXT,
ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "isRecurring" BOOLEAN,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "merchantCategory" TEXT,
ADD COLUMN     "merchantName" TEXT,
ADD COLUMN     "originalDescription" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "valueDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_eventType_idx" ON "WebhookEvent"("provider", "eventType");

-- CreateIndex
CREATE INDEX "WebhookEvent_resourceId_idx" ON "WebhookEvent"("resourceId");

-- CreateIndex
CREATE INDEX "WebhookEvent_processed_idx" ON "WebhookEvent"("processed");
