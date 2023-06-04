import { BadRequestException, Body, Controller, Get, Param, Post, Session, UseGuards } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendRequest } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";

@Controller('friends')
export class FriendController {
    constructor(private friendService: FriendService) {}

    @Get(':userId') // Frontende kullanılmadı
    @UseGuards(AuthenticatedGuard)
    async getFriendIds(@Param('userId') userId: string): Promise<number[]> {
        return (this.friendService.getFriends(parseInt(userId)))
    }

    @Get(':userId/sent-requests') // Frontende kullanılmadı
    @UseGuards(AuthenticatedGuard)
    async getSentRequests(@Param('userId') userId: string): Promise<FriendRequest[]> {
        return (this.friendService.getSentRequests(parseInt(userId)))
    }

    @Get(':userId/received-requests')
    @UseGuards(AuthenticatedGuard)
    async getReceivedRequests(@Param('userId') userId: string): Promise<FriendRequest[]> {
        return (this.friendService.getReceivedRequests(parseInt(userId)))
    }

    @Post('send-request/:receiverId')
    @UseGuards(AuthenticatedGuard)
    async sendRequest(@Param('receiverId') receiverId: string, @Session() session: Record<string, any>): Promise<FriendRequest> {
        return (this.friendService.createFriendRequest(session.passport.user.id, parseInt(receiverId)))
    }

    @Post('accept')
    @UseGuards(AuthenticatedGuard)
    async acceptRequest(@Body() requestData: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        if (session.passport.user.id != requestData.receiverId)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.acceptRequest(requestData))
    }

    @Post('reject')
    @UseGuards(AuthenticatedGuard)
    async rejectRequest(@Body() requestData: { senderId: number, receiverId: number }, @Session() session: Record<string, any>): Promise<boolean> {
        if (session.passport.user.id != requestData.receiverId)
            throw new BadRequestException('You have no permission to do that.')
        return (this.friendService.rejectRequest(requestData))
    }

    @Post("unfriend")
    @UseGuards(AuthenticatedGuard)
    async unFriend(@Body() body: {userId: number}, @Session() session: Record<string, any>){
        return (await this.friendService.unFriend(session.passport.user.id, body.userId))
    }
}