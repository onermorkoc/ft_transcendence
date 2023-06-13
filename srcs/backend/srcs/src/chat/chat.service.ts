import { BadRequestException, Injectable } from '@nestjs/common';
import { BanObject, Chatroom, Message, MuteObject, RoomStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service';
import { RemoteSocket, Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
export class ChatService {
    constructor (private prismaService: PrismaService, private userService: UsersService) {}

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

    async createRoom(body: { roomName: string, roomStatus: RoomStatus, password?: string }, session: Record<string, any>): Promise<Chatroom> {
        const userId = session.passport.user.id;
        const chatRoom = await this.prismaService.chatroom.create({
            data: {
                name: body.roomName,
                ownerId: userId,
                roomStatus: body.roomStatus
            }
        });
        if (body.roomStatus == RoomStatus.PROTECTED) {
            if (!body.password) {
                this.prismaService.chatroom.delete({
                    where: {
                        id: chatRoom.id
                    }
                });
                throw new BadRequestException('Password needed.');
            }
            const hashedPassword = await this.hashPassword(body.password);
            chatRoom.password = hashedPassword;
            await this.update(chatRoom);
        }
        chatRoom.adminIds.push(userId);
        await this.update(chatRoom);
        return chatRoom;
    }

    async joinRoom(body: { roomId: string, password?: string }, session: Record<string, any>): Promise<boolean> {
        const userId = session.passport.user.id;
        const chatRoom: Chatroom = await this.findChatRoombyID(body.roomId);

        if (chatRoom.roomStatus == RoomStatus.PRIVATE) {
            throw new BadRequestException('You cannot join a private chatroom.');
        }
        else if (chatRoom.roomStatus == RoomStatus.PROTECTED) {
            if (!body.password) {
                throw new BadRequestException('Password needed.');
            }
            const isPassCorrect: boolean = await this.comparePassword(body.password, chatRoom.password);
            if (!isPassCorrect) {
                throw new BadRequestException('Wrong Password.');
            }
        }
        if ((await this.getBannedUserIds(chatRoom.id)).includes(userId)) {
            throw new BadRequestException('You are banned from this Channel.');
        }

        const user: User = await this.userService.findUserbyID(userId);
        if (!user.chatRoomIds.includes(body.roomId)) {
            user.chatRoomIds.push(body.roomId);
            await this.userService.update(user);
        }
        return true;
    }

    async hashPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt();
        const hash: string = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    strFix(str: string | string[]): string {
        if (Array.isArray(str)) {
            return null;
        }
        else {
            return str;
        }
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
        return msg;
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

    async getUsersInRoom(chatRoom: Chatroom, server: Server): Promise<Array<number>> {
        const clientsInRoom: RemoteSocket<DefaultEventsMap, any>[] = await server.in(chatRoom.id).fetchSockets();
        const userIdsInRoom: Array<number> = clientsInRoom.map((obj) => parseInt(this.strFix(obj.handshake.query.userId)));
        const uniqueUserIdsInRoom: Array<number> = [...new Set(userIdsInRoom)];
        return uniqueUserIdsInRoom;
    }

    async getAdminsInRoom(chatRoom: Chatroom, server: Server): Promise<Array<number>> {
        const usersInRoom = await this.getUsersInRoom(chatRoom, server);
        const adminsInRoom: Array<number> = chatRoom.adminIds.filter((value) => usersInRoom.includes(value));
        return adminsInRoom;
    }

    async getMutedUsersInRoom(chatRoom: Chatroom, server: Server): Promise<Array<number>> {
        const muteObjects: Array<MuteObject> = await this.prismaService.muteObject.findMany({
            where: {
                chatroomId: chatRoom.id
            }
        });
        const mutedUsers: Array<number> = muteObjects.map((obj) => {
            return obj.userId;
        });
        const usersInRoom: Array<number> = await this.getUsersInRoom(chatRoom, server);
        const mutedUsersInRoom: Array<number> = mutedUsers.filter((value) => usersInRoom.includes(value));
        return mutedUsersInRoom;
    }

    async userIdtoClients(userId: number, chatRoom: Chatroom, server: Server): Promise<RemoteSocket<DefaultEventsMap, any>[]> {
        const socketsInRoom: RemoteSocket<DefaultEventsMap, any>[] = await server.in(chatRoom.id).fetchSockets();
        const clientsOfUser: RemoteSocket<DefaultEventsMap, any>[] = socketsInRoom.filter((obj) => parseInt(this.strFix(obj.handshake.query.userId)) == userId);
        return clientsOfUser;
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

    async getBannedUserIds(roomId: string): Promise<Array<number>> {
        await this.updateBans(roomId);
        const banObjects: Array<BanObject> = await this.prismaService.banObject.findMany({
            where: {
                chatroomId: roomId
            }
        });
        const bannedUsers: Array<number> = banObjects.map((obj) => {
            return obj.userId;
        });
        return bannedUsers;
    }
    
    async getUsersInfoInRoom(chatRoom: Chatroom, server: Server): Promise<Array<User>> {
        const userIdsInRoom = await this.getUsersInRoom(chatRoom, server) 
        let usersInfo: Array<User> = []
        for (const userId of userIdsInRoom)
            usersInfo.push(await this.userService.findUserbyID(userId))
        return (usersInfo)
    }
}
