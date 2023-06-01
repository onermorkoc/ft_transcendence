/*
  Warnings:

  - You are about to drop the column `googleAuth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleAuth",
ADD COLUMN     "googleAuthSecret" TEXT;
