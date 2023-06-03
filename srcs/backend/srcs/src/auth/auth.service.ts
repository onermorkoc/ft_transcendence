import { Body, Injectable, Req, Res, Session, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/users/user.service";
import { Response } from "express";
import { Request } from "express-session";
import * as speakeasy from 'speakeasy';
import * as jwt from 'jsonwebtoken';
import * as qrcode from 'qrcode';
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(private prismaService: PrismaService, private userService: UserService, private configService: ConfigService) {}

    async callback(@Res() res: Response, @Session() session: Record<string, any>) {
        res.cookie('twoFactorOkCookie', '', { expires: new Date(0) });
        res.redirect(this.configService.get<string>("REACT_APP_HOMEPAGE") + "/home");
    }

    logoff(@Session() session: Record<string, any>) {
        session.destroy();
    }

    async generateTwoFa(@Session() session: Record<string, any>) {
        const secret = speakeasy.generateSecret();
        const user = (await this.prismaService.user.update({
            where: {
                id: session.passport.user.id
            },
            data: {
                twoFactorSecret: secret.base32,
                twoFactorQrCode: secret.otpauth_url
            }
        }))
        return user.twoFactorSecret;
    }

    async showQrTwoFa(@Session() session: Record<string, any>) {
        return qrcode.toDataURL(await this.userService.userGetTwoFaQr(session.passport.user.id));
    }

    async verifyTwoFa(@Body() body: {code: string}, @Session() session: Record<string, any>) {
        const verified = speakeasy.totp.verify({
            secret: await this.userService.userGetTwoFaSecret(session.passport.user.id.toString()),
            encoding: 'base32',
            token: body.code
        });

        if (verified === true) {
            this.userService.enableTwoFa(session.passport.user.id, session);
        }

        return verified;
    }

    async validateTwoFa(@Req() req: Request, @Res() res: Response, @Body() body: { code: string }) {
        const token = req.cookies['twoFactorCookie'];
        if (!token) {
            throw new UnauthorizedException('2FA Cookie is Not Set');
        }
        const code = body.code;

        const user = jwt.verify(token, this.configService.get<string>('JWT_SECRET'));

        const validated = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code
        });

        if (!validated)
            throw new UnauthorizedException('Invalid 2FA Code');

        const jwttoken = jwt.sign(user.id, this.configService.get<string>('JWT_SECRET'));
        res.cookie('twoFactorOkCookie', jwttoken, { httpOnly: true, secure: false });
        res.cookie('twoFactorCookie', '', { expires: new Date(0) });
        res.redirect(this.configService.get<string>('NESTJS_LOGIN_URL'))
        return true;
    }

    async disableTwoFa(@Session() session: Record<string, any>) {
        return await this.userService.disableTwoFa(session.passport.user.id, session);
    }
}