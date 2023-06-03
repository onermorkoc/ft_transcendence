import { Injectable, Session, UnauthorizedException } from "@nestjs/common";
import { FriendRequest, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "./user.service";

@Injectable()
export class FriendService {
    constructor(private prismaService: PrismaService, private userService: UserService) {}

    async createFriendRequest(receiverId: string, @Session() session: Record<string, any>) : Promise<FriendRequest> {
        const receiverIdNumber = parseInt(receiverId);
        return this.prismaService.friendRequest.create({
            data: {
                sender: { connect: { id: session.passport.user.id } },
                receiver: { connect: { id: receiverIdNumber } }
            }
        });
    }

    async acceptRequest(requestId: string, @Session() session: Record<string, any>): Promise<boolean> {
        const requestIdNumber = parseInt(requestId);
        const senderId = (await this.prismaService.friendRequest.findUnique({
            where: {
                id: requestIdNumber
            }
        })).senderId;

        const receiverId = (await this.prismaService.friendRequest.findUnique({
            where: {
                id: requestIdNumber
            }
        })).receiverId;

        if (session.passport.user.id != receiverId) {
            throw new UnauthorizedException('You have no permission to do that.');
        }

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
                id: requestIdNumber
            }
        });
        return true;
    }

    async rejectRequest(requestId: string, @Session() session: Record<string, any>): Promise<boolean> {
        const requestIdNumber = parseInt(requestId);
        const receiverId = (await this.prismaService.friendRequest.findUnique({
            where: {
                id: requestIdNumber
            }
        })).receiverId;

        if (session.passport.user.id != receiverId) {
            throw new UnauthorizedException('You have no permission to do that.');
        }

        await this.prismaService.friendRequest.delete({
            where: {
                id: requestIdNumber
            }
        });
        return true;
    }

    async getFriends(userId: string): Promise<number[]> {
        const userIdNumber = parseInt(userId);
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userIdNumber
            }
        })
        return user.friendIds;
    }

    async getSentRequests(userId: string): Promise<FriendRequest[]> {
        const userIdNumber = parseInt(userId);
        return this.prismaService.user.findUnique({
            where: {
                id: userIdNumber
            }
        }).sentFriendRequests();
    }

    async getReceivedRequests(userId: string): Promise<FriendRequest[]> {
        const userIdNumber = parseInt(userId);
        return this.prismaService.user.findUnique({
            where: {
                id: userIdNumber
            }
        }).receivedFriendRequests();
    }
}