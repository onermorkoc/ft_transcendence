import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InitializationService {
    constructor(private prismaService: PrismaService) {}

    async initialize() {
        await this.createAchievements();
    }

    private async createAchievements() {
        const existingAchievements = await this.prismaService.achievement.findMany();

        const predefinedAchievements = [
            {name: "Başarım1", description: "Açıklama"},
            {name: "Başarım2"},
            {name: "Başarım3"},
            {name: "Başarım4"},
            {name: "Başarım5"},
            {name: "Başarım6"}
        ];

        const newAchievements = predefinedAchievements.filter(
            (achievement) =>!existingAchievements.some(
                (existingAchievement) => existingAchievement.name === achievement.name
            )
        );

        if (newAchievements.length > 0) {
            await this.prismaService.achievement.createMany({
                data: newAchievements
            })
        }
    }
}
