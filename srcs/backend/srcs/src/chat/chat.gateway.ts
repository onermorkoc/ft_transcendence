import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { ChatService } from "./chat.service";
import { Chatroom, Message, User } from "@prisma/client";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: 'chat'})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private chatService: ChatService, private userService: UsersService) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log("Chat socket initialized.");
    }

    async handleConnection(client: Socket) {
        console.log("Client connected: " + client.id);
        const user: User = await this.userService.findUserbyID(parseInt(this.chatService.strFix(client.handshake.query.userId)));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));
        if (!user || !chatRoom) {
            console.log("Client disconnected: " + client.id);
            client.disconnect();
            return;
        }
        client.join(chatRoom.id);

        this.server.to(chatRoom.id).emit('usersInRoom', await this.chatService.getUsersInRoom(chatRoom, this.server));
        this.server.to(chatRoom.id).emit('adminsInRoom', await this.chatService.getAdminsInRoom(chatRoom, this.server));
    }

    async handleDisconnect(client: Socket) {
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));
        this.server.to(chatRoom.id).emit('usersInRoom', await this.chatService.getUsersInRoom(chatRoom, this.server));
        this.server.to(chatRoom.id).emit('adminsInRoom', await this.chatService.getAdminsInRoom(chatRoom, this.server));

        console.log("Client disconnected: " + client.id);
    }

    @SubscribeMessage('newMessageToServer')
    async handleNewMessage(client: Socket, message: string) {
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const roomId: string = this.chatService.strFix(client.handshake.query.roomId);
        const msg: Message = await this.chatService.createNewMessage(userId, roomId, message);
        this.server.to(roomId).emit('newMessageToClient', msg);
    }

    @SubscribeMessage('setAdmin')
    async handleSetAdmin(client: Socket, newAdminIdStr: string) {
        const newAdminId: number = parseInt(newAdminIdStr);
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (chatRoom.ownerId != userId) {
            throw new Error('You need to be channel owner to execute this command.');
        }
        else if (chatRoom.adminIds.includes(newAdminId)) {
            throw new Error('The user is already an admin of this channel.');
        }
        else if (!(await this.chatService.getUsersInRoom(chatRoom, this.server)).includes(newAdminId)) {
            throw new Error('The user needs to be in channel to be promoted as an admin.');
        }

        chatRoom.adminIds.push(newAdminId);
        await this.chatService.update(chatRoom);
        this.server.to(chatRoom.id).emit('adminsInRoom', await this.chatService.getAdminsInRoom(chatRoom, this.server));
    }

    @SubscribeMessage('kickUser')
    async handleKickUser(client: Socket, kickedUserIdStr: string) {
        const kickedUserId: number = parseInt(kickedUserIdStr);
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!chatRoom.adminIds.includes(userId)) {
            throw new Error('You need to be admin to execute this command.');
        }

        // ...
    }

}