import { Body, Controller, Get, Param, Post, Put, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('current')
    getCurrentUser(@Session() session: Record<string, any>) {
        return this.userService.getCurrentUser(session);
    }

    @Put("/update")
    async updateUserInfo(@Body() newUserInfo: Partial<User>): Promise<number> {
        return (await this.userService.update(newUserInfo))
    }

    @Get(':intraID')
    async findUserbyID(@Param("intraID") intraID: string) {
        return this.userService.findUserbyID(parseInt(intraID));
    }

    @Get('name/:displayName')
    async findUserbyName(@Param("displayName") displayName: string) {
        return this.userService.findUserbyName(displayName);
    }

    @Get('2fa/secret/:intraID')
    async userGetTwoFaSecret(@Param("intraID") intraID: string) {
        return this.userService.userGetTwoFaSecret(parseInt(intraID));
    }
}
