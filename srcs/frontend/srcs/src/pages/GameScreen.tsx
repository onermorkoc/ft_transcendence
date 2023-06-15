import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFoundCmp from "../componets/PageNotFoundCmp";
import { Socket, io } from "socket.io-client";
import { User } from "../dto/DataObject";

const GameScreen = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connectControl, setConnectControl] = useState<boolean>(false)
  const { gameId } = useParams()

  const [abortNotConnected, setAbortNotConnected] = useState<boolean>(false)
  const [abortNotReady, setAbortNotReady] = useState<boolean>(false)

  const [canvas, setCanvas] = useState<HTMLCanvasElement>()//document.getElementById('game') as HTMLCanvasElement
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null) //canvas.getContext('2d')

  const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  }

  interface Ball {
    width: number;
    height: number;
    x: number;
    y: number;
    moveX: number;
    moveY: number;
    speed: number;
  }

  interface Paddle {
    width: number;
    height: number;
    x: number;
    y: number;
    score: number;
    move: number;
    speed: number;
  }

  const Ball = {
    createBall(incrementedSpeed?: number): Ball {
      let w: number = 0;
      let h: number = 0;
      if (canvas) {
        w = canvas.width;
        h = canvas.height;
      }
      return {
        width: 18,
        height: 18,
        x: (w / 2) - 9,
        y: (h / 2) - 9,
        moveX: DIRECTION.IDLE,
        moveY: DIRECTION.IDLE,
        speed: incrementedSpeed || 7
      }
    }
  }

  const Paddle = {
    createPaddle(side: string): Paddle {
      let w: number = 0;
      let h: number = 0;
      if (canvas) {
        w = canvas.width;
        h = canvas.height;
      }
      return {
        width: 18,
        height: 180,
        x: side === 'left' ? 150 : w - 150,
        y: (h / 2) - 90,
        score: 0,
        move: DIRECTION.IDLE,
        speed: 8
      }
    }
  }

  const playerOne: Paddle = Paddle.createPaddle('left');
  const playerTwo: Paddle = Paddle.createPaddle('right');
  const ball: Ball = Ball.createBall();
  const gameStarted: boolean = false;
  let playerPaddle: Paddle;
  axios.get(`/game/whichPlayer/${gameId}`).then((response) => {
    if (response.data === "playerOne") {
      playerPaddle = playerOne;
    }
    else {
      playerPaddle = playerTwo;
    }
  });

  const Game = {
    initialize(): void {
      Game.menu();
    },

    menu(): void {
      Game.draw();


    },

    draw(): void {
      if (!canvas || !context) {return;}

      const colorBlack = '#111111';
      const colorWhite = '#d4d2d2'

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      context.fillStyle = colorBlack;
      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      context.fillStyle = colorWhite;
      context.fillRect(
        playerOne.x,
        playerOne.y,
        playerOne.width,
        playerOne.height
      )
      context.fillRect(
        playerTwo.x,
        playerTwo.y,
        playerTwo.width,
        playerTwo.height
      )
      context.fillRect(
        ball.x,
        ball.y,
        ball.width,
        ball.height
      )

      context.beginPath();
      context.setLineDash([7, 15]);
      context.moveTo((canvas.width / 2), canvas.height - 140);
      context.lineTo((canvas.width / 2), 140);
      context.lineWidth = 10;
      context.strokeStyle = colorWhite;
      context.stroke();

      context.font = '100px Courier New';
      context.textAlign = 'center';
      context.fillText(
        playerOne.score.toString(),
        (canvas.width / 2) - 400,
        100
      )
      context.fillText(
        playerTwo.score.toString(),
        (canvas.width / 2) + 400,
        100
      )
    }
  }

  useEffect(() => {
    if (!connectControl) {
      axios.get(`/game/join/${gameId}`).then((response) => {setConnectControl(response.data)})
    }
    if (connectControl && !currentUser) {
      axios.get(`/users/current`).then((response) => {setCurrentUser(response.data)});
    }
    if (currentUser && !socket && !canvas) {
      setSocket(io(`${process.env.REACT_APP_BACKEND_URI}/game`, {query: {userId: currentUser.id, gameId: gameId}}))
      setCanvas(document.getElementById('game') as HTMLCanvasElement);
    }
    if (canvas) {
      setContext(canvas.getContext('2d'));
    }
    if (socket) {
      socket.on("abortNotConnected", () => { setAbortNotConnected(true) });
      socket.on("abortNotReady", () => { setAbortNotReady(true) });
    }
    if (context) {
      console.log("Game initialize ran.")
      Game.initialize();
    }
  }, [connectControl, currentUser, socket, canvas, context])

  useEffect(() => {
    if (abortNotConnected) {
      console.log("ADAM BAGLANMADI OYUN IPTAL");
      window.location.reload();
    }
    else if (abortNotReady) {
      console.log("ADAM READY VERMEDI OYUN IPTAL");
      window.location.reload();
    }
  }, [abortNotConnected, abortNotReady])

  const clickFunction = () => {
    if (socket) {
      socket.emit('ready');
    }
  }

  if (connectControl) {
    return (
      <div className='gameRoot'>
        <button className="button" onClick={clickFunction}>READY!</button>
        <canvas width="1000" height="585" id="game" style={{ background: 'black' }}></canvas>
      </div>
    );
  }
  else {
    return (<PageNotFoundCmp/>)
  }
}

export default GameScreen;
