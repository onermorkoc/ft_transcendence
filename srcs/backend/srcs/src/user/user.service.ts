import { Injectable, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService, private configService: ConfigService) {}

    getCurrentUser(@Session() session: Record<string, any>) : Promise<User> {
        return session.passport.user;
    }

    async update(newUserInfo: Partial<User>, @Session() session: Record<string, any>): Promise<number> { // Update ediyor ama session yenilenmediginden frontende eski bilgiler geliyor

        /* Kullanıcı aynı nickname kullanmaya devam edip adını ve pp sini değiştirmek isteyebilir.
        Eğer nickname değiştirmek istiyorsa önceden başkaları tarafından alınmamış olmalı */

        const intraID = newUserInfo.id
        const newNickname = newUserInfo.nickname
        const oldNickname = (await this.findUserbyID(intraID)).nickname
        const taken = await this.findUserbyNickname(newNickname)
     
        if(oldNickname == newNickname || taken == null) {
            const user = await this.prismaService.user.update({
                where: {
                    id: intraID  
                },
                data: newUserInfo
            })
            if (session.passport.user.id == user.id) {
                session.passport.user = user;
            }
            return (0)
        }
        return (1)
    }

    async findUserbyID(intraID: number): Promise<User> {
        return (await this.prismaService.user.findUnique({
            where: {
                id: intraID
            }
        }))
    }

    /*async findUserbyName(displayname: string): Promise<User> { // Displayname unique olmadığı için şuanlık çalışmıyor
        return (await this.prismaService.user.findUnique({
            where: {
                displayname: displayname
            }
        }))
    }*/ 

    async findUserbyNickname(nickname: string): Promise<User> {
        return (await this.prismaService.user.findFirst({
            where: {
                nickname: nickname
            }
        }))
    }

    async userGetTwoFaSecret(intraID: number) : Promise<string> {
        const user = await this.findUserbyID(intraID);
        return user.twoFactorSecret;
    }

    async userGetTwoFaQr(intraID: number) : Promise<string> {
        const user = await this.findUserbyID(intraID);
        return user.twoFactorQrCode;
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
