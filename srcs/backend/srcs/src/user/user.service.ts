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
        const oldNickname = (await this.findOneNoCondition(intraID)).nickname
        const taken = await this.userRepository.findOne({where: {nickname: newNickname}})
     
        if(oldNickname == newNickname ||  taken == null){
            await this.userRepository.update({intraID}, newUserInfo)
            console.log(`[DEBUG]: Kullanıcı bilgilerini güncelledi intraID: ${intraID}`)
            return (0)
        }
        return (1)
    }

    async updateNoCondition(newUserInfo: Partial<User>){
        const intraID = newUserInfo.intraID
        await this.userRepository.update({intraID}, newUserInfo)
    }

    async all(): Promise<Array<User>> {
        return (await this.userRepository.find())
    }

    async findOneNoCondition(intraID: number): Promise<User> {
        return (await this.userRepository.findOne({where: {intraID }}))
    }

    async findOne(intraID: number, secretkey: string): Promise<User> {
        
        const user = await this.userRepository.findOne({where: {intraID }})

        if(user == null)
            return (null)
        if(user.secretkey != secretkey)
            return (null)
        return (user)
    }

    async delete(){

    }
}