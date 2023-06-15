import { BadRequestException, Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from './game.objects'

@Injectable()
export class GameService {
    constructor(private prismaService: PrismaService) {}

    private playerOneMap: Map<string, Player> = new Map();
    private playerTwoMap: Map<string, Player> = new Map();

    async findGameByID(gameId: string): Promise<Game> {
        return await this.prismaService.game.findUnique({
            where: {
                id: gameId
            }
        })
    }

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

    async whichPlayer(userId: number, gameId: string): Promise<string> {
        const game: Game = await this.prismaService.game.findUnique({
            where: {
                id: gameId
            }
        });

        if (userId == game.playerOneId) {
            return ('playerOne');
        }
        else if (userId == game.playerTwoId) {
            return ('playerTwo');
        }
        else {
            throw new BadRequestException('Bu oyuna girme yetkin bulunmuyor.');
        }
    }

    strFix(str: string | string[]): string {
        if (Array.isArray(str)) {
            return null;
        }
        else {
            return str;
        }
    }

    async createPlayer(userId: number, gameId: string) {
        const game: Game = await this.findGameByID(gameId);
        if (userId == game.playerOneId) {
           this.playerOneMap.set(gameId, new Player(userId));
        }
        else if (userId == game.playerTwoId) {
            this.playerTwoMap.set(gameId, new Player(userId));
        }
    }

    async countDownCheck(gameId: string) {

    }
}
