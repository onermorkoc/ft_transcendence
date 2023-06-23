import { Injectable, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Achievement, GameHistory, Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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
        }catch(error){
            return (false)
        }
        return (true)
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

    async getCurrentGameId(userId: number): Promise<string> {
        const user: User = await this.findUserbyID(userId);
        return user.currentGameId;
    }

    async getGameHistory(userId: number): Promise<Array<GameHistory>> {
        const gameHistoryAsPlayerOne: Array<GameHistory> = await this.prismaService.gameHistory.findMany({
            where: {
                playerOneId: userId
            }
        });
        const gameHistoryAsPlayerTwo: Array<GameHistory> = await this.prismaService.gameHistory.findMany({
            where: {
                playerTwoId: userId
            }
        });
        const gameHistory: Array<GameHistory> = gameHistoryAsPlayerOne.concat(gameHistoryAsPlayerTwo);
        gameHistory.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        return (gameHistory);
    }

    async getAchievements(userId: number): Promise<Array<{ name: string, description?: string, achieved: boolean, percentage: number }>> {
        const allUserCount: number = (await this.allUsers()).length;
        const allAchievements = await this.prismaService.achievement.findMany({
            include: {
                users: true
            }
        });
        const achievementObjects: Array<{ name: string, description?: string, achieved: boolean, percentage: number }> = [];

        allAchievements.forEach((achievement) => {
            let achieved: boolean;
            if (achievement.users.some((obj) => obj.userId == userId)) {achieved = true;}
            else {achieved = false;}
            achievementObjects.push({ name: achievement.name, description: achievement.description, achieved: achieved, percentage: (achievement.users.length / allUserCount) * 100 })
        });

        return achievementObjects;
    }

    async unlockAchievement(userId: number, achievementName: string) {
        const user: User = await this.findUserbyID(userId);
        const oldAchievement = await this.prismaService.userAchievement.findUnique({
            where: {
                userId_achievementName: {userId: userId, achievementName: achievementName}
            }
        });

        if (!oldAchievement) {
            const userAchievement = await this.prismaService.userAchievement.create({
                data: {
                    user: { connect: {id: userId} },
                    achievement: { connect: {name: achievementName} }
                },
                include: {
                    achievement: true
                }
            });
            user.xp += userAchievement.achievement.xp;
            await this.update(user);
        }
    }

    async getStats(userId: number): Promise<{ globalRank: number, level: number, progression: number, xp: number }> {
        const user: User = await this.findUserbyID(userId);
        const allUsers: Array<User> = await this.allUsers();
        allUsers.sort((a, b) => b.xp - a.xp);
        const rank: number = allUsers.findIndex((obj) => obj.id == userId) + 1;
        const level: number = Math.floor(Math.log((user.xp / 1000) * (1.25 - 1) + 1) / Math.log(1.25)) + 1;
        const currentLevelMaxXP = 1000 * Math.pow(1.25, level - 1);
        let relevantXP = user.xp;
        for (var i = 0; i < level - 1; i++) {
            relevantXP -= 1000 * Math.pow(1.25, i);
        }
        const progression: number = (relevantXP / currentLevelMaxXP) * 100;
        return ({ globalRank: rank, level: level, progression: progression, xp: user.xp });
    }
}