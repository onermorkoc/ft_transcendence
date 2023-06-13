import { Body, Controller, Get, Param, Post, Session, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Chatroom, RoomStatus } from '@prisma/client';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('room/create')
    @UseGuards(AuthenticatedGuard)
    async createRoom(@Body() body: { roomName: string, roomStatus: RoomStatus, password?: string }, @Session() session: Record<string, any>) {
        return (await this.chatService.createRoom(body, session));
    }

    @Post('room/join')
    @UseGuards(AuthenticatedGuard)
    async joinRoom(@Body() body: { roomId: string, password?: string }, @Session() session: Record<string, any>) {
        return (await this.chatService.joinRoom(body, session));
    }

    @Get('room/find/:id') // frontend url güvenliği eksik 
    async getRoom(@Param('id') roomId: string){
        return (await this.chatService.findChatRoombyID(roomId))
    }

    @Get('room/all') // backend url güvenliği eksik
    async getAllRooms(): Promise<Array<Chatroom>> {
        return (await this.chatService.getAllRooms())
    }
}
