import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ball, COUNTDOWN_SECONDS, Direction, GAME_FPS, GameObject, GameState, Paddle } from './game.objects'
import { GameGateway } from './game.gateway';
import { UsersService } from 'src/users/users.service';
import { RemoteSocket, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
export class GameService {
    constructor(private prismaService: PrismaService, private gameGateway: GameGateway, private userService: UsersService) {}

    private gameMap: Map<string, GameObject> = new Map();

    async findGameByID(gameId: string): Promise<Game> {
        return await this.prismaService.game.findUnique({
            where: {
                id: gameId
            }
        })
    }

    async createGame(playerOne: number, playerTwo: number): Promise<Game> {
        const playerOneUser: User = await this.userService.findUserbyID(playerOne);
        const playerTwoUser: User = await this.userService.findUserbyID(playerTwo);

        const game = await this.prismaService.game.create({
            data: {
                playerOneId: playerOne,
                playerTwoId: playerTwo
            }
        });

        const countdownEndTime: number = Date.parse(game.createdAt.toString()) + (COUNTDOWN_SECONDS * 1000);

        this.gameMap.set(game.id, new GameObject(playerOneUser, playerTwoUser, countdownEndTime))

        return game;
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

    async createTime(gameId: string): Promise<Date> {
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

    async playerReady(userId: number, gameId: string) {
        const server = this.gameGateway.server;
        const game = this.gameMap.get(gameId);
        const playerOne = game.playerOne;
        const playerTwo = game.playerTwo;

        const socketsInGame: RemoteSocket<DefaultEventsMap, any>[] = await server.in(gameId).fetchSockets();
        socketsInGame.forEach((socket) => {
            if (parseInt(this.strFix(socket.handshake.query.userId)) != userId) {
                server.to(socket.id).emit("opponentReady");
            }
        })

        if (userId == playerOne.userId) {
            playerOne.isReady = true;

            if (playerTwo.isReady == true && !game.intervalId) {
                server.to(gameId).emit("gameStarted");
                game.gameState = GameState.PLAYING;
                game.intervalId = setInterval(() => this.gameInterval(gameId), 1000 / GAME_FPS);
            }
        }
        else if (userId == playerTwo.userId) {
            playerTwo.isReady = true;

            if (playerOne.isReady == true && !game.intervalId) {
                server.to(gameId).emit("gameStarted");
                game.gameState = GameState.PLAYING;
                game.intervalId = setInterval(() => this.gameInterval(gameId), 1000 / GAME_FPS);
            }
        }
    }

    async deleteGame(gameId: string) {
        await this.prismaService.game.delete({
            where: {
                id: gameId
            }
        })
        clearInterval(this.gameMap.get(gameId).intervalId);
        this.gameMap.delete(gameId);
    }

    async countDownCheck(gameId: string) {
        const game: GameObject = this.gameMap.get(gameId);
        const playerOne: Paddle = game.playerOne;
        const playerTwo: Paddle = game.playerTwo;
        if (!playerOne.isReady || !playerTwo.isReady) {
            this.gameGateway.server.to(gameId).emit('gameAborted');
            await this.deleteGame(gameId);
        }
    }

    async sendInitialData(client: Socket, gameId: string) {
        const server = this.gameGateway.server;

        const game = this.gameMap.get(gameId);
        if (!game) {return;}
        const gameState: GameState = game.gameState;
        const ball: Ball = game.ball;
        const playerOne: Paddle = game.playerOne;
        const playerTwo: Paddle = game.playerTwo;
        const gridSize: number = game.gridSize;
        const countdownEndTime: number = game.countdownEndTime;

        let gameJSON;
        if (parseInt(this.strFix(client.handshake.query.userId)) == playerOne.userId) {
            gameJSON = {
                gameState: gameState,
                ball: {
                    position: {
                        x: ball.x,
                        y: ball.y
                    },
                    width: ball.width,
                    height: ball.height
                },
                playerPaddle: {
                    id: playerOne.userId,
                    name: playerOne.name,
                    position: {
                        x: playerOne.x,
                        y: playerOne.y
                    },
                    score: playerOne.score,
                    width: playerOne.width,
                    height: playerOne.height,
                    speed: playerOne.speed
                },
                opponentPaddle: {
                    id: playerTwo.userId,
                    name: playerTwo.name,
                    position: {
                        x: playerTwo.x,
                        y: playerTwo.y
                    },
                    score: playerTwo.score,
                    width: playerTwo.width,
                    height: playerTwo.height,
                    speed: playerTwo.speed
                },
                gridSize: gridSize,
                countdownEndTime: countdownEndTime
            }
            server.to(client.id).emit('gameDataInitial', JSON.stringify(gameJSON));
        }
        else if (parseInt(this.strFix(client.handshake.query.userId)) == playerTwo.userId) {
            gameJSON = {
                gameState: gameState,
                ball: {
                    position: {
                        x: ball.x,
                        y: ball.y
                    },
                    width: ball.width,
                    height: ball.height
                },
                playerPaddle: {
                    id: playerTwo.userId,
                    name: playerTwo.name,
                    position: {
                        x: playerTwo.x,
                        y: playerTwo.y
                    },
                    score: playerTwo.score,
                    width: playerTwo.width,
                    height: playerTwo.height,
                    speed: playerTwo.speed
                },
                opponentPaddle: {
                    id: playerOne.userId,
                    name: playerOne.name,
                    position: {
                        x: playerOne.x,
                        y: playerOne.y
                    },
                    score: playerOne.score,
                    width: playerOne.width,
                    height: playerOne.height,
                    speed: playerOne.speed
                },
                gridSize: gridSize,
                countdownEndTime: countdownEndTime
            }
            server.to(client.id).emit('gameDataInitial', JSON.stringify(gameJSON));
        }
    }

    async gameInterval(gameId: string) {
        const server = this.gameGateway.server;

        const ball: Ball = this.gameMap.get(gameId).ball;
        const playerOne: Paddle = this.gameMap.get(gameId).playerOne;
        const playerTwo: Paddle = this.gameMap.get(gameId).playerTwo;

        ball.updateBallPosition(playerOne, playerTwo);

        const socketsInGame: RemoteSocket<DefaultEventsMap, any>[] = await server.in(gameId).fetchSockets();
        socketsInGame.forEach((socket) => {
            let dataJSON;
            if (parseInt(this.strFix(socket.handshake.query.userId)) == playerOne.userId) {
                dataJSON = {
                    ball: {
                        x: ball.x,
                        y: ball.y
                    },
                    opponentPaddle: {
                        y: playerTwo.y,
                        score: playerTwo.score
                    },
                    playerPaddle: {
                        score: playerOne.score
                    }
                }
                server.to(socket.id).emit('gameData', JSON.stringify(dataJSON));
            }
            else if (parseInt(this.strFix(socket.handshake.query.userId)) == playerTwo.userId) {
                dataJSON = {
                    ball: {
                        x: ball.x,
                        y: ball.y
                    },
                    opponentPaddle: {
                        y: playerOne.y,
                        score: playerOne.score
                    },
                    playerPaddle: {
                        score: playerTwo.score
                    }
                }
                server.to(socket.id).emit('gameData', JSON.stringify(dataJSON));
            }
        });

        //console.log({ x: ball.x, y: ball.y });
    }

    playerOneMove(gameId: string, newY: number): void {
        const playerOne: Paddle = this.gameMap.get(gameId).playerOne;
        playerOne.changePosition(newY);
    }

    playerTwoMove(gameId: string, newY: number): void {
        const playerTwo: Paddle = this.gameMap.get(gameId).playerTwo;
        playerTwo.changePosition(newY);
    }

}
