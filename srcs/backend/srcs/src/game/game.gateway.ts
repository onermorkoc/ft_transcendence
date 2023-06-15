import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Server, Socket } from "socket.io";
import { Inject, forwardRef } from "@nestjs/common";
import { Game, User } from "@prisma/client";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(@Inject(forwardRef(() => GameService)) private gameService: GameService, private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log("Game Socket Initialized.");
    }

    async handleConnection(client: Socket) {
        console.log(client.id + " connected to game.");
        const user: User = await this.userService.findUserbyID(parseInt(this.gameService.strFix(client.handshake.query.userId)));
        const game: Game = await this.gameService.findGameByID(this.gameService.strFix(client.handshake.query.gameId));

        if (!game || !user) {
            client.disconnect();
            return;
        }
        client.join(game.id);
        await this.gameService.createPlayer(user.id, game.id);
    }

    handleDisconnect(client: Socket) {
        console.log(client.id + " disconnected from game.");
    }
    
    @SubscribeMessage('ready')
    async handleReady(client: Socket) {
        const userId: number = parseInt(this.gameService.strFix(client.handshake.query.userId));
        const gameId: string = this.gameService.strFix(client.handshake.query.gameId);
        await this.gameService.playerReady(userId, gameId);
    }
}