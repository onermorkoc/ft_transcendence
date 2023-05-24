import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { IntraUserInfo } from "src/dto/dto";
import axios from "axios";

@Controller('/users')
export class UserController {

    constructor(private userService: UserService){}

    @Get()
    async getAllUsers(): Promise<Array<User>> {
        return (await this.userService.all())
    }

    async createUser(intraUserInfo: IntraUserInfo) {

        if (await this.userService.findOneNoCondition(intraUserInfo.intraID) == null) {
            await this.userService.create({
                id: null,
                intraID: intraUserInfo.intraID,
                secretkey: intraUserInfo.secretkey,
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
            const updateSecretKey = {
                intraID: intraUserInfo.intraID,
                secretkey: intraUserInfo.secretkey
            }
            await this.userService.updateNoCondition(updateSecretKey)
            console.log(`[DEBUG]: Kullanıcı giriş yaptı intraID: ${intraUserInfo.intraID}`)
        }
    }

    @Get("/:intraID/:secretkey")
    async findUser(@Param("intraID") intraID: number, @Param("secretkey") secretkey: string): Promise<User>{
        return (await this.userService.findOne(intraID, secretkey))
    }

    @Put("/update")
    async updateUserInfo(@Body() newUserInfo: Partial<User>): Promise<number> { // Partial içindeki objecnin bilgilerinin eksik olmasına izin veren bir type
        return (await this.userService.update(newUserInfo))
    }

    @Post("/login")
    async login(@Body() intraResponseCode: {data: string}): Promise<number> {
            
        const postData = {
            code: intraResponseCode.data,
            client_id: `${process.env.REACT_APP_INTRA_CLIENT_ID}`,
            client_secret: `${process.env.REACT_APP_INTRA_SECRET}`,
            redirect_uri: `${process.env.REACT_APP_INTRA_REDIRECT_URI}`,
            grant_type: "authorization_code",
        }

        const access_token = (await axios.post("https://api.intra.42.fr/oauth/token", postData)).data.access_token
        const intraUser = (await axios.get(`https://api.intra.42.fr/v2/me?access_token=${access_token}&token_type=bearer`)).data

        const intraUserInfo: IntraUserInfo = {
            intraID: intraUser.id,
            secretkey: intraResponseCode.data,
            displayname: intraUser.displayname,
            nickname: intraUser.login,
            email: intraUser.email,
            photoUrl: intraUser.image.link
        }

        await this.createUser(intraUserInfo)
        return (intraUserInfo.intraID)
    }
}