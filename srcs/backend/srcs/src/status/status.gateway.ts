import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { StatusService } from "./status.service";
import { User } from "@prisma/client";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'status'})
export class StatusGateway implements OnGatewayInit, OnGatewayDisconnect {
    constructor(private statusService: StatusService) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log("Status socket initialized.")
    }

    handleDisconnect(client: Socket) {
        this.statusService.removeUserOnline(client.id);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }

    @SubscribeMessage('userConnected')
    handleUserConnected(client: Socket, user: User) {
        this.statusService.addUserOnline(user, client.id);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }
}