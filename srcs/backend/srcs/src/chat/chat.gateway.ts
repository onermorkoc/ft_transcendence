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
        
        if (!user || !chatRoom || !user.chatRoomIds.includes(chatRoom.id)) {
            console.log("Client disconnected: " + client.id);
            client.disconnect();
            return;
        }
        client.join(chatRoom.id);

        this.server.to(chatRoom.id).emit('onlineUsersInRoom', await this.chatService.getOnlineUsersInRoom(chatRoom, this.server));
        this.server.to(client.id).emit('adminsInRoom', chatRoom.adminIds);
        this.server.to(client.id).emit('mutedUsersInRoom', await this.chatService.getMutedUsersInRoom(chatRoom));
        this.server.to(client.id).emit('ownersInRoom', chatRoom.ownerId);
        this.server.to(client.id).emit('allUsersInRoom', await this.chatService.getAllUsersInRoom(chatRoom));
        this.server.to(client.id).emit('messages', await this.chatService.getMessages(chatRoom));
    }

    async handleDisconnect(client: Socket) {
        
        console.log("Client disconnected: " + client.id);

        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));
        this.server.to(chatRoom.id).emit('onlineUsersInRoom', await this.chatService.getOnlineUsersInRoom(chatRoom, this.server));
    }

    @SubscribeMessage('newMessageToServer')
    async handleNewMessage(client: Socket, message: string) {

        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if ((await this.chatService.getMutedUsersInRoom(chatRoom)).includes(userId))
            throw new Error("You can't send messages right now. You are muted.");

        await this.chatService.createNewMessage(userId, chatRoom.id, message);
        this.server.to(chatRoom.id).emit('messages', await this.chatService.getMessages(chatRoom));
    }

    @SubscribeMessage('setAdmin')
    async handleSetAdmin(client: Socket, newAdminId: number) {
        
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (chatRoom.ownerId != userId) {
            throw new Error('You need to be channel owner to execute this command.');
        }
        else if (chatRoom.adminIds.includes(newAdminId)) {
            throw new Error('The user is already an admin of this channel.');
        }
        else if (!(await this.chatService.getAllUsersIdsInRoom(chatRoom)).includes(newAdminId)) {
            throw new Error('The user needs to be in channel to be promoted as an admin.');
        }

        chatRoom.adminIds.push(newAdminId);
        await this.chatService.update(chatRoom);
        this.server.to(chatRoom.id).emit('adminsInRoom', chatRoom.adminIds);
    }

    @SubscribeMessage('unsetAdmin')
    async handleUnsetAdmin(client: Socket, adminId: number) {
        
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (chatRoom.ownerId != userId) {
            throw new Error('You need to be channel owner to execute this command.');
        }
        else if (!chatRoom.adminIds.includes(adminId)) {
            throw new Error('The user is not an admin.');
        }
         else if (!(await this.chatService.getAllUsersIdsInRoom(chatRoom)).includes(adminId)) {
            throw new Error('The user needs to be in channel to be promoted as an admin.');
        }

        chatRoom.adminIds.splice(chatRoom.adminIds.indexOf(adminId), 1);
        await this.chatService.update(chatRoom);
        this.server.to(chatRoom.id).emit('adminsInRoom', chatRoom.adminIds);
    }

    @SubscribeMessage('kickUser')
    async handleKickUser(client: Socket, kickedUserId: number) {
        
        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!chatRoom.adminIds.includes(userId) && userId != chatRoom.ownerId) {
            throw new Error('You need to be owner/admin to execute this command.');
        }
        else if (chatRoom.adminIds.includes(kickedUserId) && userId != chatRoom.ownerId) {
            throw new Error("You can't kick the channel owner or an admin.");
        }
        else if (!(await this.chatService.getAllUsersIdsInRoom(chatRoom)).includes(kickedUserId)) {
            throw new Error('The user needs to be in channel to be kicked.');
        }

        const clientsOfUser = await this.chatService.userIdtoClients(kickedUserId, chatRoom, this.server);
        clientsOfUser.forEach((client) => client.disconnect()); // Burada ekstradan 'kickListen' gibi bir şeye emit de atılabilir o clientlar için
        this.server.to(chatRoom.id).emit('onlineUsersInRoom', await this.chatService.getOnlineUsersInRoom(chatRoom, this.server));
        this.server.to(client.id).emit('allUsersInRoom', await this.chatService.getAllUsersInRoom(chatRoom));
    }

    @SubscribeMessage('muteUser')
    async handleMuteUser(client: Socket, mutedUserId: number) {

        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!chatRoom.adminIds.includes(userId) && userId != chatRoom.ownerId) {
            throw new Error('You need to be admin to execute this command.');
        }
        else if (chatRoom.adminIds.includes(mutedUserId) && userId != chatRoom.ownerId) {
            throw new Error("You can't mute the channel owner or an admin.");
        }
        else if (!(await this.chatService.getAllUsersIdsInRoom(chatRoom)).includes(mutedUserId)) {
            throw new Error('The user needs to be in channel to be muted.');
        }

        await this.chatService.createNewMute(mutedUserId, Date.now() + 60000, chatRoom.id); // 1 dk hardcoded
        this.server.to(chatRoom.id).emit('mutedUsersInRoom', await this.chatService.getMutedUsersInRoom(chatRoom));
    }

    @SubscribeMessage('banUser')
    async handleBanUser(client: Socket, bannedUserId: number) {

        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!chatRoom.adminIds.includes(userId) && userId != chatRoom.ownerId) {
            throw new Error('You need to be admin to execute this command.');
        }
        else if (chatRoom.adminIds.includes(bannedUserId) && userId != chatRoom.ownerId) {
            throw new Error("You can't ban the channel owner or an admin.");
        }
        else if (!(await this.chatService.getAllUsersIdsInRoom(chatRoom)).includes(bannedUserId)) {
            throw new Error('The user needs to be in channel to be banned.');
        }

        await this.chatService.createNewBan(bannedUserId, Date.now() + 120000, chatRoom.id); // 2 dk hardcoded
        const clientsOfUser = await this.chatService.userIdtoClients(bannedUserId, chatRoom, this.server);
        clientsOfUser.forEach((client) => client.disconnect()); // Burada ekstradan 'kickListen' gibi bir şeye emit de atılabilir o clientlar için
        this.server.to(chatRoom.id).emit('onlineUsersInRoom', await this.chatService.getOnlineUsersInRoom(chatRoom, this.server));
        this.server.to(client.id).emit('allUsersInRoom', await this.chatService.getAllUsersInRoom(chatRoom));
    }

    @SubscribeMessage('blockUser')
    async handleBlockUser(client: Socket, blockedUserId: number) {

        const user: User = await this.userService.findUserbyID(parseInt(this.chatService.strFix(client.handshake.query.userId)));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (!(await this.chatService.getAllUsersIdsInRoom(chatRoom)).includes(blockedUserId)) {
            throw new Error('The user needs to be in channel to be blocked.');
        }
        else if (user.blockedUserIds.includes(blockedUserId)) {
            throw new Error('The user is already blocked.');
        }
        
        await this.userService.blockUser(user, blockedUserId);
    }

    @SubscribeMessage('handOverOwnership')
    async handleHandOverOwnership(client: Socket, newOwnerId: number) {

        const userId: number = parseInt(this.chatService.strFix(client.handshake.query.userId));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        if (chatRoom.ownerId != userId) {
            throw new Error('You need to be channel owner to execute this command.');
        }
        else if (!(await this.chatService.getAllUsersIdsInRoom(chatRoom)).includes(newOwnerId)) {
            throw new Error('The user needs to be in channel to be prometed as channel owner.');
        }

        chatRoom.ownerId = newOwnerId;
        if (!chatRoom.adminIds.includes(newOwnerId)) {
            chatRoom.adminIds.push(newOwnerId);
        }
        await this.chatService.update(chatRoom);
        this.server.to(chatRoom.id).emit('ownersInRoom', chatRoom.ownerId);
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket) {
        
        const user: User = await this.userService.findUserbyID(parseInt(this.chatService.strFix(client.handshake.query.userId)));
        const chatRoom: Chatroom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));

        const clientsOfUser = await this.chatService.userIdtoClients(user.id, chatRoom, this.server);
        clientsOfUser.forEach((client) => client.disconnect()); // Burada ekstradan 'kickListen' gibi bir şeye emit de atılabilir o clientlar için
        
        if (await this.chatService.leaveRoom(user, chatRoom, this.server)) {
            const updatedChatRoom = await this.chatService.findChatRoombyID(this.chatService.strFix(client.handshake.query.roomId));
            this.server.to(chatRoom.id).emit('onlineUsersInRoom', await this.chatService.getOnlineUsersInRoom(updatedChatRoom, this.server));
            this.server.to(chatRoom.id).emit('adminsInRoom', updatedChatRoom.adminIds);
            this.server.to(chatRoom.id).emit('ownersInRoom', updatedChatRoom.ownerId);
            this.server.to(client.id).emit('allUsersInRoom', await this.chatService.getAllUsersInRoom(updatedChatRoom));
        }
    }
}