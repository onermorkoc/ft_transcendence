/*
  Warnings:

  - You are about to drop the column `googleAuthSecret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleAuthSecret",
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;
