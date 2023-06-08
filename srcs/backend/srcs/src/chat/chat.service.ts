import { BadRequestException, Injectable } from '@nestjs/common';
import { Chatroom, RoomStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class ChatService {
    constructor (private prismaService: PrismaService) {}

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

    async hashPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt();
        const hash: string = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
