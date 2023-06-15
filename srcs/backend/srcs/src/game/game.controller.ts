import { Body, Controller, Get, Param, Post, Session, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { GameService } from "./game.service";

@Controller('game')
export class GameController{
    constructor(private gameService: GameService) {}

    @Get('join/:gameID')
    @UseGuards(AuthenticatedGuard)
    async canIPlay(@Param('gameID') gameId: string, @Session() session: Record<string, any>) {
        return (await this.gameService.joinGame(session.passport.user.id, gameId));
    }
}