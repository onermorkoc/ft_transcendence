import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

class GameStatistics {
    
    @Column()
    public totalGame: number

    @Column()
    public totalWin: number

    @Column()
    public totalLose: number
    
    @Column()
    public winRate: number // (100 * this.totalWin) / this.totalGame)

    @Column()
    public title: "Çaylak" | "Usta" | "Büyük Usta" | "Efsane" | "Şanlı"    // ünvan
    
    @Column()
    public globalRank: number // bunun hesaplanması daha sonra ayarlancak
}

@Entity('UsersInfomation')
export class User {
    
    @PrimaryGeneratedColumn() // her tablenin kesinlikle primary column olmalı kendisi oto rakam verecek o yüzden nulltable yaptım ki null verelim
    public id?: null

    @Column()
    public intraID: number

    @Column()
    public displayname: string

    @Column()
    public nickname: string
    
    @Column()
    public email: string
    
    @Column()
    public photourl: string
    
    @Column()
    public googleauth: boolean
    
    @Column()
    public status: "online" | "offline" | "at game"

    @Column(() => GameStatistics) // başka classdan object gösterebilmek için syntax bu şekil olmalı
    public statistics: GameStatistics

    @Column({type: "jsonb"}) // array kabul edebilmesi için type jsonb olmalı
    public chatroomsID: Array<string>

    @Column({type: "jsonb"})
    public friendsID: Array<string>
}