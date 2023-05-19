import { Body, Controller, Get, Post } from "@nestjs/common";
import { IntraUserInfo } from "./dto/data.dto";

@Controller('/users/login')
export class AuthController {
    
    @Post()
    getLoginIntraData(@Body() data: IntraUserInfo) {
        console.log(data.displayname)
    }

    @Get()
    getHello(): string {
        return ("Hello World!")
    }
}