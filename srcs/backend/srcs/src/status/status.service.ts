import { Injectable } from '@nestjs/common';
import { Status, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StatusService {
    constructor(private userService: UsersService) {}

    private usersOnline: Array<number> = [];
    private usersClientCounts: Array<number> = [];

    async addUserOnline(userId: number): Promise<void> {
        if (this.usersOnline.includes(userId)) {
            const index: number = this.usersOnline.indexOf(userId);
            this.usersClientCounts[index]++;
        }
        else {
            this.usersOnline.push(userId);
            this.usersClientCounts.push(1);

            const user = await this.userService.findUserbyID(userId);
            user.status = Status.ONLINE;
            await this.userService.update(user);
        }
    }

    async removeUserOnline(userId: number): Promise<void> {
        const index: number = this.usersOnline.indexOf(userId);
        if (index == -1) {return;}

        if (this.usersClientCounts[index] > 1) {
            this.usersClientCounts[index]--;
        }
        else {
            this.usersOnline.splice(index, 1);
            this.usersClientCounts.splice(index, 1);

            const user = await this.userService.findUserbyID(userId);
            user.status = Status.OFFLINE;
            await this.userService.update(user);
        }
    }

    getUsersOnline(): Array<number> {
        return this.usersOnline;
    }

    strFix(str: string | string[]): string {
        if (Array.isArray(str)) {
            return null;
        }
        else {
            return str;
        }
    }
}
