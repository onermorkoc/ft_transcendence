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
        this.server.to(chatRoom.id).emit('mutedUsersInRoom', await this.chatService.getMutedUsersInRoom(chatRoom, this.server));
    }

    async handleDisconnect(client: Socket) {
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));
        this.server.to(chatRoom.id).emit('usersInRoom', await this.chatService.getUsersInRoom(chatRoom, this.server));
        this.server.to(chatRoom.id).emit('adminsInRoom', await this.chatService.getAdminsInRoom(chatRoom, this.server));
        this.server.to(chatRoom.id).emit('mutedUsersInRoom', await this.chatService.getMutedUsersInRoom(chatRoom, this.server));

        console.log("Client disconnected: " + client.id);
    }

    @SubscribeMessage('newMessageToServer')
    async handleNewMessage(client: Socket, message: string) {
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));
        const msg: Message = await this.chatService.createNewMessage(userId, chatRoom.id, message);

        if ((await this.chatService.getMutedUsersInRoom(chatRoom, this.server)).includes(userId)) {
            throw new Error("You can't send messages right now. You are muted.");
        }

        this.server.to(chatRoom.id).emit('newMessageToClient', msg);
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
        else if (chatRoom.adminIds.includes(kickedUserId)) {
            throw new Error("You can't kick the channel owner or an admin.");
        }
        else if (!(await this.chatService.getUsersInRoom(chatRoom, this.server)).includes(kickedUserId)) {
            throw new Error('The user needs to be in channel to be kicked.');
        }

        const clientsOfUser = await this.chatService.userIdtoClients(kickedUserId, chatRoom, this.server);
        clientsOfUser.forEach((client) => client.disconnect()); // Burada ekstradan 'kickListen' gibi bir şeye emit de atılabilir o clientlar için
        this.server.to(chatRoom.id).emit('usersInRoom', await this.chatService.getUsersInRoom(chatRoom, this.server));
    }

    @SubscribeMessage('muteUser')
    async handleMuteUser(client: Socket, mutedUserIdStr: string) {
        const mutedUserId: number = parseInt(mutedUserIdStr);
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!chatRoom.adminIds.includes(userId)) {
            throw new Error('You need to be admin to execute this command.');
        }
        else if (chatRoom.adminIds.includes(mutedUserId)) {
            throw new Error("You can't mute the channel owner or an admin.");
        }
        else if (!(await this.chatService.getUsersInRoom(chatRoom, this.server)).includes(mutedUserId)) {
            throw new Error('The user needs to be in channel to be muted.');
        }

        await this.chatService.createNewMute(userId, Date.now() + 60000, chatRoom.id); // 1 dk hardcoded
        this.server.to(chatRoom.id).emit('mutedUsersInRoom', await this.chatService.getMutedUsersInRoom(chatRoom, this.server));
    }

    @SubscribeMessage('banUser')
    async handleBanUser(client: Socket, bannedUserIdStr: string) {
        const bannedUserId: number = parseInt(bannedUserIdStr);
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!chatRoom.adminIds.includes(userId)) {
            throw new Error('You need to be admin to execute this command.');
        }
        else if (chatRoom.adminIds.includes(bannedUserId)) {
            throw new Error("You can't ban the channel owner or an admin.");
        }
        else if (!(await this.chatService.getUsersInRoom(chatRoom, this.server)).includes(bannedUserId)) {
            throw new Error('The user needs to be in channel to be banned.');
        }

        await this.chatService.createNewBan(bannedUserId, Date.now() + 120000, chatRoom.id); // 2 dk hardcoded
        const clientsOfUser = await this.chatService.userIdtoClients(bannedUserId, chatRoom, this.server);
        clientsOfUser.forEach((client) => client.disconnect()); // Burada ekstradan 'kickListen' gibi bir şeye emit de atılabilir o clientlar için
        this.server.to(chatRoom.id).emit('usersInRoom', await this.chatService.getUsersInRoom(chatRoom, this.server));
    }

    @SubscribeMessage('blockUser')
    async handleBlockUser(client: Socket, blockedUserIdStr: string) {
        const blockedUserId: number = parseInt(blockedUserIdStr);
        const user: User = await this.userService.findUserbyID(parseInt(this.chatService.strFix(client.handshake.query.userId)));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!(await this.chatService.getUsersInRoom(chatRoom, this.server)).includes(blockedUserId)) {
            throw new Error('The user needs to be in channel to be blocked.');
        }
        else if (user.blockedUserIds.includes(blockedUserId)) {
            throw new Error('The user is already blocked.');
        }
        
        await this.userService.blockUser(user, blockedUserId);
    }
}