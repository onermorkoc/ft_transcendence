import { BadRequestException, Body, Controller, Get, Param, Post, Session } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendRequest } from "@prisma/client";

@Controller('friends')
export class FriendController {
    constructor(private friendService: FriendService) {}

    @Get(':userId') // Frontende kullanılmadı
    async getFriendIds(@Param('userId') userId: string, @Session() session: Record<string, any>): Promise<number[]> {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.getFriends(parseInt(userId)))
    }

    @Get(':userId/sent-requests') // Frontende kullanılmadı
    async getSentRequests(@Param('userId') userId: string, @Session() session: Record<string, any>): Promise<FriendRequest[]> {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.getSentRequests(parseInt(userId)))
    }

    @Get(':userId/received-requests')
    async getReceivedRequests(@Param('userId') userId: string, @Session() session: Record<string, any>): Promise<FriendRequest[]> {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.getReceivedRequests(parseInt(userId)))
    }

    @Post('send-request/:receiverId')
    async sendRequest(@Param('receiverId') receiverId: string, @Session() session: Record<string, any>): Promise<FriendRequest> {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.createFriendRequest(session.passport.user.id, parseInt(receiverId)))
    }

    @Post('accept')
    async acceptRequest(@Body() requestDaa: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        if (!session.passport || session.passport.user.id != requestDaa.receiverId)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.acceptRequest(requestDaa))
    }

    @Post('reject')
    async rejectRequest(@Body() requestData: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        if (!session.passport || session.passport.user.id != requestData.receiverId)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.rejectRequest(requestData))
    }
}