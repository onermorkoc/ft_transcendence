import { Body, Controller, Get, Post, Req, Res, Session, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { FtAuthGuard } from "./guards/ft.guard";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { Response } from "express";
import { Request } from "express-session";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('login')
    @UseGuards(FtAuthGuard)
    login() {}

    @Get('callback')
    @UseGuards(FtAuthGuard)
    async callback(@Res() res: Response, @Session() session: Record<string, any>) {
        this.authService.callback(res, session);
    }

    @Get('logoff')
    @UseGuards(AuthenticatedGuard)
    logoff(@Session() session: Record<string, any>) {
        this.authService.logoff(session);
    }

    @Get('session')
    async session(@Session() session: Record<string, any>){     // TEST İÇİN
        console.log(session);
        console.log(session.id);
    }

    @Get('status')
    @UseGuards(AuthenticatedGuard)                              // TEST İÇİN
    status(@Req() req: Request) {
        return "sen giris yapilisin";
    }

    @Post('2fa/generate')
    @UseGuards(AuthenticatedGuard)
    async generateTwoFaSecret(@Session() session: Record<string, any>) {
        return this.authService.generateTwoFa(session);
    }

    @Get('2fa/showqr')
    @UseGuards(AuthenticatedGuard)
    async showQrTwoFa(@Session() session: Record<string, any>) {
        return this.authService.showQrTwoFa(session);
    }

    @Post('2fa/verify')
    @UseGuards(AuthenticatedGuard)
    async verifyTwoFa(@Body() body: {code: string}, @Session() session: Record<string, any>) {
        return this.authService.verifyTwoFa(body, session);
    }

    @Post('2fa/validate')
    async validateTwoFa(@Req() req: Request, @Res() res: Response, @Body() body: { code: string }) {
        return this.authService.validateTwoFa(req, res, body);
    }

    @Post('2fa/disable')
    @UseGuards(AuthenticatedGuard)
    async disableTwoFa(@Session() session: Record<string, any>) {
        return this.authService.disableTwoFa(session);
    }
}