import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { RoomStatus } from '@prisma/client';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('room/create')
    @UseGuards(AuthenticatedGuard)
    createRoom(@Body() body: { roomName: string, roomStatus: RoomStatus, password?: string }, @Session() session: Record<string, any>) {
        return this.chatService.createRoom(body, session);
    }

    @Post('room/join')
    @UseGuards(AuthenticatedGuard)
    joinRoom(@Body() body: { roomId: string, password?: string }, @Session() session: Record<string, any>) {
        return this.chatService.joinRoom(body, session);
    }
}
