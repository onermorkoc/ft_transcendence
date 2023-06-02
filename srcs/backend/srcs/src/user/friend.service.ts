import { Injectable, Session } from "@nestjs/common";
import { FriendRequest } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "./user.service";

@Injectable()
export class FriendService {
    constructor(private prismaService: PrismaService, private userService: UserService) {}

    async createFriendRequest(senderId: number, receiverId: number) : Promise<FriendRequest> {
        return this.prismaService.friendRequest.create({
            data: {
                sender: { connect: { id: senderId} },
                receiver: { connect: { id: receiverId} }
            }
        });
    }

    async acceptRequest(requestId: number, @Session() session: Record<string, any>): Promise<boolean> {
        const senderId = (await this.prismaService.friendRequest.findUnique({
            where: {
                id: requestId
            }
        })).senderId;

        const receiverId = (await this.prismaService.friendRequest.findUnique({
            where: {
                id: requestId
            }
        })).receiverId;

        const sender = await this.prismaService.user.findUnique({
            where: {
                id: senderId
            }
        })

        const receiver = await this.prismaService.user.findUnique({
            where: {
                id: receiverId
            }
        })

        sender.friendIds.push(receiver.id);
        receiver.friendIds.push(sender.id);

        await this.userService.update(sender, session);
        await this.userService.update(receiver, session);

        await this.prismaService.friendRequest.delete({
            where: {
                id: requestId
            }
        });
        return true;
    }

    async getSentRequests(userId: number): Promise<FriendRequest[]> {
        return this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        }).sentFriendRequests();
    }

    async getReceivedRequests(userId: number): Promise<FriendRequest[]> {
        return this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        }).receivedFriendRequests();
    }
}