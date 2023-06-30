import { Injectable } from '@nestjs/common';
import { Status, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StatusService {
    constructor(private userService: UsersService) {}

    //private usersOnline: Array<number> = [];
    //private usersClientCounts: Array<number> = [];

    private usersOnline: Array<{id: number, onlineCount: number, inGameCount: number}> = [];

    async addUserOnline(userId: number, status: string): Promise<void> {
        if (this.usersOnline.some((user) => user.id == userId)) {
            const index: number = this.usersOnline.findIndex((user) => user.id == userId);
            if (status == 'ONLINE') {
                this.usersOnline[index].onlineCount++;
            }
            else if (status == 'INGAME') {
                this.usersOnline[index].inGameCount++;
            }
        }
        else {
            if (status == 'ONLINE') {
                this.usersOnline.push({id: userId, onlineCount: 1, inGameCount: 0});
            }
            else if (status == 'INGAME') {
                this.usersOnline.push({id: userId, onlineCount: 0, inGameCount: 1});
            }

            /*const user = await this.userService.findUserbyID(userId);
            user.status = Status.ONLINE;
            await this.userService.update(user);*/
        }
    }

    async removeUserOnline(userId: number, status: string): Promise<void> {
        const index: number = this.usersOnline.findIndex((user) => user.id == userId);
        if (index == -1) {return;}

        if (status == 'ONLINE') {
            this.usersOnline[index].onlineCount--;
        }
        else if (status == 'INGAME') {
            this.usersOnline[index].inGameCount--;
        }

        if (this.usersOnline[index].onlineCount == 0 && this.usersOnline[index].inGameCount == 0) {
            this.usersOnline.splice(index, 1);
        }

        /*if (this.usersOnline[index].clientCount > 1) {
            this.usersOnline[index].clientCount--;
        }
        else { // STATUSA GÖRE FİXLE BU KISMI
            this.usersOnline.splice(index, 1);

            const user = await this.userService.findUserbyID(userId);
            user.status = Status.OFFLINE;
            await this.userService.update(user);
        }*/
    }

    getUsersOnline(): Array<{id: number, status: Status}> {
        const userArray: Array<{id: number, status: Status}> = this.usersOnline.map((user) => {
            if (user.inGameCount > 0) {
                return ({id: user.id, status: Status.ATGAME});
            }
            else {
                return ({id: user.id, status: Status.ONLINE});
            }
        });
        return userArray;
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