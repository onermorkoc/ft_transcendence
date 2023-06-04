import { BadRequestException,  Injectable} from "@nestjs/common";
import { FriendRequest, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "./users.service";

@Injectable()
export class FriendService {
    constructor(private prismaService: PrismaService, private userService: UsersService) {}

    async createFriendRequest(senderId: number, receiverId: number) : Promise<FriendRequest> {

        if ((await this.getFriends(senderId)).includes(receiverId))
            throw new BadRequestException('You are already friends with that user.');
        else if (senderId == receiverId)
            throw new BadRequestException("You can't send a friend request to yourself.");

        let uniqueIdentifier: string

        if (senderId < receiverId)
            uniqueIdentifier = `${senderId}_${receiverId}`
        else 
            uniqueIdentifier = `${receiverId}_${senderId}`

        return this.prismaService.friendRequest.create({
            data: {
                sender: { connect: { id: senderId } },
                receiver: { connect: { id: receiverId } },
                uniqueIdentifier: uniqueIdentifier
            }
        }).catch(e => {
            if (e instanceof Prisma.PrismaClientKnownRequestError && Array.isArray(e.meta?.target)) {
                if (e.meta.target.includes('senderId'))
                    throw new BadRequestException('You already sent a friend request to that user.');
                else if (e.meta.target.includes('uniqueIdentifier'))
                    throw new BadRequestException('You already have a friend request from that user.');
            }
            if (e.code == 'P2025')
                throw new BadRequestException('There is no user with that id.');
            throw e;
        })
    }

    async acceptRequest(requestData: { senderId: number, receiverId: number }): Promise<boolean> {

        const request = await this.prismaService.friendRequest.findUnique({
            where: {
                senderId_receiverId: requestData
            }
        })

        if (request == null)
            throw new BadRequestException("You can't accept a request that doesn't exist.");

        const sender = await this.userService.findUserbyID(requestData.senderId)
        const receiver = await this.userService.findUserbyID(requestData.receiverId)

        sender.friendIds.push(requestData.receiverId);
        receiver.friendIds.push(requestData.senderId);

        await this.userService.update(sender);
        await this.userService.update(receiver);

        await this.prismaService.friendRequest.delete({
            where: {
                senderId_receiverId: requestData
            }
        })
        return (true)
    }

    async rejectRequest(requestData: { senderId: number, receiverId: number }): Promise<boolean> {
        
        const request = await this.prismaService.friendRequest.findUnique({
            where: {
                senderId_receiverId: requestData
            }
        })

        if (request == null)
            throw new BadRequestException("You can't reject a request that doesn't exist.")

        await this.prismaService.friendRequest.delete({
            where: {
                senderId_receiverId: requestData
            }
        })
        return (true)
    }

    async getFriends(userId: number): Promise<number[]> {
        return ((await this.userService.findUserbyID(userId)).friendIds)
    }

    async getSentRequests(userId: number): Promise<FriendRequest[]> {
        return (await this.findUserByID(userId).sentFriendRequests())
    }

    async getReceivedRequests(userId: number): Promise<FriendRequest[]> {
        return (await this.findUserByID(userId).receivedFriendRequests())
    }

    private findUserByID(userId: number) {
        return (this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        }))
    }

    async unFriend(myID: number, otherID: number){
        const myFriendIds = (await this.userService.findUserbyID(myID)).friendIds
        const otherFriends = (await this.userService.findUserbyID(otherID)).friendIds
        myFriendIds.splice(myFriendIds.indexOf(otherID), 1)
        otherFriends.splice(otherFriends.indexOf(myID), 1)
        await this.userService.update({id: myID, friendIds: myFriendIds})
        await this.userService.update({id: otherID, friendIds: otherFriends})
    }
}