import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [UsersModule],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController]
})
export class ChatModule {}