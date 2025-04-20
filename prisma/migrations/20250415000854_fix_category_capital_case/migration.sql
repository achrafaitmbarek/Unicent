/*
  Warnings:

  - You are about to drop the column `cataegory` on the `FinancialGoal` table. All the data in the column will be lost.
  - Added the required column `category` to the `FinancialGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinancialGoal" DROP COLUMN "cataegory",
ADD COLUMN     "category" "Category" NOT NULL;
