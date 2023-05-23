export interface IntraUserInfo {
    intraID: number,
    displayname: string,
    nickname: string,
    email: string,
    photoUrl: string,
}

export interface GameStatistics{
    totalGame: number,
    totalWin: number,
    totalLose: number,
    winRate: number,
    title: "Çaylak" | "Usta" | "Büyük Usta" | "Efsane" | "Şanlı",
    globalRank: number
}

export interface User {
    id?: number,
    intraID: number
    displayname: string,
    nickname: string,
    email: string,
    photourl: string,
    googleauth: boolean,
    status: "online" | "offline" | "at game",
    statistics: GameStatistics,
    chatroomsID: Array<string>,
    friendsID: Array<string>
}

export interface ChatRoom {
    id?: number,
    name: string,
    ownerID: string,
    roomstatus: "private" | "public" | "protected",
    usersID: Array<string>,
    adminsID: Array<string>,
    banlistID: Array<string>,
}

export interface GameRoom {
    id?: number,
    name: string,
    founderID: string,
    rivalID: string,
}

export const allGameRoomList: Array<GameRoom> = []