import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { IntraUserInfo } from "src/dto/dto";

@Controller('/users')
export class UserController {

    constructor(private userService: UserService){}

    @Get()
    async getAllUsers(): Promise<Array<User>> {
        return (await this.userService.all())
    }

    @Post()
    async createUser(@Body() intraUserInfo: IntraUserInfo): Promise<number>{

        if (await this.userService.findOne(intraUserInfo.nickname) == null) {
            await this.userService.create({
                id: null,
                displayname: intraUserInfo.displayname,
                nickname: intraUserInfo.nickname,
                email: intraUserInfo.email,
                photourl: intraUserInfo.photoUrl,
                googleauth: false,
                status: "online",
                statistics: {
                    totalGame: 0,
                    totalWin: 0,
                    totalLose: 0,
                    winRate: 0,
                    title: "Çaylak",
                    globalRank: 0
                },
                chatroomsID: [],
                friendsID: []
            })
            console.log(`[DEBUG]: Yeni Kullanıcı oluşturuldu nickname: ${intraUserInfo.nickname}`)
        } else {
            console.log(`[DEBUG]: Kullanıcı giriş yaptı nickname: ${intraUserInfo.nickname}`)
        }
        return (0)
    }

    @Get(":nickname")
    async findUser(@Param("nickname") nickname: string): Promise<User>{
        return (await this.userService.findOne(nickname))
    }
}