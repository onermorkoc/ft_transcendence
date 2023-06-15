import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Game, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private prismaService: PrismaService) {}

    async createGame(playerOne: number, playerTwo: number): Promise<Game> {
        return await this.prismaService.game.create({
            data: {
                playerOneId: playerOne,
                playerTwoId: playerTwo
            }
        });
    }

    async joinGame(userId: number, gameId: string): Promise<boolean> {
        const game: Game = await this.prismaService.game.findUnique({
            where: {
                id: gameId
            }
        });

        if (userId != game.playerOneId && userId != game.playerTwoId) {
            throw new BadRequestException('Bu oyuna girme yetkin bulunmuyor.');
        }

        return true;
    }
}
