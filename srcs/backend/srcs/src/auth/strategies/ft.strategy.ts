import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-42'
import { PrismaService } from "src/prisma/prisma.service";
import { Status } from "@prisma/client"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private prisma: PrismaService, configService: ConfigService) {
        super({
            clientID: configService.get<string>('INTRA_API_CLIENT_ID'),
            clientSecret: configService.get<string>('INTRA_API_CLIENT_SECRET'),
            callbackURL: configService.get<string>('INTRA_API_CALLBACK_URL'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        const user = await this.prisma.user.upsert({
            where: {
                id: profile._json.id,
            },
            update: {

            },
            create: {
                id: profile._json.id,
                displayname: profile._json.displayname,
                email: profile._json.email,
                nickname: profile._json.login,
                photoUrl: profile._json.image.link,
                status: Status.OFFLINE
            },
        });

        return user;
    }
}