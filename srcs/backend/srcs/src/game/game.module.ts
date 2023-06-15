import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from './game.service';
import { GameGateway } from "./game.gateway";
import { QueueGateway } from "./queue.gateway";
import { QueueService } from "./queue.service";

@Module({
    controllers: [GameController],
    providers: [GameGateway, GameService, QueueGateway, QueueService]
})
export class GameModule {}