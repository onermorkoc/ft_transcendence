import { BadRequestException, Injectable } from '@nestjs/common';
import { Chatroom, Message, RoomStatus, User } from '@prisma/client';
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

    async createRoom(body: { roomName: string, ownerId: number, roomStatus: RoomStatus, password?: string }): Promise<Chatroom> {
        const chatRoom = await this.prismaService.chatroom.create({
            data: {
                name: body.roomName,
                ownerId: body.ownerId,
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
        chatRoom.adminIds.push(body.ownerId);
        await this.update(chatRoom);
        return chatRoom;
    }

    async joinRoom(body: { userId: number, roomId: string, password?: string }) {
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

        const user: User = await this.userService.findUserbyID(body.userId);
        user.chatRoomIds.push(body.roomId);
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
}
