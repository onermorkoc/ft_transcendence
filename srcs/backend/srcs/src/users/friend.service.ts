import { BadRequestException, Body, Injectable, Session, UnauthorizedException } from "@nestjs/common";
import { FriendRequest, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "./users.service";

@Injectable()
export class FriendService {
    constructor(private prismaService: PrismaService, private userService: UsersService) {}

    async createFriendRequest(receiverId: string, @Session() session: Record<string, any>) : Promise<FriendRequest> {
        const receiverIdNumber = parseInt(receiverId);

        if ((await this.getFriends(session.passport.user.id)).includes(receiverIdNumber)) {
            throw new BadRequestException('You are already friends with that user.');
        }
        else if (session.passport.user.id == receiverIdNumber) {
            throw new BadRequestException("You can't send a friend request to yourself.");
        }

        let uniqueIdentifier: string;
        if (session.passport.user.id < receiverIdNumber) {
            uniqueIdentifier = (session.passport.user.id).toString() + "_" + receiverId;
        }
        else {
            uniqueIdentifier = receiverId + "_" + (session.passport.user.id).toString();
        }

        return this.prismaService.friendRequest.create({
            data: {
                sender: { connect: { id: session.passport.user.id } },
                receiver: { connect: { id: receiverIdNumber } },
                uniqueIdentifier: uniqueIdentifier
            }
        }).catch(e => {
            if (e instanceof Prisma.PrismaClientKnownRequestError && Array.isArray(e.meta?.target)) {
                if (e.meta.target.includes('senderId')) {
                    throw new BadRequestException('You already sent a friend request to that user.');
                }
                else if (e.meta.target.includes('uniqueIdentifier')) {
                    throw new BadRequestException('You already have a friend request from that user.');
                }
            }
            if (e.code == 'P2025') {
                throw new BadRequestException('There is no user with that id.');
            }
            throw e;
        })
    }

    async acceptRequest(@Body() body: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        if (session.passport.user.id != body.receiverId) {
            throw new UnauthorizedException('You have no permission to do that.');
        }

        const request = await this.prismaService.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: body.senderId,
                    receiverId: body.receiverId
                }
            }
        })

        if (request == null) {
            throw new BadRequestException("You can't accept a request that doesn't exist.");
        }

        const sender = await this.prismaService.user.findUnique({
            where: {
                id: body.senderId
            }
        })

        const receiver = await this.prismaService.user.findUnique({
            where: {
                id: body.receiverId
            }
        })

        sender.friendIds.push(body.receiverId);
        receiver.friendIds.push(body.senderId);

        await this.userService.update(sender, session);
        await this.userService.update(receiver, session);

        await this.prismaService.friendRequest.delete({
            where: {
                senderId_receiverId: {
                    senderId: body.senderId,
                    receiverId: body.receiverId
                }
            }
        });
        return true;
    }

    async rejectRequest(@Body() body: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        if (session.passport.user.id != body.receiverId) {
            throw new UnauthorizedException('You have no permission to do that.');
        }

        const request = await this.prismaService.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: body.senderId,
                    receiverId: body.receiverId
                }
            }
        })

        if (request == null) {
            throw new BadRequestException("You can't reject a request that doesn't exist.");
        }

        await this.prismaService.friendRequest.delete({
            where: {
                senderId_receiverId: {
                    senderId: body.senderId,
                    receiverId: body.receiverId
                }
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