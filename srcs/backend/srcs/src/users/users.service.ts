import { Injectable, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(private prismaService: PrismaService, private configService: ConfigService) {}

    async allUsers(): Promise<Array<User>>{
        return (await this.prismaService.user.findMany())
    }

    currentUser(@Session() session: Record<string, any>): User {
        return (session.passport.user)
    }

    async update(newUserInfo: Partial<User>): Promise<boolean> { // newUserIfo içinde kesinlikle id olmalı
        try {
            await this.prismaService.user.update({
                where: {
                    id: newUserInfo.id
                },
                data: newUserInfo
            })
            await this.updateSession(newUserInfo.id)
        }
        catch (error) {
            return false
        }
        return true
    }

    async findUserbyID(userId: number): Promise<User> {
        return (await this.prismaService.user.findUnique({
            where: {
                id: userId
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

    async userGetTwoFaSecret(userId: number) : Promise<string> {
        return (await this.findUserbyID(userId)).twoFactorSecret
    }

    async userGetTwoFaQr(userId: number) : Promise<string> {
        return (await this.findUserbyID(userId)).twoFactorQrCode;
    }

    async enableTwoFa(userId: number) {
        await this.update({id: userId, twoFactorEnabled: true})
    }

    async disableTwoFa(userId: number) {
        await this.update({id: userId, twoFactorEnabled: false})
    }

    async uploadAvatar(userId: number, file: Express.Multer.File) {
        const newPhotoUrl = `${this.configService.get<string>('BACKEND_URL')}/${file.path.replace('public/', '')}`
        await this.update({id: userId, photoUrl: newPhotoUrl})
    }

    async updateSession(intraId: number) {
        const user: User = await this.findUserbyID(intraId);
        const sessionDataString: string = (await this.prismaService.session.findFirstOrThrow({
            where: {
                data: {
                    contains: '"id":' + intraId.toString()
                }
            }
        })).data;
        const sessionDataJSON = JSON.parse(sessionDataString);
        sessionDataJSON.passport.user = user;
        const sessionDataStringUpdated = JSON.stringify(sessionDataJSON);
        return await this.prismaService.session.updateMany({
            where: {
                data: {
                    contains: '"id":' + intraId.toString()
                }
            },
            data: {
                data: sessionDataStringUpdated
            }
        });
    }
}



