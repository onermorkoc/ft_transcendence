import { Injectable } from '@nestjs/common';
import { Status, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StatusService {
    constructor(private userService: UsersService) {}

    private usersOnline: Array<User> = [];
    private usersClientIds: Array<Array<string>> = [];

    addUserOnline(user: User, clientId: string): void {
        if (this.usersOnline.includes(user)) {
            const index: number = this.usersOnline.indexOf(user);
            this.usersClientIds[index].push(clientId);
        }
        else {
            this.usersOnline.push(user);
            this.usersClientIds.push([clientId]);

            user.status = Status.ONLINE;
            this.userService.update(user);
        }
    }

    removeUserOnline(clientId: string): void {
        const rowIndex: number = this.usersClientIds.findIndex((row) => row.includes(clientId));

        if (this.usersClientIds[rowIndex].length > 1) {
            const index = this.usersClientIds[rowIndex].indexOf(clientId);
            this.usersClientIds[rowIndex].splice(index, 1);
        }
        else {
            const user: User = this.usersOnline[rowIndex];

            this.usersClientIds.splice(rowIndex, 1);
            this.usersOnline.splice(rowIndex, 1);

            user.status = Status.OFFLINE;
            this.userService.update(user);
        }
    }

    getUsersOnline(): Array<User> {
        return this.usersOnline;
    }
}
