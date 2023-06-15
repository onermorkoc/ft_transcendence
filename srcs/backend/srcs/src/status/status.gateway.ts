import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { StatusService } from "./status.service";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'status'})
export class StatusGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    constructor(private statusService: StatusService) {}

    @WebSocketServer()
    server: Server;

    afterInit() {
        this.server.on("connection", (client) => {
            //console.log(`[DEBUG]: Servere biri bağlandı. (${client.id})`)
        })
    }

    async handleConnection(client: Socket) {
        const userId: number = parseInt(this.statusService.strFix(client.handshake.query.userId));
        if (Number.isNaN(userId)) {
            client.disconnect();
            return;
        }
        await this.statusService.addUserOnline(userId);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }

    async handleDisconnect(client: Socket) {
        const userId: number = parseInt(this.statusService.strFix(client.handshake.query.userId));
        if (Number.isNaN(userId)) {
            return;
        }
        await this.statusService.removeUserOnline(userId);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }
}