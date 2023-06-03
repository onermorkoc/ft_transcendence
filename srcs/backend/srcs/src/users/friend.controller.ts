import { Controller, Delete, Get, Param, Post, Session } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendRequest } from "@prisma/client";

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

    @Post('send-request/:receiverId')
    async sendRequest(@Param('receiverId') receiverId: string, @Session() session: Record<string, any>): Promise<FriendRequest> {
        return this.friendService.createFriendRequest(receiverId, session);
    }

    @Delete(':requestId/accept')
    async acceptRequest(@Param('requestId') requestId: string, @Session() session: Record<string, any>): Promise<boolean> {
        return this.friendService.acceptRequest(requestId, session);
    }

    @Delete(':requestId/reject')
    async rejectRequest(@Param('requestId') requestId: string, @Session() session: Record<string, any>): Promise<boolean> {
        return this.friendService.rejectRequest(requestId, session);
    }
}