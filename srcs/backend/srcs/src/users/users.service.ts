import { Injectable, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService, private configService: ConfigService) {}

    async getAllUsers(@Session() session: Record<string, any>): Promise<Array<User>>{
        return (await this.prismaService.user.findMany())
    }

    getCurrentUser(@Session() session: Record<string, any>) : User {
        return (session.passport.user)
    }

    async update(newUserInfo: Partial<User>, @Session() session: Record<string, any>): Promise<number> {
        try{
            const user = await this.prismaService.user.update({
                where: {
                    id: newUserInfo.id
                },
                data: newUserInfo
            })
            session.passport.user = user;
        }catch(error){
            return (1)
        }
        return (0)
    }

    async findUserbyID(intraID: number): Promise<User> {
        return (await this.prismaService.user.findUnique({
            where: {
                id: intraID
            }
        }))
    }

    async findUserbyNickname(nickname: string): Promise<User> {
        return (await this.prismaService.user.findFirst({
            where: {
                nickname: nickname
            }
        }))
    }

    async userGetTwoFaSecret(intraID: number) : Promise<string> {
        return (await this.findUserbyID(intraID)).twoFactorSecret
    }

    async userGetTwoFaQr(intraID: number) : Promise<string> {
        return (await this.findUserbyID(intraID)).twoFactorQrCode;
    }

    async enableTwoFa(intraID: number, @Session() session: Record<string, any>) {
        const user = await (this.prismaService.user.update({
            where: {
                id: intraID
            },
            data: {
                twoFactorEnabled: true
            }
        }));
        session.passport.user = user;
        //await this.update({twoFactorEnabled: true}, session) ==> Burası boyle olabılır ama sessıon degısır mı kararsız kaldım
        return user
    }

    async disableTwoFa(intraID: number, @Session() session: Record<string, any>) {
        const user = await (this.prismaService.user.update({
            where: {
                id: intraID
            },
            data: {
                twoFactorEnabled: false
            }
        }));
        session.passport.user = user;
        return user;
    }

    async uploadAvatar(file: Express.Multer.File, @Session() session: Record<string, any>) {
        const avatar_url = `${this.configService.get<string>('BACKEND_URL')}/${file.path.replace('public/', '')}`;
        const user = session.passport.user;
        user.photoUrl = avatar_url;
        await this.update(user, session);
        return { avatar_url: avatar_url };
    }
}
