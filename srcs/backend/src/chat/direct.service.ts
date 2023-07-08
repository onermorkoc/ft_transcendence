import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { DirectMessage, User } from '@prisma/client';

@Injectable()
export class DirectService {

    constructor(private prismaService: PrismaService, private usersService: UsersService){}

    strFix(str: string | string[]): string {
        return (Array.isArray(str) ? null : str)
    }

    createUniqueIdentifier(userIdOne: number, userIdTwo: number): string {
        return (userIdOne < userIdTwo ? `${userIdOne}_${userIdTwo}` : `${userIdTwo}_${userIdOne}`)
    }

    async getAllMessages(uniqueIdentifier: string): Promise<Array<DirectMessage>>{
        return ( await this.prismaService.directMessage.findMany({
            where: {
                uniqueIdentifier: uniqueIdentifier
            }
        }))
    }

    async createNewDirectMessage(senderId: number, uniqueIdentifier: string, data: string): Promise<boolean>{
        await this.deleteOldMessages(uniqueIdentifier)
        await this.prismaService.directMessage.create({
            data: {
                data: data,
                senderId: senderId,
                uniqueIdentifier: uniqueIdentifier
            }
        })
        return (true)
    }

    async getBlockedUserIdsInRoom(senderId: number, receiverId: number): Promise<Array<number>> {
        const senderUser: User = await this.usersService.findUserbyID(senderId)
        const receiverUser: User = await this.usersService.findUserbyID(receiverId)
        const blockedUserIdsInRoom: Array<number> = []
        if (receiverUser.blockedUserIds.includes(senderId))
            blockedUserIdsInRoom.push(senderId)
        if (senderUser.blockedUserIds.includes(receiverId))
            blockedUserIdsInRoom.push(receiverId)
        return (blockedUserIdsInRoom)
    }
    
    async deleteOldMessages(uniqueIdentifier: string) {
        const messages: Array<DirectMessage> = await this.getAllMessages(uniqueIdentifier)
        while (messages.length > 30) {
            const delMsgId = messages[0].id;
            await this.prismaService.directMessage.delete({
                where: {
                    id: delMsgId
                }
            });
            messages.splice(0, 1);
        }
    }
}