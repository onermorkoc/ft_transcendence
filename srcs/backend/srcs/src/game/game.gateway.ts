import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private gameService: GameService) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log("Game Socket Initialized.");
    }

    handleConnection(client: Socket) {
        console.log(client.id + " connected to game.");
        const userId: number = parseInt(this.gameService.strFix(client.handshake.query.userId));
        const gameId: string = this.gameService.strFix(client.handshake.query.gameId);
        client.join(gameId);
        this.gameService.createPlayer(userId, gameId);
    }

    handleDisconnect(client: Socket) {
        console.log(client.id + " disconnected from game.");
    }
    
    @SubscribeMessage('ready')
    handleReady(client: Socket) {
        const userId: number = parseInt(this.gameService.strFix(client.handshake.query.userId));
        const gameId: string = this.gameService.strFix(client.handshake.query.gameId);
    }
}