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

  const canvas = document.getElementById('game') as HTMLCanvasElement
  //const context = canvas.getContext('2d')

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
      return {
        width: 18,
        height: 18,
        x: (canvas.width / 2) - 9,
        y: (canvas.height / 2) - 9,
        moveX: DIRECTION.IDLE,
        moveY: DIRECTION.IDLE,
        speed: incrementedSpeed || 7
      }
    }
  }

  const Paddle = {
    createPaddle(side: string): Paddle {
      return {
        width: 18,
        height: 180,
        x: side === 'left' ? 150 : canvas.width - 150,
        y: (canvas.height / 2) - 35,
        score: 0,
        move: DIRECTION.IDLE,
        speed: 8
      }
    }
  }

  const [playerOne, setPlayerOne] = useState<Paddle>();
  const [playerTwo, setPlayerTwo] = useState<Paddle>();
  const [ball, setBall] = useState<Ball>();
  const [gameStarted, setGameStarted] = useState<boolean>();
  const [playerPaddle, setPlayerPaddle] = useState<Paddle>()

  const Game = {
    initialize(): void {
      setPlayerOne(Paddle.createPaddle('left'));
      setPlayerTwo(Paddle.createPaddle('right'));
      setBall(Ball.createBall());
      setGameStarted(false);
      axios.get(`/game/whichPlayer/${gameId}`).then((response) => {
        if (response.data === "playerOne") {
          setPlayerPaddle(playerOne);
        }
        else {
          setPlayerPaddle(playerTwo);
        }
      });

      Game.menu();
    },

    menu(): void {
      console.log("MENU MENU")
    }
  }

  useEffect(() => {
    if (!connectControl) {
      axios.get(`/game/join/${gameId}`).then((response) => {setConnectControl(response.data)})
    }
    if (connectControl && !currentUser) {
      axios.get(`/users/current`).then((response) => {setCurrentUser(response.data)});
    }
    if (currentUser && !socket) {
      setSocket(io(`${process.env.REACT_APP_BACKEND_URI}/game`, {query: {userId: currentUser.id, gameId: gameId}}))
    }
    if (socket) {
      socket.on("abortNotConnected", () => { setAbortNotConnected(true) });
      socket.on("abortNotReady", () => { setAbortNotReady(true) });
      var Pong = Object.assign({}, Game);
      Pong.initialize();
    }
  }, [connectControl, currentUser, socket])

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
