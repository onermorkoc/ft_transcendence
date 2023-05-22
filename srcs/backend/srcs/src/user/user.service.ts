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

    async update(){

    }

    async all(): Promise<Array<User>> {
        return (await this.userRepository.find())
    }

    async findOne(nickname: string): Promise<User> {
        return (await this.userRepository.findOne({where: { nickname }}))
    }

    async delete(){

    }
}