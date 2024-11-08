/*
  Warnings:

  - The primary key for the `PendingRegistration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expiresAt` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `PendingRegistration` table. All the data in the column will be lost.
  - The `id` column on the `PendingRegistration` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "PendingRegistration_token_idx";

-- DropIndex
DROP INDEX "PendingRegistration_token_key";

-- AlterTable
ALTER TABLE "PendingRegistration" DROP CONSTRAINT "PendingRegistration_pkey",
DROP COLUMN "expiresAt",
DROP COLUMN "token",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PendingRegistration_pkey" PRIMARY KEY ("id");
