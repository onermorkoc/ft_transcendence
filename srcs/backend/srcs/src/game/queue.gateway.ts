import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { QueueService } from "./queue.service";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'queue'})
export class QueueGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private queueService: QueueService) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log("Game Queue Socket Initialized.");
    }

    async handleConnection(client: Socket) {
        console.log(client.id + " connected.");

        const userId: number = parseInt(this.queueService.strFix(client.handshake.query.userId));
        await this.queueService.addToQueue(userId, this.server);
    }

    handleDisconnect(client: Socket) {
        console.log(client.id + " disconnected.");

        const userId: number = parseInt(this.queueService.strFix(client.handshake.query.userId));
        this.queueService.removeFromQueue(userId);
    }
    
    
}