import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: {
    origin: true,
    credentials: true,
  }})
export class MyGateway implements OnModuleInit, OnGatewayDisconnect {
  public onlineUsers: Array<{ userId: number, socketId: string }> = [];

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    })
  }

  @SubscribeMessage('new-user-add')
  newUserAdd(@MessageBody() body: { userId: number, socketId: string }) {
    if (!this.onlineUsers.some((element) => element.userId === body.userId)) {
      this.onlineUsers.push({ userId: body.userId, socketId: body.socketId });
      console.log("new user came in ", this.onlineUsers);
    }
    this.server.emit('get-users', this.onlineUsers);
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers = this.onlineUsers.filter((element) => element.socketId !== client.id)
    console.log("user disconnected ", this.onlineUsers);
    this.server.emit('get-users', this.onlineUsers);
  }
}