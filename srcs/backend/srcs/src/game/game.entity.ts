import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('GameRooms')
export class GameRoom {

    @PrimaryGeneratedColumn()
    public id?: number

    @Column()
    public name: string
    
    @Column()
    public founderID: string // kurucu

    @Column()
    public rivalID: string // rakibi
}