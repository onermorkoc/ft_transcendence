import { Body, Controller, Delete, Get, Param, Post, Session, UseGuards } from "@nestjs/common";
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
        console.log(this.friendService.getSentRequests(userId));
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

    @Delete('accept')
    async acceptRequest(@Body() body: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        return this.friendService.acceptRequest(body, session);
    }

    @Delete('reject')
    async rejectRequest(@Body() body: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        return this.friendService.rejectRequest(body, session);
    }
}