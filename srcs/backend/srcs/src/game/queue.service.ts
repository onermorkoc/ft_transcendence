import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Game } from '@prisma/client';
import { RemoteSocket, Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameService } from './game.service';

@Injectable()
export class QueueService {
    constructor(private gameService: GameService, private configService: ConfigService) {}

    private queueList: Set<number> = new Set([]);

    async addToQueue(userId: number, server: Server) {
        this.queueList.add(userId);

        if (this.queueList.size >= 2) {
            const [playerOne, playerTwo] = this.queueList;
            const game: Game = await this.gameService.createGame(playerOne, playerTwo);
            
            /*setTimeout(() => { // OYUN İPTAL SAYAÇ BAŞLANGICI
                this.gameService.countDownCheck(game.id);
            }, 20 * 1000) // 20sn*/

            const playerOneClients = await this.userIdtoClients(playerOne, server);
            const playerTwoClients = await this.userIdtoClients(playerTwo, server);
            this.removeFromQueue(playerOne);
            this.removeFromQueue(playerTwo);

            playerOneClients.forEach((socket) => {
                socket.emit('matchFound', `${this.configService.get<string>('REACT_APP_HOMEPAGE')}/game/${game.id}`); // frontendde o linke redirect olmaları lazım
            });

            playerTwoClients.forEach((socket) => {
                socket.emit('matchFound', `${this.configService.get<string>('REACT_APP_HOMEPAGE')}/game/${game.id}`); // frontendde o linke redirect olmaları lazım
            });

        }
    }

    removeFromQueue(userId: number) {
        this.queueList.delete(userId);
    }

    strFix(str: string | string[]): string {
        if (Array.isArray(str)) {
            return null;
        }
        else {
            return str;
        }
    }

    async userIdtoClients(userId: number, server: Server): Promise<RemoteSocket<DefaultEventsMap, any>[]> {
        const socketsInQueue: RemoteSocket<DefaultEventsMap, any>[] = await server.fetchSockets();
        const clientsOfUser: RemoteSocket<DefaultEventsMap, any>[] = socketsInQueue.filter((obj) => parseInt(this.strFix(obj.handshake.query.userId)) == userId);
        return clientsOfUser;
    }

}