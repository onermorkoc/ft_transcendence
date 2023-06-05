import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'chat'})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log("Chat socket initialized.")
    }

    handleConnection(client: Socket) {
        console.log("Client connected: " + client.id);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected: " + client.id);
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
    }
}