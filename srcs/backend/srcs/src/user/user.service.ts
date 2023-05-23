import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async create(userData: User){
        await this.userRepository.save(this.userRepository.create(userData))
    }

    async update(newUserInfo: Partial<User>): Promise<number> {

        /* Kullanıcı aynı nickname kullanmaya devam edip adını ve pp sini değiştirmek isteyebilir.
        Eğer nickname değiştirmek istiyorsa önceden başkaları tarafından alınmamış olmalı */

        const intraID = newUserInfo.intraID
        const newNickname = newUserInfo.nickname
        const oldNickname = (await this.findOne(intraID)).nickname
        const taken = await this.userRepository.findOne({where: {nickname: newNickname}})
     
        if(oldNickname == newNickname ||  taken == null){
            await this.userRepository.update({intraID}, newUserInfo)
            console.log(`[DEBUG]: Kullanıcı bilgilerini güncelledi intraID: ${intraID}`)
            return (0)
        }
        return (1)
    }

    async all(): Promise<Array<User>> {
        return (await this.userRepository.find())
    }

    async findOne(intraID: number): Promise<User> {
        return (await this.userRepository.findOne({where: {intraID }}))
    }

    async delete(){

    }
}