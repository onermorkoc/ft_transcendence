import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ball, Direction, Paddle } from './game.objects'
import { GameGateway } from './game.gateway';
import { UsersService } from 'src/users/users.service';
import { randomInt } from 'crypto';

@Injectable()
export class GameService {
    constructor(private prismaService: PrismaService, private gameGateway: GameGateway, private userService: UsersService) {}

    private gameFPS: number = 60;

    private playerOneMap: Map<string, Paddle> = new Map();
    private playerTwoMap: Map<string, Paddle> = new Map();
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
        const user: User = await this.userService.findUserbyID(userId);
        const game: Game = await this.findGameByID(gameId);
        if (userId == game.playerOneId) {
           this.playerOneMap.set(gameId, new Paddle(user.id, user.displayname, 'left'));
        }
        else if (userId == game.playerTwoId) {
            this.playerTwoMap.set(gameId, new Paddle(user.id, user.displayname, 'right'));
        }
    }

    async playerReady(userId: number, gameId: string) {
        const game: Game = await this.findGameByID(gameId);
        let player: Paddle;
        let otherPlayer: Paddle;
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
        const playerOne: Paddle = this.playerOneMap.get(gameId);
        const playerTwo: Paddle = this.playerTwoMap.get(gameId);
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

        setTimeout(() => {
            this.sendRandomData(gameId);
        }, 1000)
    }

    sendInitialData(gameId: string) {
        const server = this.gameGateway.server;

        const playerOne: Paddle = this.playerOneMap.get(gameId);
        const playerTwo: Paddle = this.playerTwoMap.get(gameId);

        if (!playerOne || !playerTwo) {return;}

        this.ballMap.set(gameId, new Ball());
        const ball: Ball = this.ballMap.get(gameId);

        server.to(gameId).emit('playerOneInitial', { id: playerOne.userId, name: playerOne.name, x: playerOne.x, y: playerOne.y, width: playerOne.width, height: playerOne.height });
        server.to(gameId).emit('playerTwoInitial', { id: playerTwo.userId, name: playerTwo.name, x: playerTwo.x, y: playerTwo.y, width: playerTwo.width, height: playerTwo.height });
        server.to(gameId).emit('ballPosition', { x: ball.x, y: ball.y });

        this.calculateBall(gameId);
    }

    calculateBall(gameId: string) {
        const server = this.gameGateway.server;

        const playerOne: Paddle = this.playerOneMap.get(gameId);
        const playerTwo: Paddle = this.playerTwoMap.get(gameId);
        const ball: Ball = this.ballMap.get(gameId);

        ball.updateBallPosition(playerOne, playerTwo);
        server.to(gameId).emit('ballPosition', { x: ball.x, y: ball.y });

        console.log({x: ball.x, y: ball.y});

        setTimeout(() => {
            this.calculateBall(gameId);
        }, 1000 / this.gameFPS)
    }

    playerOneMove(gameId: string, direction: Direction): number {
        const playerOne: Paddle = this.playerOneMap.get(gameId);
        playerOne.move(direction);
        console.log(playerOne.y);
        return playerOne.y;
    }

    playerOneMoveMouse(gameId: string, newY: number): number {
        const playerOne: Paddle = this.playerOneMap.get(gameId);
        playerOne.changePosition(newY);
        return playerOne.y;
    }

    playerTwoMove(gameId: string, direction: Direction): number {
        const playerTwo: Paddle = this.playerTwoMap.get(gameId);
        playerTwo.move(direction);
        console.log(playerTwo.y);
        return playerTwo.y;
    }

    playerTwoMoveMouse(gameId: string, newY: number): number {
        const playerTwo: Paddle = this.playerTwoMap.get(gameId);
        playerTwo.changePosition(newY);
        return playerTwo.y;
    }

}
