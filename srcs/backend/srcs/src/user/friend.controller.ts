import { Controller, Delete, Get, Param, Post, Session } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendRequest, User } from "@prisma/client";

@Controller('friends')
export class FriendController {
    constructor(private friendService: FriendService) {}

    @Get(':userId')
    async getFriendIds(@Param('userId') userId: string): Promise<number[]> {
        return this.friendService.getFriends(userId);
    }

    @Get(':userId/sent-requests')
    async getSentRequests(@Param('userId') userId: string): Promise<FriendRequest[]> {
        return this.friendService.getSentRequests(userId);
    }

    @Get(':userId/received-requests')
    async getReceivedRequests(@Param('userId') userId: string): Promise<FriendRequest[]> {
        return this.friendService.getReceivedRequests(userId);
    }

    @Post(':senderId/send-request/:receiverId')
    async sendRequest(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string): Promise<FriendRequest> {
        return this.friendService.createFriendRequest(senderId, receiverId);
    }

    @Delete(':requestId/accept')
    async acceptRequest(@Param('requestId') requestId: number, @Session() session: Record<string, any>): Promise<boolean> {
        return this.friendService.acceptRequest(requestId, session);
    }

    @Delete(':requestId/reject')
    async rejectRequest(@Param('requestId') requestId: number, @Session() session: Record<string, any>): Promise<boolean> {
        return this.friendService.rejectRequest(requestId, session);
    }
}