import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PageNotFoundCmp from "../componets/PageNotFoundCmp";
import { Socket, io } from "socket.io-client";
import { User } from "../dto/DataObject";
import "../ui-design/styles/GameScreen.css"

function ScoreBoard({ playerOneScore, playerTwoScore }: { playerOneScore: number, playerTwoScore: number }){
  return(
    <div className='scoreBoard'>
      <div className="playerOneScore">peachadam:{playerOneScore}</div>
      <div className='vs'>VS</div>
      <div className="playerTwoScore">peachadam:{playerTwoScore}</div>
    </div>
  )
}

const GameScreen = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connectControl, setConnectControl] = useState<boolean>(false)
  const { gameId } = useParams()

  const [abortNotConnected, setAbortNotConnected] = useState<boolean>(false)
  const [abortNotReady, setAbortNotReady] = useState<boolean>(false)

  const [canvas, setCanvas] = useState<HTMLCanvasElement>()//document.getElementById('game') as HTMLCanvasElement
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null) //canvas.getContext('2d')

  const [drawReady, setDrawReady] = useState<boolean>(false);
  const [playerOne, setPlayerOne] = useState<Position>();
  const [playerTwo, setPlayerTwo] = useState<Position>();
  const [ball, setBall] = useState<Position>();

  const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  }

  interface Position {
    x: number;
    y: number;
  }

  /*interface Ball {
    width: number;
    height: number;
    x: number;
    y: number;
    moveX: number;
    moveY: number;
    speed: number;
  }

  interface Paddle {
    id: number,
    name: string,
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
    createPaddle(side: string, name: string, userId: number): Paddle {
      let w: number = 0;
      let h: number = 0;
      if (canvas) {
        w = canvas.width;
        h = canvas.height;
      }
      return {
        id: userId,
        name: name,
        width: 18,
        height: 180,
        x: side === 'left' ? 150 : w - 150,
        y: (h / 2) - 90,
        score: 0,
        move: DIRECTION.IDLE,
        speed: 8
      }
    }
  }*/

  /*const [playerOne, setPlayerOne] = useState<Paddle>(Paddle.createPaddle('left'));
  const [playerTwo, setPlayerTwo] = useState<Paddle>(Paddle.createPaddle('right'));
  const [ball, setBall] = useState<Ball>(Ball.createBall());
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [playerPaddle, setPlayerPaddle] = useState<Paddle>();*/

  /*let playerOne: Paddle;
  let playerTwo: Paddle;
  let ball: Ball;
  let gameStarted: boolean;
  let playerPaddle: Paddle;*/

  /*const Game = {
    async initialize(): Promise<void> {
      if (!currentUser) {return;}
      console.log("Game initialize ran.")
      ball = Ball.createBall();
      gameStarted = false;
      const players = (await axios.get(`/game/players/${gameId}`)).data;
      playerOne = Paddle.createPaddle('left', players.playerOne.displayname, players.playerOne.id);
      playerTwo = Paddle.createPaddle('right', players.playerTwo.displayname, players.playerTwo.id);
      if (playerOne.id === currentUser.id) {
        playerPaddle = playerOne;
      }
      else {
        playerPaddle = playerTwo;
      }

      window.requestAnimationFrame(Game.menuLoop);
    },

    async menuLoop(): Promise<void> {
      const countdownEndTime = Date.parse((await axios.get(`/game/createTime/${gameId}`)).data) + (20 * 1000);

      Game.menuDraw(countdownEndTime);
      if (!gameStarted) {requestAnimationFrame(Game.menuLoop);}
      else {requestAnimationFrame(Game.loop);}
    },

    menuDraw(countdownEndTime: number): void {
      if (!canvas || !context) {return;}

      const secondsLeft = (countdownEndTime - Date.now()) / 1000;

      const colorBlack = '#111111';
      const colorWhite = '#d4d2d2';

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      context.fillStyle = colorWhite;
      context.textAlign = 'center';
      if (secondsLeft >= 0) {
        context.font = '20px "Press Start 2P"';
        context.fillText(
          playerOne.name,
          (canvas.width / 2) - 200,
          300
        )
        context.fillText(
          playerTwo.name,
          (canvas.width / 2) + 200,
          300
        )

        context.font = '60px "Press Start 2P"';
        context.fillText(
          secondsLeft.toFixed(),
          canvas.width / 2,
          100
        )
      }
      else {
        context.font = '60px "Press Start 2P"';
        context.fillText(
          "Oyun iptal",
          canvas.width / 2,
          100
        )
      }
    },

    draw(): void {
      if (!canvas || !context) {return;}

      const colorBlack = '#111111';
      const colorWhite = '#d4d2d2';

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

      context.font = '100px "Press Start 2P"';
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
    },

    loop(): void {

    }
  }*/

  const playerOneRef = useRef(playerOne);
  const playerTwoRef = useRef(playerTwo);
  const ballRef = useRef(ball);
  const contextRef = useRef(context);
  const canvasRef = useRef(canvas);
  const playerOneScore = useRef(0);
  const playerTwoScore = useRef(0);

  useEffect(() => {
    playerOneRef.current = playerOne;
    playerTwoRef.current = playerTwo;
    ballRef.current = ball;
  }, [playerOne, playerTwo, ball])

  useEffect(() => {
    const draw = () => {
      const canvas = document.getElementById('game') as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      const playerOne = playerOneRef.current;
      const playerTwo = playerTwoRef.current;
      const ball = ballRef.current;
      const grid : number = 15;

      if (!canvas || !context || !playerOne || !playerTwo || !ball){return;}
      
      context.clearRect(0, 0, canvas.width, canvas.height); // bir önceki döngütü temizle

      context.fillStyle = 'white';
      context.fillRect(20, playerOne.y, 10, 100); // player1
      context.fillRect(canvas.width - 30, playerTwo.y, 10, 100); // player2
      context.fillRect(ball.x, ball.y, grid, grid) //  top

      //scoreboardın altını ve canvasın altını boyuyor
      context.fillStyle = 'lightgrey';
      context.fillRect(0, 0, canvas.width, grid);
      context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

      //net i çiziyor
      for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
      }

      //input dinleyen yerler
      document.addEventListener('keydown', function(e) {
        if (e.which === 38) {
          if(playerTwo.y > 0){
            playerTwo.y--;
          }
        } else if (e.which === 40) {
          if(playerTwo.y < 500){
            playerTwo.y++;
          }
        }
      });
  
      /*document.addEventListener('keyup', function(e) {
        if (e.which === 38 || e.which === 40) {
          console.log("asagi basiym");
        }
      });*/

    }

    if (drawReady) {
      const loop = () => {
        draw();
        requestAnimationFrame(loop);
      }
      window.requestAnimationFrame(loop);
    }
  }, [drawReady])

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
      socket.on("playerOnePosition", (data) => { setPlayerOne(data) });
      socket.on("playerTwoPosition", (data) => { setPlayerTwo(data) });
      socket.on("ballPosition", (data) => { setBall(data) });
    }
    if (context && !drawReady && playerOne && playerTwo && ball) {
      setDrawReady(true);
    }
  }, [connectControl, currentUser, socket, canvas, context, playerOne, playerTwo, ball])

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

  if (connectControl) {
    return (
      <div className='gameRoot'>
        <div className="gameTable">
          <ScoreBoard playerOneScore={playerOneScore.current} playerTwoScore={playerTwoScore.current}/>
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
