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

    async update(newUserInfo: Partial<User>): Promise<number> { // newUserIfo içinde kesinlikle id olmalı
        try{
            await this.prismaService.user.update({
                where: {
                    id: newUserInfo.id
                },
                data: newUserInfo
            })
            await this.updateSession(newUserInfo.id)
        }catch(error){
            return (1)
        }
        return (0)
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

    async unFriend(myID: number, otherID: number){
        const myFriendIds = (await this.findUserbyID(myID)).friendIds
        const otherFriends = (await this.findUserbyID(otherID)).friendIds
        myFriendIds.splice(myFriendIds.indexOf(otherID), 1)
        otherFriends.splice(otherFriends.indexOf(myID), 1)
        await this.update({id: myID, friendIds: myFriendIds})
        await this.update({id: otherID, friendIds: otherFriends})
    }

    async updateSession(userId: number) {
        const user = await this.findUserbyID(userId)
        const userJSON: JSON = Object.assign(JSON, user)
        const userString = JSON.stringify(userJSON)
        await this.prismaService.session.updateMany({
            where: {
                data: {
                    contains: '"id":' + userId.toString()
                }
            },
            data: {
                data: '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":' + userString + '}}'
            }
        })
    }
}



