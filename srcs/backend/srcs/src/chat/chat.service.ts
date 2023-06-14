import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { BanObject, Chatroom, Message, MuteObject, RoomStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service';
import { RemoteSocket, Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
    constructor (private prismaService: PrismaService, private userService: UsersService, @Inject(forwardRef(() => ChatGateway)) private chatGateway: ChatGateway) {}

    async getAllRooms(): Promise<Array<Chatroom>> {
        return (await this.prismaService.chatroom.findMany())
    }

    async getMyChatRooms(chatRoomIds: Array<string>): Promise<Array<Chatroom>> {
        let chatRooms: Array<Chatroom> = []
        for (const roomId of chatRoomIds)
            chatRooms.push(await this.findChatRoombyID(roomId))
        return (chatRooms)
    }

    async findChatRoombyID(roomId: string): Promise<Chatroom> {
        return this.prismaService.chatroom.findUnique({
            where: {
                id: roomId
            }
        })
    }

    async update(newChatRoomInfo: Partial<Chatroom>): Promise<boolean> { // newChatRoomInfo içinde kesinlikle id olmalı
        try{
            await this.prismaService.chatroom.update({
                where: {
                    id: newChatRoomInfo.id
                },
                data: newChatRoomInfo
            })
        }
        catch (error) {
            return false
        }
        return true
    }

    async createRoom(userId: number, roomName: string, roomStatus: RoomStatus, password?: string): Promise<Chatroom> {
        
        if (roomStatus === RoomStatus.PROTECTED && password === null)   // Bu Kontrol frontende yapıldı
            throw new BadRequestException('Password needed.');
        
        const chatRoom = await this.prismaService.chatroom.create({
            data: {
                name: roomName,
                ownerId: userId,
                roomStatus: roomStatus
            }
        });

        if (roomStatus == RoomStatus.PROTECTED) {
            const hashedPassword = await this.hashPassword(password);
            chatRoom.password = hashedPassword;
            await this.update(chatRoom);
        }

        const user: User = await this.userService.findUserbyID(userId);
        user.chatRoomIds.push(chatRoom.id);
        await this.userService.update(user);

        return (chatRoom);
    }

    async joinRoom(userId: number, roomId: string, password?: string): Promise<Chatroom> {

        const chatRoom: Chatroom = await this.findChatRoombyID(roomId);

        if (chatRoom.roomStatus === RoomStatus.PRIVATE){    // Bu Kontrol frontende yapıldı
            throw new BadRequestException('You cannot join a private chatroom.');
        }
        else if (chatRoom.roomStatus === RoomStatus.PROTECTED) {
            
            if (password === null)  // Bu Kontrol frontende yapıldı
                throw new BadRequestException('Password needed.');
            
            const isPassCorrect: boolean = await this.comparePassword(password, chatRoom.password);
            if (!isPassCorrect)
                throw new BadRequestException('Yanlış parola !');
        }

        if ((await this.getBannedUserInRoom(chatRoom.id)).includes(userId))
            throw new BadRequestException('Sen bu kanaldan banlandın !');

        const user: User = await this.userService.findUserbyID(userId);
        if (!user.chatRoomIds.includes(roomId)) {   // Bu Kontrol frontende yapıldı
            user.chatRoomIds.push(roomId);
            chatRoom.userCount++;
            await this.userService.update(user);
            await this.update(chatRoom);
        }

        this.chatGateway.server.to(chatRoom.id).emit('allUsersInRoom', await this.getAllUsersInRoom(chatRoom));        
        return (chatRoom);
    }

    async hashPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt();
        const hash: string = await bcrypt.hash(password, salt);
        return (hash);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return (bcrypt.compare(password, hash));
    }

    strFix(str: string | string[]): string {
        return (Array.isArray(str) ? null : str)
    }

    async getMessages(chatRoom: Chatroom): Promise<Array<Message>>{
        return await this.prismaService.message.findMany({
            where: {
                chatroomId: chatRoom.id
            }
        });
    }

    async createNewMessage(userId: number, roomId: string, message: string): Promise<Message> {
        const msg: Message = await this.prismaService.message.create({
            data: {
                userId: userId,
                data: message,
                chatroom: { connect: { id: roomId } }
            }
        });
        this.databaseDeleteOldMessages(msg.chatroomId);
        return (msg);
    }

    async createNewMute(userId: number, expireDate: number, roomId: string,): Promise<MuteObject> {
        return this.prismaService.muteObject.create({
            data: {
                userId: userId,
                expireDate: expireDate,
                chatroom: { connect: { id: roomId } }
            }
        });
    }

    async createNewBan(userId: number, expireDate: number, roomId: string): Promise<MuteObject> {
        
        const user = await this.userService.findUserbyID(userId);
        const chatRoom = await this.findChatRoombyID(roomId)

        user.chatRoomIds.splice(user.chatRoomIds.indexOf(roomId), 1);
        chatRoom.userCount--
        
        await this.update(chatRoom)
        await this.userService.update(user);
        
        return this.prismaService.banObject.create({
            data: {
                userId: userId,
                expireDate: expireDate,
                chatroom: { connect: { id: roomId } }
            }
        });
    }

    async databaseDeleteOldMessages(roomId: string) {
        const messages: Array<Message> = await this.prismaService.message.findMany({
            where: {
                chatroomId: roomId
            }
        });
        while (messages.length > 30) {
            const delMsgId = messages[0].id;
            await this.prismaService.message.delete({
                where: {
                    id: delMsgId
                }
            });
            messages.splice(0, 1);
        }
    }

    async getOnlineUsersInRoom(chatRoom: Chatroom, server: Server): Promise<Array<number>> {
        const clientsInRoom: RemoteSocket<DefaultEventsMap, any>[] = await server.in(chatRoom.id).fetchSockets();
        const userIdsInRoom: Array<number> = clientsInRoom.map((obj) => parseInt(this.strFix(obj.handshake.query.userId)));
        const uniqueUserIdsInRoom: Array<number> = [...new Set(userIdsInRoom)];
        return (uniqueUserIdsInRoom);
    }

    async getAllUsersIdsInRoom(chatRoom: Chatroom): Promise<Array<number>>{ // Bu daha optimize şekilde yazılabilir
        const usersInfo = await this.getAllUsersInRoom(chatRoom)
        let userIds: Array<number> = []
        for (const user of usersInfo)
            userIds.push(user.id)
        return (userIds)
    }

    async getAllUsersInRoom(chatRoom: Chatroom): Promise<Array<User>> {
        return await this.prismaService.user.findMany({
            where: {
                chatRoomIds: {
                    has: chatRoom.id
                }
            }
        });
    }

    async getMutedUsersInRoom(chatRoom: Chatroom): Promise<Array<number>> {
        const muteObjects: Array<MuteObject> = await this.prismaService.muteObject.findMany({
            where: {
                chatroomId: chatRoom.id
            }
        });
        const mutedUsers: Array<number> = muteObjects.map((obj) => {
            return obj.userId;
        });
        return (mutedUsers);
    }

    async userIdtoClients(userId: number, chatRoom: Chatroom, server: Server): Promise<RemoteSocket<DefaultEventsMap, any>[]> {
        const socketsInRoom: RemoteSocket<DefaultEventsMap, any>[] = await server.in(chatRoom.id).fetchSockets();
        const clientsOfUser: RemoteSocket<DefaultEventsMap, any>[] = socketsInRoom.filter((obj) => parseInt(this.strFix(obj.handshake.query.userId)) == userId);
        return (clientsOfUser);
    }

    async updateBans(roomId: string): Promise<void> {
        const banObjects: Array<BanObject> = await this.prismaService.banObject.findMany({
            where: {
                chatroomId: roomId
            }
        });
        for (const obj of banObjects) {
            if (obj.expireDate <= Date.now()) {
                await this.prismaService.banObject.delete({
                    where: {
                        id: obj.id
                    }
                });
            }
        }
    }

    async getBannedUserInRoom(roomId: string): Promise<Array<number>> {
        await this.updateBans(roomId);
        const banObjects: Array<BanObject> = await this.prismaService.banObject.findMany({
            where: {
                chatroomId: roomId
            }
        });
        const bannedUsers: Array<number> = banObjects.map((obj) => {
            return obj.userId;
        });
        return (bannedUsers);
    }

    async leaveRoom(user: User, chatRoom: Chatroom, server: Server): Promise<boolean> {
        
        if (chatRoom.ownerId === user.id) {
            
            let newOwner = chatRoom.adminIds[0] // ilk admin olan kişi yeni owner

            if (newOwner === undefined) {
                const usersIds: Array<number> = await this.getAllUsersIdsInRoom(chatRoom)
                usersIds.forEach((obj) => {
                    if (obj != user.id) {
                        newOwner = obj; // Grubta admin yoksa yeni owner rastgele biri oluyor
                        return;
                    }
                });
            }

            if (newOwner == undefined) { // Yine owner yoksa grubu sil
                user.chatRoomIds.splice(user.chatRoomIds.indexOf(chatRoom.id), 1);
                await this.userService.update(user);
                await this.deleteChatRoom(chatRoom);
                return (false);
            }
            else
                chatRoom.ownerId = newOwner;     
        }
        else if (chatRoom.adminIds.includes(user.id))
            chatRoom.adminIds.splice(chatRoom.adminIds.indexOf(user.id), 1);

        user.chatRoomIds.splice(user.chatRoomIds.indexOf(chatRoom.id), 1);
        chatRoom.userCount--;
        await this.update(chatRoom);
        await this.userService.update(user);
        return (true);
    }

    async deleteChatRoom(chatRoom: Chatroom) {
        await this.prismaService.message.deleteMany({
            where: {
                chatroomId: chatRoom.id
            }
        });
        await this.prismaService.banObject.deleteMany({
            where: {
                chatroomId: chatRoom.id
            }
        });
        await this.prismaService.muteObject.deleteMany({
            where: {
                chatroomId: chatRoom.id
            }
        });
        await this.prismaService.chatroom.delete({
            where: {
                id: chatRoom.id
            }
        })
    }
}
