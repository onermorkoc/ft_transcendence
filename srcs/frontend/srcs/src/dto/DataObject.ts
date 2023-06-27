export interface User {
  id: number,
  displayname: string,
  email: string,
  nickname: string,
  photoUrl: string
  status: Status,
  twoFactorEnabled: boolean,
  twoFactorSecret: string,
  twoFactorQrCode: string,
  totalGame: number,
  totalWin: number,  
  chatRoomIds: Array<number>,
  friendIds: Array<number>,
  blockedUserIds: Array<number>,
  gameHistory: Array<GameHistory>,
  pongShapeStyle: number,
  pongColorStyle: number
}
  
export interface ChatRoom {
  id: number,
  name: string,
  ownerId: number,
  roomStatus: RoomStatus,
  userCount: number
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
  
export type Title = "CAYLAK" | "USTA" | "BUYUKUSTA" | "EFSANE" | "SANLI"
  
export type Status = "ONLINE" | "OFFLINE" | "ATGAME"

export type RoomStatus = "PRIVATE" | "PUBLIC" | "PROTECTED"

export type RoomAuthority = "LEADER" | "ADMIN" | "NORMAL"

export interface RoomMember {
  user: User,
  status?: Status,
  muted?: Boolean,
  blocked?: Boolean,
  authority: RoomAuthority
}

export interface RequestData {
  receiverId: number,
  senderId: number
}

export interface Point {
  x: number, 
  y: number
}

export interface Message {
  chatroomId: string,
  createdAt: Date,
  data: string
  userId: number,
  userDisplayname: string
}

export interface ChatBan {
  userId: number,
  userDisplayname: string,
  userNickname: string,
  createdAt: Date,
  chatroomId: string,
}

export interface DirectMessage {
  data: string,
  senderId: number,
  createdAt: Date
}