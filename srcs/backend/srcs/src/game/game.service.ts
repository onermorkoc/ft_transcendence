import { BadRequestException, Injectable } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ball, COUNTDOWN_SECONDS, GAME_END_SCORE, GAME_FPS, GameObject, GameState, PAUSE_WAIT_SECONDS, Paddle, STARTING_SECONDS } from './game.objects'
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

        this.gameMap.set(game.id, new GameObject(playerOneUser, playerTwoUser))

        return game;
    }

    async joinGame(userId: number, gameId: string): Promise<boolean> {
        const game: Game = await this.findGameByID(gameId);

        if (!game) {
            throw new BadRequestException('Böyle bir oyun bulunmuyor.');
        }

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
                clearInterval(game.countdownIntervalId);
                server.to(gameId).emit("gameStarting");
                game.gameState = GameState.STARTING;

                game.countdownInSeconds = STARTING_SECONDS;
                server.to(gameId).emit("countdown", game.countdownInSeconds);
                game.countdownIntervalId = setInterval(() => {
                    game.countdownInSeconds--;
                    server.to(gameId).emit("countdown", game.countdownInSeconds);

                    if (game.countdownInSeconds < 0) {
                        clearInterval(game.countdownIntervalId);
                        game.gameState = GameState.PLAYING;
                        server.to(gameId).emit("gameStarted");
                        game.intervalId = setInterval(() => this.gameInterval(gameId), 1000 / GAME_FPS);
                    }
                }, 1000)
            }
        }
        else if (userId == playerTwo.userId) {
            playerTwo.isReady = true;

            if (playerOne.isReady == true && !game.intervalId) {
                clearInterval(game.countdownIntervalId);
                game.gameState = GameState.STARTING;
                server.to(gameId).emit("gameStarting");

                game.countdownInSeconds = STARTING_SECONDS;
                server.to(gameId).emit("countdown", game.countdownInSeconds);
                game.countdownIntervalId = setInterval(() => {
                    game.countdownInSeconds--;
                    server.to(gameId).emit("countdown", game.countdownInSeconds);

                    if (game.countdownInSeconds < 0) {
                        clearInterval(game.countdownIntervalId);
                        game.gameState = GameState.PLAYING;
                        server.to(gameId).emit("gameStarted");
                        game.intervalId = setInterval(() => this.gameInterval(gameId), 1000 / GAME_FPS);
                    }
                }, 1000)
            }
        }
    }

    continueGame(gameId: string, waitingUserId: number) {
        const server = this.gameGateway.server;
        const game = this.gameMap.get(gameId);

        if (game.gameState != GameState.PAUSED) {return;}
        if (game.waitingUserId != waitingUserId) {return;}

        clearInterval(game.countdownIntervalId);
        game.gameState = GameState.STARTING;
        server.to(gameId).emit("gameStarting");

        game.countdownInSeconds = STARTING_SECONDS;
        server.to(gameId).emit("countdown", game.countdownInSeconds);
        game.countdownIntervalId = setInterval(() => {
            game.countdownInSeconds--;
            server.to(gameId).emit("countdown", game.countdownInSeconds);

            if (game.countdownInSeconds < 0) {
                clearInterval(game.countdownIntervalId);
                game.gameState = GameState.PLAYING;
                server.to(gameId).emit("gameStarted");
                game.intervalId = setInterval(() => this.gameInterval(gameId), 1000 / GAME_FPS);
            }
        }, 1000)
    }

    async pauseGame(gameId: string, waitingUserId: number) {
        const server = this.gameGateway.server;
        const game = this.gameMap.get(gameId);

        if (game.gameState == GameState.WAITINGTOSTART || game.gameState == GameState.ABORTED || game.gameState == GameState.FINISHEDP1 || game.gameState == GameState.FINISHEDP2) {return;}

        game.ball.resetBall();
        game.playerOne.resetPosition();
        game.playerTwo.resetPosition();

        clearInterval(game.intervalId);
        clearInterval(game.countdownIntervalId);
        
        game.waitingUserId = waitingUserId;
        game.gameState = GameState.PAUSED;
        server.to(gameId).emit("gamePaused");
        game.countdownInSeconds = PAUSE_WAIT_SECONDS;
        server.to(gameId).emit("countdown", game.countdownInSeconds);
        game.countdownIntervalId = setInterval(() => {
            game.countdownInSeconds--;
            server.to(gameId).emit("countdown", game.countdownInSeconds);

            if (game.countdownInSeconds < 0) {
                if (game.waitingUserId == game.playerOne.userId) {game.gameState = GameState.FINISHEDP2;}
                else if (game.waitingUserId == game.playerTwo.userId) {game.gameState = GameState.FINISHEDP1;}
                clearInterval(game.countdownIntervalId);
                server.to(gameId).emit("win");
            }
        }, 1000)
    }

    async deleteGame(gameId: string) {
        if (this.gameMap.get(gameId).deleting == true) {return;}
        this.gameMap.get(gameId).deleting = true;
        await this.saveGameHistory(gameId);
        clearInterval(this.gameMap.get(gameId).intervalId);
        clearInterval(this.gameMap.get(gameId).countdownIntervalId);

        const game: Game = await this.findGameByID(gameId);
        const playerOne: User = await this.userService.findUserbyID(game.playerOneId);
        const playerTwo: User = await this.userService.findUserbyID(game.playerTwoId);
        playerOne.currentGameId = '';
        playerTwo.currentGameId = '';
        await this.userService.update(playerOne);
        await this.userService.update(playerTwo);

        await this.prismaService.game.delete({
            where: {
                id: gameId
            }
        })
        this.gameMap.delete(gameId);
    }

    setCountDown(gameId: string) {
        const server = this.gameGateway.server;
        const game: GameObject = this.gameMap.get(gameId);
        game.countdownIntervalId = setInterval(() => {
            game.countdownInSeconds--;
            server.to(gameId).emit("countdown", game.countdownInSeconds);

            if (game.countdownInSeconds < 0) {
                clearInterval(game.countdownIntervalId);
                if (!game.playerOne.isReady || !game.playerTwo.isReady) {
                    game.gameState = GameState.ABORTED;
                    this.gameGateway.server.to(gameId).emit('gameAborted');
                }
            }
        }, 1000);
    }

    countDownCheck(gameId: string) {
        const game: GameObject = this.gameMap.get(gameId);
        if (!game) {return;}
        const playerOne: Paddle = game.playerOne;
        const playerTwo: Paddle = game.playerTwo;
        if (!playerOne.isReady || !playerTwo.isReady) {
            game.gameState = GameState.ABORTED;
            this.gameGateway.server.to(gameId).emit('gameAborted');
        }
    }

    sendInitialData(client: Socket, gameId: string) {
        const server = this.gameGateway.server;

        const game = this.gameMap.get(gameId);
        if (!game) {return;}
        const gameState: GameState = game.gameState;
        const ball: Ball = game.ball;
        const playerOne: Paddle = game.playerOne;
        const playerTwo: Paddle = game.playerTwo;
        const gridSize: number = game.gridSize;

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
                countdown: game.countdownInSeconds
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
                countdown: game.countdownInSeconds
            }
            server.to(client.id).emit('gameDataInitial', JSON.stringify(gameJSON));
        }
    }

    async gameInterval(gameId: string) {
        const server = this.gameGateway.server;

        const game: GameObject = this.gameMap.get(gameId);
        const ball: Ball = game.ball;
        const playerOne: Paddle = game.playerOne;
        const playerTwo: Paddle = game.playerTwo;

        const socketsInGame: RemoteSocket<DefaultEventsMap, any>[] = await server.in(gameId).fetchSockets();

        if (playerOne.score >= GAME_END_SCORE) {
            game.gameState = GameState.FINISHEDP1;
            socketsInGame.forEach((socket) => {
                if (parseInt(this.strFix(socket.handshake.query.userId)) == playerOne.userId) {
                    server.to(socket.id).emit('win');
                }
                else if (parseInt(this.strFix(socket.handshake.query.userId)) == playerTwo.userId) {
                    server.to(socket.id).emit('lose');
                }
            });
            clearInterval(game.intervalId);
            return;
        }
        else if (playerTwo.score >= GAME_END_SCORE) {
            game.gameState = GameState.FINISHEDP2;
            socketsInGame.forEach((socket) => {
                if (parseInt(this.strFix(socket.handshake.query.userId)) == playerOne.userId) {
                    server.to(socket.id).emit('lose');
                }
                else if (parseInt(this.strFix(socket.handshake.query.userId)) == playerTwo.userId) {
                    server.to(socket.id).emit('win');
                }
            });
            clearInterval(game.intervalId);
            return;
        }

        ball.updateBallPosition(playerOne, playerTwo);

        socketsInGame.forEach((socket) => {
            let dataJSON;
            if (!game.sendScore) {
                if (parseInt(this.strFix(socket.handshake.query.userId)) == playerOne.userId) {
                    dataJSON = {
                        ball: {
                            x: ball.x,
                            y: ball.y
                        },
                        opponentPaddle: {
                            y: playerTwo.y
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
                            y: playerOne.y
                        }
                    }
                    server.to(socket.id).emit('gameData', JSON.stringify(dataJSON));
                }
            }
            else {
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
            }
        });

        game.sendScore = false;
    }

    playerOneMove(gameId: string, newY: number): void {
        const playerOne: Paddle = this.gameMap.get(gameId).playerOne;
        playerOne.changePosition(newY);
    }

    playerTwoMove(gameId: string, newY: number): void {
        const playerTwo: Paddle = this.gameMap.get(gameId).playerTwo;
        playerTwo.changePosition(newY);
    }

    async saveGameHistory(gameId: string) {
        const game: GameObject = this.gameMap.get(gameId);

        if (game.gameState != GameState.FINISHEDP1 && game.gameState != GameState.FINISHEDP2) {return;}

        let winnerId: number;
        if (game.gameState == GameState.FINISHEDP1) {winnerId = game.playerOne.userId;}
        else {winnerId = game.playerTwo.userId;}

        await this.prismaService.gameHistory.create({
            data: {
                playerOne: { connect: {id: game.playerOne.userId} },
                playerTwo: { connect: {id: game.playerTwo.userId} },
                winnerId: winnerId,
                playerOneScore: game.playerOne.score,
                playerTwoScore: game.playerTwo.score
            }
        });
    }

}
