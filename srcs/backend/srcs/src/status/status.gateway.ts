import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { StatusService } from "./status.service";
import { UsersService } from "src/users/users.service";
import { User } from "@prisma/client";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'status'})
export class StatusGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    constructor(private statusService: StatusService, private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    afterInit() {
        this.server.on("connection", (client) => {
            //console.log(`[DEBUG]: Servere biri bağlandı. (${client.id})`)
        })
    }

    async handleConnection(client: Socket) {
        const user: User = await this.userService.findUserbyID(parseInt(this.statusService.strFix(client.handshake.query.userId)));
        if (!user) {
            client.disconnect();
            return;
        }
        await this.statusService.addUserOnline(user.id);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }

    async handleDisconnect(client: Socket) {
        const user: User = await this.userService.findUserbyID(parseInt(this.statusService.strFix(client.handshake.query.userId)));
        if (!user) {
            return;
        }
        await this.statusService.removeUserOnline(user.id);
        this.server.emit('usersOnline', this.statusService.getUsersOnline());
    }
}