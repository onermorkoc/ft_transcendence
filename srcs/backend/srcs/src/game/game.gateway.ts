import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
        console.log(client.id + " connected.");
    }

    handleDisconnect(client: Socket) {
        console.log(client.id + " disconnected.");
    }
    
    
}