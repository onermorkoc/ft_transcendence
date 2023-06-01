/*
  Warnings:

  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[displayName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleAuth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Title" AS ENUM ('CAYLAK', 'USTA', 'BUYUKUSTA', 'EFSANE', 'SANLI');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'ATGAME');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('PRIVATE', 'PUBLIC', 'PROTECTED');

-- DropIndex
DROP INDEX "User_userName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userName",
ADD COLUMN     "chatRoomIds" INTEGER[],
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "friendIds" INTEGER[],
ADD COLUMN     "globalRank" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "googleAuth" BOOLEAN NOT NULL,
ADD COLUMN     "photoUrl" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "title" "Title" NOT NULL DEFAULT 'CAYLAK',
ADD COLUMN     "totalGame" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWin" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Chatroom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "roomStatus" "RoomStatus" NOT NULL,
    "userIds" INTEGER[],
    "adminIds" INTEGER[],
    "banListIds" INTEGER[],

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "playerOneId" INTEGER NOT NULL,
    "playerTwoId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");
