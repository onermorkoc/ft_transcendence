import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { ChatService } from "./chat.service";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'chat'})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private chatService: ChatService) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log("Chat socket initialized.");
    }

    handleConnection(client: Socket) {
        console.log("Client connected: " + client.id);
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const roomId: string = this.chatService.strFix(client.handshake.query.roomId);
        if (Number.isNaN(userId) || !roomId) {
            client.disconnect();
            return;
        }
        client.join(roomId);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected: " + client.id);
    }

    @SubscribeMessage('newMessage')
    handleNewMessage(client: Socket, body: { userId: number, roomId: string, data: string }) {
        this.server.to(body.roomId).emit('listenMessage', body);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, roomId: string) {
        client.join(roomId);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, roomId: string) {
        client.leave(roomId);
    }
}