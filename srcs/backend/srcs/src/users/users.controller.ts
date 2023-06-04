import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    async getAllUsers(@Session() session: Record<string, any>){
        if (!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (await this.userService.allUsers())
    }

    @Get('current')
    getCurrentUser(@Session() session: Record<string, any>) {
        if(!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (this.userService.currentUser(session))
    }

    @Get(':userId')
    async findUserbyID(@Param("userId") userId: string, @Session() session: Record<string, any>) {
        if(!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (await this.userService.findUserbyID(parseInt(userId)))
    }

    @Get('2fa/secret')
    async userGetTwoFaSecret(@Session() session: Record<string, any>) {
        if(!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (await this.userService.userGetTwoFaSecret(session.passport.user.id))
    }

    @Put("/update")
    async updateUserInfo(@Body() newUserInfo: Partial<User>, @Session() session: Record<string, any>): Promise<number> {
        if(!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (await this.userService.update(newUserInfo))
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
        if(!session.passport)
            throw new BadRequestException('You have no permission to do that.')    
        return (await this.userService.uploadAvatar(session.passport.user.id, file))
    }

    @Post("unfriend")
    async unFriend(@Body() userId: number, @Session() session: Record<string, any>){
        if(!session.passport)
            throw new BadRequestException('You have no permission to do that.')
        return (await this.userService.unFriend(session.passport.user.id, userId))
    }
}