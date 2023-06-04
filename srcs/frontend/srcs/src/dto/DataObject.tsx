export interface User {
    id: number,
    displayname: string,
    email: string,
    nickname: string,
    photoUrl: string
    status: Status,
    twoFactorEnabled: boolean,
    totalGame: number,
    totalWin: number,
    totalLose: number,
    winRate: number,
    title: Title,
    globalRank: number  
    chatRoomIds: Array<number>
    friendIds: Array<number>
    gameHistory: Array<GameHistory>
  }
  
  export interface ChatRoom {
    id: number,
    name: string,
    ownerId: number,
    roomStatus: RoomStatus,
    userIds: Array<number>,
    adminIds: Array<number>,
    banListIds: Array<number>
  }
  
  export interface Game {
    id: number,
    playerOneId: number,
    playerTwoId: number
  }
  
  interface GameHistory {
    id: number,
    userId: number,
    opponentId:number,
    win: boolean,
    userScore: number,
    opponentScore: number
  }
  
  enum Title {
    CAYLAK,
    USTA,
    BUYUKUSTA,
    EFSANE,
    SANLI
  }
  
  enum Status {
    ONLINE,
    OFFLINE,
    ATGAME
  }
  
  enum RoomStatus {
    PRIVATE,
    PUBLIC,
    PROTECTED,
  }

  export interface RequestData {
    receiverId: number,
    senderId: number
  }