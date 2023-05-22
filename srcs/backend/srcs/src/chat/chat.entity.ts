import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('ChatRooms')
export class ChatRoom {
    
    @PrimaryGeneratedColumn()
    public id?: number

    @Column()
    public name: string

    @Column()
    public ownerID: string 

    @Column()
    public roomstatus: "private" | "public" | "protected"

    @Column({type: "jsonb"})
    public usersID: Array<string>

    @Column({type: "jsonb"})
    public adminsID: Array<string>

    @Column({type: "jsonb"})
    public banlistID: Array<string>
}