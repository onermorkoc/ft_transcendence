import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [UsersModule],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController]
})
export class ChatModule {}