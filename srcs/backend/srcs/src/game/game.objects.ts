export class Player {
    userId: number;
    isReady: boolean = false;
    y: number = 0;

    constructor(userId: number) {
        this.userId = userId;
    }
}

export class Ball {
    x: number = 0;
    y: number = 0;
}