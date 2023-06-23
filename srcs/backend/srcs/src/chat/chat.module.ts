import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { UsersModule } from "src/users/users.module";
import { DirectGateway } from "./direct.gateway";
import { DirectService } from "./direct.service";

@Module({
    imports: [UsersModule],
    providers: [ChatGateway, ChatService, DirectGateway, DirectService],
    controllers: [ChatController]
})
export class ChatModule {}