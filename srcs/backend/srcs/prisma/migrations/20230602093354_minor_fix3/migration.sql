/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_displayname_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");
