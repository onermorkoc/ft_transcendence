import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFoundCmp from "../componets/PageNotFoundCmp";
import { Socket, io } from "socket.io-client";
import { User } from "../dto/DataObject";
import "../ui-design/styles/GameScreen.css"

function ScoreBoard({ playerOneName, playerOneScore, playerTwoName, playerTwoScore }: { playerOneName: string | undefined, playerOneScore: number | undefined, playerTwoName: string | undefined, playerTwoScore: number | undefined }){
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  enum GameState {
    WAITINGTOSTART,
    STARTING,
    PLAYING,
    PAUSED,
    FINISHEDWIN,
    FINISHEDLOSE,
    ABORTED
  }

  interface Position {
    x: number;
    y: number;
  }

  interface Paddle {
    id: number;
    name: string;
    isReady: boolean;
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
    gameState: GameState;
    ball: Ball;
    playerPaddle: Paddle;
    opponentPaddle: Paddle;
    gridSize: number;
    countdown: number;
  }

  let gameData: Game;
  const [playerOneName, setPlayerOneName] = useState<string>();
  const [playerTwoName, setPlayerTwoName] = useState<string>();
  const [playerOneScore, setPlayerOneScore] = useState<number>();
  const [playerTwoScore, setPlayerTwoScore] = useState<number>();

  const draw = (game: Game | undefined) => {
    if (!game) {return;}

    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const context = canvas.getContext('2d');
    if (!context) {return;}

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (game.gameState === GameState.PLAYING) {
      drawGame(game, canvas, context);
    }
    else if (game.gameState === GameState.WAITINGTOSTART) {
      drawMenu(game, canvas, context);
    }
    else if (game.gameState === GameState.ABORTED) {
      drawAbortedMenu(game, canvas, context);
    }
    else if (game.gameState === GameState.STARTING) {
      drawStartingMenu(game, canvas, context);
    }
    else if (game.gameState === GameState.PAUSED) {
      drawPausedMenu(game, canvas, context);
    }
    else if (game.gameState === GameState.FINISHEDWIN) {
      drawFinishedWin(game, canvas, context);
    }
    else if (game.gameState === GameState.FINISHEDLOSE) {
      drawFinishedLose(game, canvas, context);
    }
  }

  const drawGame = (game: Game | undefined, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if (!game || !canvas || !context) {return;}

    const playerPaddle = game.playerPaddle;
    const opponentPaddle = game.opponentPaddle;
    const ball = game.ball;
    const gridSize = game.gridSize;

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

  const drawMenu = (game: Game | undefined, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if (!game || !canvas || !context) {return;}

    let leftOverSeconds: number = game.countdown;
    if (leftOverSeconds < 0) {leftOverSeconds = 0;}
    const playerOne = (game.playerPaddle.position.x < game.opponentPaddle.position.x) ? game.playerPaddle : game.opponentPaddle;
    const playerTwo = (game.playerPaddle.position.x < game.opponentPaddle.position.x) ? game.opponentPaddle : game.playerPaddle;

    console.log(game.gameState);

    context.fillStyle = 'white';
    context.font = '60px Arial';
    context.textAlign = 'center';
    context.fillText(leftOverSeconds.toFixed(), canvas.width / 2, 100);

    context.font = '20px Arial';
    context.fillText("Press -Space- to get READY", canvas.width / 2, 400);

    context.font = '30px Arial';
    if (playerOne.isReady) {
      context.fillText("READY", 200, canvas.height / 2);
    }
    else {
      context.fillText("NOT READY", 200, canvas.height / 2);
    }
    if (playerTwo.isReady) {
      context.fillText("READY", canvas.width - 200, canvas.height / 2);
    }
    else {
      context.fillText("NOT READY", canvas.width - 200, canvas.height / 2);
    }
  }

  const drawAbortedMenu = (game: Game | undefined, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if (!game || !canvas || !context) {return;}

    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText("Game Aborted", canvas.width / 2, canvas.height / 2);

    context.font = '20px Arial';
    context.fillText("Press -Space- to go to HOMEPAGE", canvas.width / 2, 400);
  }

  const drawStartingMenu = (game: Game | undefined, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if (!game || !canvas || !context) {return;}

    let leftOverSeconds: number = game.countdown;
    if (leftOverSeconds < 0) {leftOverSeconds = 0;}

    context.fillStyle = 'white';
    context.font = '60px Arial';
    context.textAlign = 'center';
    context.fillText(leftOverSeconds.toFixed(), canvas.width / 2, canvas.height / 2);

    context.font = '30px Arial';
    context.fillText("Game Starting In", canvas.width / 2, (canvas.height / 2) - 100);

    setTimeout(() => draw(game), 1000 / 10); // 10 FPS
  }

  const drawPausedMenu = (game: Game | undefined, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if (!game || !canvas || !context) {return;}

    let leftOverSeconds: number = game.countdown;
    if (leftOverSeconds < 0) {leftOverSeconds = 0;}

    context.fillStyle = 'white';
    context.font = '60px Arial';
    context.textAlign = 'center';
    context.fillText(leftOverSeconds.toFixed(), canvas.width / 2, canvas.height / 2);

    context.font = '30px Arial';
    context.fillText("Opponent has been disconnected.", canvas.width / 2, (canvas.height / 2) - 100);

    setTimeout(() => draw(game), 1000 / 10); // 10 FPS
  }

  const drawFinishedWin = (game: Game | undefined, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if (!game || !canvas || !context) {return;}

    context.fillStyle = 'white';
    context.font = '60px Arial';
    context.textAlign = 'center';
    context.fillText("VICTORY", canvas.width / 2, canvas.height / 2);

    context.font = '20px Arial';
    context.fillText("Press -Space- to go to HOMEPAGE", canvas.width / 2, 400);
  }

  const drawFinishedLose = (game: Game | undefined, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    if (!game || !canvas || !context) {return;}

    context.fillStyle = 'white';
    context.font = '60px Arial';
    context.textAlign = 'center';
    context.fillText("DEFEAT", canvas.width / 2, canvas.height / 2);
  
    context.font = '20px Arial';
    context.fillText("Press -Space- to go to HOMEPAGE", canvas.width / 2, 400);
  }

  const listen = (game: Game | undefined) => {
    if (!game) {return;}

    if (!socket) {return;}

    const playerPaddle = game.playerPaddle;
    const opponentPaddle = game.opponentPaddle;
    const gridSize = game.gridSize;

    document.addEventListener('mousemove', (e) => {
      if (game.gameState === GameState.PLAYING) {
        const newY = (e.y - 370) / gridSize;
        playerPaddle.position.y = newY;
        paddleControl(playerPaddle);
        if (playerPaddle.position.x < opponentPaddle.position.x) {
          socket.emit('playerOneMove', newY)
        }
        else {
          socket.emit('playerTwoMove', newY)
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (game.gameState === GameState.PLAYING && (e.code === 'ArrowDown' || e.code === 'KeyS')) {
        playerPaddle.position.y = playerPaddle.position.y + playerPaddle.speed;
        paddleControl(playerPaddle);
        if (playerPaddle.position.x < opponentPaddle.position.x) {
          socket.emit('playerOneMove', playerPaddle.position.y)
        }
        else {
          socket.emit('playerTwoMove', playerPaddle.position.y)
        }
      }
      else if (game.gameState === GameState.PLAYING && (e.code === 'ArrowUp' || e.code === 'KeyW')) {
        playerPaddle.position.y = playerPaddle.position.y - playerPaddle.speed;
        paddleControl(playerPaddle);
        if (playerPaddle.position.x < opponentPaddle.position.x) {
          socket.emit('playerOneMove', playerPaddle.position.y)
        }
        else {
          socket.emit('playerTwoMove', playerPaddle.position.y)
        }
      }
      else if (game.gameState === GameState.WAITINGTOSTART && e.code === 'Space') {
        playerPaddle.isReady = true;
        socket.emit('ready');
      }
      else if ((game.gameState === GameState.ABORTED || game.gameState === GameState.FINISHEDLOSE || game.gameState === GameState.FINISHEDWIN) && e.code === 'Space') {
        window.location.assign("/home");
      }
      else {
        return;
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
    if (currentUser && !socket) {
      setSocket(io(`${process.env.REACT_APP_BACKEND_URI}/game`, {query: {userId: currentUser.id, gameId: gameId}}))
    }
    if (socket && !socketListen) {
      socket.on("gameDataInitial", (data) => {
        gameData = JSON.parse(data);
        if (gameData.playerPaddle.position.x < gameData.opponentPaddle.position.x) {
          setPlayerOneName(gameData.playerPaddle.name);
          setPlayerOneScore(gameData.playerPaddle.score);
          setPlayerTwoName(gameData.opponentPaddle.name);
          setPlayerTwoScore(gameData.opponentPaddle.score);
        }
        else {
          setPlayerTwoName(gameData.playerPaddle.name);
          setPlayerTwoScore(gameData.playerPaddle.score);
          setPlayerOneName(gameData.opponentPaddle.name);
          setPlayerOneScore(gameData.opponentPaddle.score);
        }
        listen(gameData);
        requestAnimationFrame(() => draw(gameData));
        socket.off("gameDataInitial");
      });
      socket.on("countdown", (data: number) => {
        gameData.countdown = data;
        requestAnimationFrame(() => draw(gameData));
      });
      socket.on("gameStarting", (data: number) => {
        gameData.gameState = GameState.STARTING;
      });
      socket.on("gamePaused", (data: number) => {
        gameData.gameState = GameState.PAUSED;
      });
      socket.on("gameStarted", () => {
        gameData.gameState = GameState.PLAYING;
      });
      socket.on("gameData", (data) => {
        const dataJSON = JSON.parse(data);
        gameData.ball.position.x = dataJSON.ball.x;
        gameData.ball.position.y = dataJSON.ball.y;
        gameData.opponentPaddle.position.y = dataJSON.opponentPaddle.y;
        if (dataJSON.hasOwnProperty('playerPaddle')) {
          gameData.playerPaddle.score = dataJSON.playerPaddle.score;
          gameData.opponentPaddle.score = dataJSON.opponentPaddle.score;
          if (gameData.playerPaddle.position.x < gameData.opponentPaddle.position.x) {
            setPlayerOneScore(gameData.playerPaddle.score);
            setPlayerTwoScore(gameData.opponentPaddle.score);
          }
          else {
            setPlayerOneScore(gameData.opponentPaddle.score);
            setPlayerTwoScore(gameData.playerPaddle.score);
          }
        }
        requestAnimationFrame(() => draw(gameData));
      });
      socket.on("opponentReady", () => {
        gameData.opponentPaddle.isReady = true;
        socket.off("opponentReady");
      });
      socket.on("gameAborted", () => {
        gameData.gameState = GameState.ABORTED;
        requestAnimationFrame(() => draw(gameData));
        socket.off("gameAborted");
        socket.disconnect();
      });
      socket.on("win", () => {
        gameData.gameState = GameState.FINISHEDWIN;
        requestAnimationFrame(() => draw(gameData));
        socket.off("win");
        socket.disconnect();
      });
      socket.on("lose", () => {
        gameData.gameState = GameState.FINISHEDLOSE;
        requestAnimationFrame(() => draw(gameData));
        socket.off("lose");
        socket.disconnect();
      });
      setSocketListen(true);
    }
  }, [connectControl, currentUser, socket])

  useEffect(() => {
  }, [playerOneName, playerOneScore, playerTwoName, playerTwoScore])
  
  if (connectControl) {
    return (
      <div className='gameRoot'>
        <div className="gameTable">
          <ScoreBoard playerOneName={playerOneName} playerOneScore={playerOneScore} playerTwoName={playerTwoName} playerTwoScore={playerTwoScore}/>
          <canvas width="1024" height="576" id="game" ref={canvasRef} style={{ background: 'black' }}></canvas>
        </div>
      </div>
    );
  }
  else {
    return (<PageNotFoundCmp/>)
  }
}

export default GameScreen;