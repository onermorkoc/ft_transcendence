/*
  Warnings:

  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[displayname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_displayName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "displayName",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "displayname" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_displayname_key" ON "User"("displayname");
