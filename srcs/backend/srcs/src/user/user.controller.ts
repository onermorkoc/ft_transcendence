import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
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

        if (await this.userService.findOne(intraUserInfo.intraID) == null) {
            await this.userService.create({
                id: null,
                intraID: intraUserInfo.intraID,
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
            console.log(`[DEBUG]: Yeni Kullanıcı oluşturuldu intraID: ${intraUserInfo.intraID}`)
        } else {
            console.log(`[DEBUG]: Kullanıcı giriş yaptı intraID: ${intraUserInfo.intraID}`)
        }
        return (0)
    }

    @Get(":intraID")
    async findUser(@Param("intraID") intraID: number): Promise<User>{
        return (await this.userService.findOne(intraID))
    }

    @Put("/update")
    async updateUserInfo(@Body() newUserInfo: Partial<User>): Promise<number> { // Partial içindeki objecnin bilgilerinin eksik olmasına izin veren bir type
        return (await this.userService.update(newUserInfo))
    }
}