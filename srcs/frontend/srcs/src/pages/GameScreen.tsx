import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFoundCmp from "../componets/PageNotFoundCmp";
import { Socket, io } from "socket.io-client";
import { User } from "../dto/DataObject";
import "../ui-design/styles/GameScreen.css"

function ScoreBoard({ playerOneName, playerOneScore, playerTwoName, playerTwoScore }: { playerOneName: string, playerOneScore: number, playerTwoName: string, playerTwoScore: number }){
  return(
    <div className='scoreBoard'>
      <div className="playerOneScore">{playerOneName}:{playerOneScore}</div>
      <div className='vs'>VS</div>
      <div className="playerTwoScore">{playerTwoName}:{playerTwoScore}</div>
    </div>
  )
}

const GameScreen = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [socketListen, setSocketListen] = useState<boolean>(false)
  const [connectControl, setConnectControl] = useState<boolean>(false)
  const { gameId } = useParams()

  const [abortNotConnected, setAbortNotConnected] = useState<boolean>(false)
  const [abortNotReady, setAbortNotReady] = useState<boolean>(false)

  const [canvas, setCanvas] = useState<HTMLCanvasElement>()//document.getElementById('game') as HTMLCanvasElement
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null) //canvas.getContext('2d')

  enum Direction {
    UP,
    DOWN
  }

  interface Position {
    x: number;
    y: number;
  }

  interface Paddle {
    id: number;
    name: string;
    position: Position;
    score: number;
    width: number;
    height: number;
    speed: number;
  }

  interface Ball {
    position: Position;
    width: number;
    height: number;
  }

  interface Game {
    ball: Ball;
    playerPaddle: Paddle;
    opponentPaddle: Paddle;
    gridSize: number;
  }

  let gameData: Game;
  const [playerOne, setPlayerOne] = useState<Paddle>();
  const [playerTwo, setPlayerTwo] = useState<Paddle>();

  const draw = (game: Game | undefined) => {
    if (!game) {return;}

    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    if (!canvas || !context) {return;}

    const playerPaddle = game.playerPaddle;
    const opponentPaddle = game.opponentPaddle;
    const ball = game.ball;
    const gridSize = game.gridSize;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(playerPaddle.position.x * gridSize, playerPaddle.position.y * gridSize, playerPaddle.width * gridSize, playerPaddle.height * gridSize);
    context.fillRect(opponentPaddle.position.x * gridSize, opponentPaddle.position.y * gridSize, opponentPaddle.width * gridSize, opponentPaddle.height * gridSize);
    context.fillRect(ball.position.x * gridSize, ball.position.y * gridSize, ball.width * gridSize, ball.height * gridSize)

    //scoreboardın altını ve canvasın altını boyuyor
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, 8);
    context.fillRect(0, canvas.height - 8, canvas.width, canvas.height);

    //net i çiziyor
    for (let i = gridSize/8; i < canvas.height - gridSize/8; i += gridSize/8 * 2) {
      context.fillRect(canvas.width / 2 - gridSize/8 / 2, i, gridSize/8, gridSize/8);
    }
  }

  const listen = (game: Game | undefined) => {
    if (!game) {return;}

    if (!socket) {return;}

    const playerPaddle = game.playerPaddle;
    const opponentPaddle = game.opponentPaddle;
    const gridSize = game.gridSize;

    document.addEventListener('mousemove', (e) => {
      const newY = (e.y - 370) / gridSize;
      playerPaddle.position.y = newY;
      paddleControl(playerPaddle);
      if (playerPaddle.position.x < opponentPaddle.position.x) {
        socket.emit('playerOneMove', newY)
      }
      else {
        socket.emit('playerTwoMove', newY)
      }
    });

    document.addEventListener('keydown', (e) => {
      let direction: Direction;
      let newY: number;
      if (e.key === 'ArrowDown' || e.key === 'KeyS') {
        direction = Direction.DOWN;
        newY = playerPaddle.position.y + playerPaddle.speed;
      }
      else if (e.key === 'ArrowUp' || e.key === 'KeyW') {
        direction = Direction.UP;
        newY = playerPaddle.position.y - playerPaddle.speed;
      }
      else {
        return;
      }

      playerPaddle.position.y = newY;
      paddleControl(playerPaddle);
      if (playerPaddle.position.x < opponentPaddle.position.x) {
        socket.emit('playerOneMove', newY)
      }
      else {
        socket.emit('playerTwoMove', newY)
      }
      requestAnimationFrame(() => draw(gameData));
    })
  }

  const paddleControl = (paddle: Paddle) => { // Bu kısımın backendle aynı olması lazım
    if (paddle.position.y < 0.2) {
      paddle.position.y = 0.2;
    }
    else if (paddle.position.y + paddle.height > 8.8) {
      paddle.position.y = 8.8 - paddle.height;
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
    if (canvas && !context) {
      setContext(canvas.getContext('2d'));
    }
    if (socket && !socketListen) {
      //socket.on("abortNotConnected", () => { setAbortNotConnected(true) });
      //socket.on("abortNotReady", () => { setAbortNotReady(true) });
      socket.on("gameDataInitial", (data) => {
        gameData = JSON.parse(data);
        if (gameData.playerPaddle.position.x < gameData.opponentPaddle.position.x) {
          setPlayerOne(gameData.playerPaddle);
          setPlayerTwo(gameData.opponentPaddle);
        }
        else {
          setPlayerTwo(gameData.playerPaddle);
          setPlayerOne(gameData.opponentPaddle);
        }
        listen(gameData);
        requestAnimationFrame(() => draw(gameData));
        socket.emit('ready');
        socket.off("gameDataInitial");
      });
      socket.on("gameData", (data) => {
        const dataJSON = JSON.parse(data);
        gameData.ball.position.x = dataJSON.ball.x;
        gameData.ball.position.y = dataJSON.ball.y;
        gameData.opponentPaddle.position.y = dataJSON.opponentPaddle.y;
        requestAnimationFrame(() => draw(gameData));
      });
      setSocketListen(true);
    }
  }, [connectControl, currentUser, socket, canvas, context])

  /*useEffect(() => {
    if (abortNotConnected) {
      console.log("ADAM BAGLANMADI OYUN IPTAL");
      window.location.reload();
    }
    else if (abortNotReady) {
      console.log("ADAM READY VERMEDI OYUN IPTAL");
      window.location.reload();
    }
  }, [abortNotConnected, abortNotReady])*/

  if (connectControl && playerOne && playerTwo) {
    return (
      <div className='gameRoot'>
        <div className="gameTable">
          <ScoreBoard playerOneName={playerOne.name} playerOneScore={playerOne.score} playerTwoName={playerTwo.name} playerTwoScore={playerTwo.score}/>
          <canvas width="1024" height="576" id="game" style={{ background: 'black' }}></canvas>
        </div>
      </div>
    );
  }
  else {
    return (<PageNotFoundCmp/>)
  }
}

export default GameScreen;