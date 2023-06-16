import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ball, Player } from './game.objects'
import { GameGateway } from './game.gateway';
import { UsersService } from 'src/users/users.service';
import { randomInt } from 'crypto';

@Injectable()
export class GameService {
    constructor(private prismaService: PrismaService, private gameGateway: GameGateway, private userService: UsersService) {}

    private playerOneMap: Map<string, Player> = new Map();
    private playerTwoMap: Map<string, Player> = new Map();
    private ballMap: Map<string, Ball> = new Map();

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
        const game: Game = await this.findGameByID(gameId);

        if (userId != game.playerOneId && userId != game.playerTwoId) {
            throw new BadRequestException('Bu oyuna girme yetkin bulunmuyor.');
        }

        return true;
    }

    async getPlayers(gameId: string): Promise<{ playerOne: User, playerTwo: User }> {
        const game: Game = await this.findGameByID(gameId);
        const playerOne: User = await this.userService.findUserbyID(game.playerOneId);
        const playerTwo: User = await this.userService.findUserbyID(game.playerTwoId);

        return { playerOne: playerOne, playerTwo: playerTwo };
    }

    async createTime(gameId: string) {
        const game: Game = await this.findGameByID(gameId);
        return game.createdAt;
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

    async playerReady(userId: number, gameId: string) {
        const game: Game = await this.findGameByID(gameId);
        let player: Player;
        let otherPlayer: Player;
        if (userId == game.playerOneId) {
           player = this.playerOneMap.get(gameId);
           otherPlayer = this.playerTwoMap.get(gameId);
        }
        else if (userId == game.playerTwoId) {
            player = this.playerTwoMap.get(gameId);
            otherPlayer = this.playerTwoMap.get(gameId);
        }

        if (player) {
            player.isReady = true;
            if (otherPlayer && otherPlayer.isReady) {
                this.ballMap.set(gameId, new Ball());
            }
        }
    }

    async deleteGame(gameId: string) {
        await this.prismaService.game.delete({
            where: {
                id: gameId
            }
        })
        this.playerOneMap.delete(gameId);
        this.playerTwoMap.delete(gameId);
        this.ballMap.delete(gameId);
    }

    async countDownCheck(gameId: string) {
        console.log(gameId);
        const playerOne: Player = this.playerOneMap.get(gameId);
        const playerTwo: Player = this.playerTwoMap.get(gameId);
        if (!playerOne || !playerTwo) {
            this.gameGateway.server.to(gameId).emit('abortNotConnected');
            await this.deleteGame(gameId);
        }
        else if (!playerOne.isReady || !playerTwo.isReady) {
            this.gameGateway.server.to(gameId).emit('abortNotReady');
            await this.deleteGame(gameId);
        }
    }

    async sendRandomData(gameId: string) {
        const server = this.gameGateway.server;

        server.to(gameId).emit('playerOnePosition', { x: 10, y: randomInt(0,100) });
        server.to(gameId).emit('playerTwoPosition', { x: 90, y: randomInt(0,100) });
        server.to(gameId).emit('ballPosition', { x: randomInt(20,80), y: randomInt(10, 90) });

        console.log("sdasd");

        setTimeout(() => {
            this.sendRandomData(gameId);
        }, 1000)
    }
}
