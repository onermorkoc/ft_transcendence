import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from './game.service';
import { GameGateway } from "./game.gateway";

@Module({
    imports: [],
    controllers: [GameController],
    providers: [GameGateway, GameService]
})
export class GameModule {}