import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { RoomStatus } from '@prisma/client';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('room/create')
    @UseGuards(AuthenticatedGuard)
    createRoom(@Body() body: { roomName: string, ownerId: number, roomStatus: RoomStatus, password?: string }) {
        return this.chatService.createRoom(body);
    }

    @Post('room/join')
    @UseGuards(AuthenticatedGuard)
    joinRoom(@Body() body: { userId: number, roomId: string, password?: string }) {
        return this.chatService.joinRoom(body);
    }
}
