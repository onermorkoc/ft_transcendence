import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DirectService } from "./direct.service";

@WebSocketGateway({cors: { origin: true, credentials: true }, namespace: "directChat"})
export class DirectGateway {

    constructor(private directService: DirectService){}

    @WebSocketServer()
    server: Server

    async handleConnection(client: Socket){

        const senderId = parseInt(this.directService.strFix(client.handshake.query.senderId))
        const receiverId = parseInt(this.directService.strFix(client.handshake.query.receiverId))
        const uniqueIdentifier = this.directService.createUniqueIdentifier(senderId, receiverId)
        
        client.join(uniqueIdentifier)
        this.server.to(uniqueIdentifier).emit("allMessages", await this.directService.getAllMessages(uniqueIdentifier))
        this.server.to(uniqueIdentifier).emit("blockedUserIdsInRoom", await this.directService.getBlockedUserIdsInRoom(senderId, receiverId))
    }

    @SubscribeMessage("sendDirectMessage")
    async handleSendDirectMessage(client: Socket, data: string){
        
        const senderId = parseInt(this.directService.strFix(client.handshake.query.senderId))
        const receiverId = parseInt(this.directService.strFix(client.handshake.query.receiverId))
        const uniqueIdentifier = this.directService.createUniqueIdentifier(senderId, receiverId)

        if (await this.directService.createNewDirectMessage(senderId, uniqueIdentifier, data))
            this.server.to(uniqueIdentifier).emit("allMessages", await this.directService.getAllMessages(uniqueIdentifier))
    }

    @SubscribeMessage("blockUser")
    async handleBlockUser(client: Socket){

        const userId = parseInt(this.directService.strFix(client.handshake.query.senderId))
        const blockedUserId = parseInt(this.directService.strFix(client.handshake.query.receiverId))
        const uniqueIdentifier = this.directService.createUniqueIdentifier(userId, blockedUserId)

        if (await this.directService.blockUser(userId, blockedUserId))
            this.server.to(uniqueIdentifier).emit("blockedUserIdsInRoom", await this.directService.getBlockedUserIdsInRoom(userId, blockedUserId))
    }

    @SubscribeMessage("unBlockUser")
    async handleUnBlockUser(client: Socket){

        const userId = parseInt(this.directService.strFix(client.handshake.query.senderId))
        const blockedUserId = parseInt(this.directService.strFix(client.handshake.query.receiverId))
        const uniqueIdentifier = this.directService.createUniqueIdentifier(userId, blockedUserId)

        if (await this.directService.unBlockUser(userId, blockedUserId))
            this.server.to(uniqueIdentifier).emit("blockedUserIdsInRoom", await this.directService.getBlockedUserIdsInRoom(userId, blockedUserId))
    }
}