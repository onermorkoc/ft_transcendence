-- CreateTable
CREATE TABLE "GameHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "win" BOOLEAN NOT NULL,
    "userScore" INTEGER NOT NULL,
    "opponentScore" INTEGER NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
