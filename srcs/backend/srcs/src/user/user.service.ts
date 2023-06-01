import { Injectable, Session } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    getCurrentUser(@Session() session: Record<string, any>) : Promise<User> {
        return session.passport.user;
    }

    async update(newUserInfo: Partial<User>): Promise<number> { // Update ediyor ama session yenilenmediginden frontende eski bilgiler geliyor

        /* Kullanıcı aynı nickname kullanmaya devam edip adını ve pp sini değiştirmek isteyebilir.
        Eğer nickname değiştirmek istiyorsa önceden başkaları tarafından alınmamış olmalı */

        const intraID = newUserInfo.id
        const newNickname = newUserInfo.nickname
        const oldNickname = (await this.findUserbyID(intraID)).nickname
        const taken = await this.findUserbyNickname(newNickname)
     
        if(oldNickname == newNickname ||  taken == null){
            await this.prismaService.user.update({
                where: {
                    id: intraID  
                },
                data: newUserInfo
            })
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

    async findUserbyName(displayname: string): Promise<User> {
        return (await this.prismaService.user.findUnique({
            where: {
                displayname: displayname
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
        const user = await this.findUserbyID(intraID);
        return user.twoFactorSecret;
    }

    async userGetTwoFaQr(intraID: number) : Promise<string> {
        const user = await this.findUserbyID(intraID);
        return user.twoFactorQrCode;
    }

    async enableTwoFa(intraID: number) {
        return await (this.prismaService.user.update({
            where: {
                id: intraID
            },
            data: {
                twoFactorEnabled: true
            }
        }));
    }

    async disableTwoFa(intraID: number) {
        return await (this.prismaService.user.update({
            where: {
                id: intraID
            },
            data: {
                twoFactorEnabled: false
            }
        }));
    }
}
