export class Player {
    userId: number;
    isReady: boolean = false;

    constructor(userId: number) {
        this.userId = userId;
    }
}