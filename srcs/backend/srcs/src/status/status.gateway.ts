import { OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { StatusService } from "./status.service";
import { User } from "@prisma/client";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'status'})
export class StatusGateway implements OnGatewayInit, OnGatewayDisconnect {
    constructor(private statusService: StatusService) {}

    @WebSocketServer()
    server: Server;

    afterInit() {
        this.server.on("connection", (client) => {
            console.log(`[DEBUG]: Servere biri bağlandı. (${client.id})`)
        })
    }

    async handleDisconnect(client: Socket) {
        await this.statusService.removeUserOnline(client.id);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }

    @SubscribeMessage('userConnected')
    handleUserConnected(client: Socket, user: User) {
        this.statusService.addUserOnline(user, client.id);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }
}