import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUsers(@Session() session: Record<string, any>){
        return (this.userService.getAllUsers(session))
    }

    @Get('current')
    getCurrentUser(@Session() session: Record<string, any>) {
        return this.userService.getCurrentUser(session);
    }

    @Put("/update")
    async updateUserInfo(@Body() newUserInfo: Partial<User>, @Session() session: Record<string, any>): Promise<number> {
        return (await this.userService.update(newUserInfo, session))
    }

    @Get(':intraID')
    async findUserbyID(@Param("intraID") intraID: string) {
        return this.userService.findUserbyID(parseInt(intraID));
    }

    @Get('2fa/secret/:intraID')
    async userGetTwoFaSecret(@Param("intraID") intraID: string) {
        return this.userService.userGetTwoFaSecret(parseInt(intraID));
    }

    @Post('upload/avatar')
    @UseInterceptors(FileInterceptor('avatar', { dest: 'public/uploads' }))
    async uploadAvatar(
        @UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 5242880 }),
                new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' })
            ]
        })
        )
        file: Express.Multer.File,
        @Session() session: Record<string, any>
    ) {
       return this.userService.uploadAvatar(file, session);
    }
}
