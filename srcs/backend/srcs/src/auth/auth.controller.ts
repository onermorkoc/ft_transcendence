import { BadRequestException, Body, Controller, Get, Post, Req, Res, Session, UseGuards } from "@nestjs/common";
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
    callback(@Res() res: Response, @Session() session: Record<string, any>) {
        this.authService.callback(res)
    }

    @Get('logout')
    @UseGuards(AuthenticatedGuard)
    logoff(@Session() session: Record<string, any>) {
        this.authService.logout(session)
        // burada adam offline olmalı
    }

    @Get('session')
    async session(@Session() session: Record<string, any>){     // TEST İÇİN
        console.log(session);
        console.log(session.id);
    }

    @Get('status')
    @UseGuards(AuthenticatedGuard)                              // TEST İÇİN
    status() {
        return ("Kullanıcı giriş yapılı.")
    }

    @Post('2fa/generate')
    @UseGuards(AuthenticatedGuard)
    async generateTwoFaSecret(@Session() session: Record<string, any>) {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.authService.generateTwoFa(session.passport.user.id))
    }

    @Get('2fa/showqr')
    @UseGuards(AuthenticatedGuard)
    async showQrTwoFa(@Session() session: Record<string, any>) {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.authService.showQrTwoFa(session.passport.user.id))
    }

    @Post('2fa/verify')
    @UseGuards(AuthenticatedGuard)
    async verifyTwoFa(@Body() code: string, @Session() session: Record<string, any>) {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.authService.verifyTwoFa(session.passport.user.id, code))
    }

    @Post('2fa/validate')
    async validateTwoFa(@Req() req: Request, @Res() res: Response, @Body() code: string, @Session() session: Record<string, any>) {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return this.authService.validateTwoFa(req, res, code);
    }

    @Post('2fa/disable')
    @UseGuards(AuthenticatedGuard)
    async disableTwoFa(@Session() session: Record<string, any>) {
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.authService.disableTwoFa(session.passport.user.id))
    }
}