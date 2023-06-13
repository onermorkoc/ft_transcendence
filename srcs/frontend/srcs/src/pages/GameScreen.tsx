import React, { useEffect, useState } from 'react';
import "../ui-design/styles/GameScreen.css"
import soundWin from '../assets/gamewin2.mp3';
import soundLose from '../assets/8bit_gamelose.mp3';
import soundCrashWall from '../assets/8bit_crash.mp3';
import soundCrashPaddle from '../assets/8bit_jump.mp3';

function ScoreBoard({ scoreLeft, scoreRight }: { scoreLeft: number, scoreRight: number }){
  return(
    <div className='scoreBoard'>
      <div className="playerRScore">peachadam:{scoreLeft}</div>
      <div className='vs'>VS</div>
      <div className="playerLScore">peachadam:{scoreRight}</div>
    </div>
  )
}

function playSound(str : string){
  if (str === "win")
  {
    console.log("ehe");
    const sound = new Audio(soundWin);
    sound.play();
  }
  else if (str === "lose")
  {
    console.log("ehe");
    const sound = new Audio(soundLose);
    sound.play();
  }
  else if (str === "wall")
  {
    console.log("ehe");
    const sound = new Audio(soundCrashWall);
    sound.play();
  }
  else if (str === "paddle")
  {
    console.log("ehe");
    const sound = new Audio(soundCrashPaddle);
    sound.play();
  }
}

const GameScreen: React.FC = () => {

  var [scoreRight, setScoreRight] = useState(0);
  var [scoreLeft, setScoreLeft] = useState(0);

  useEffect(() => {
    const targetFPS = 120;
    const targetFrameTime = 1000 / targetFPS;
    let lastFrameTime = 0;

    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const grid = 15;
    const paddleHeight = grid * 5;
    const maxPaddleY = canvas.height - grid - paddleHeight;

    var paddleSpeed = 6;
    var ballSpeed = 5;

    const leftPaddle = {
      x: grid * 2,
      y: canvas.height / 2 - paddleHeight / 2,
      width: grid,
      height: paddleHeight,
      dy: 0
    };

    const rightPaddle = {
      x: canvas.width - grid * 3,
      y: canvas.height / 2 - paddleHeight / 2,
      width: grid,
      height: paddleHeight,
      dy: 0
    };

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: grid,
      height: grid,
      resetting: false,
      dx: ballSpeed,
      dy: -ballSpeed
    };

    //çarpıştılarmı çarpışmadılarmı?
    function collides(obj1: { x: number, y: number, width: number, height: number }, paddle: { x: number, y: number, width: number, height: number }) {
      return (
        obj1.x < paddle.x + paddle.width &&
        obj1.x + obj1.width > paddle.x &&
        obj1.y < paddle.y + paddle.height &&
        obj1.y + obj1.height > paddle.y
      );
    }

    function loop(currentTime: any) {
      const elapsed = currentTime - lastFrameTime;
      if (context && elapsed >= targetFrameTime)
      {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        leftPaddle.y += leftPaddle.dy;
        rightPaddle.y += rightPaddle.dy;
        
        if (leftPaddle.y < grid) {
          leftPaddle.y = grid;
        } else if (leftPaddle.y > maxPaddleY) {
          leftPaddle.y = maxPaddleY;
        }
        
        if (rightPaddle.y < grid) {
          rightPaddle.y = grid;
        } else if (rightPaddle.y > maxPaddleY) {
          rightPaddle.y = maxPaddleY;
        }

        context.fillStyle = 'white';
        context.fillRect(
          leftPaddle.x,
          leftPaddle.y,
          leftPaddle.width,
          leftPaddle.height
          );
          context.fillRect(
            rightPaddle.x,
            rightPaddle.y,
            rightPaddle.width,
            rightPaddle.height
            );
      
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y < grid) {
          playSound("wall");
          ball.y = grid;
          ball.dy *= -1;
        } else if (ball.y + grid > canvas.height - grid) {
          ball.y = canvas.height - grid * 2;
          ball.dy *= -1;
          playSound("wall");
        }

        //gol olma durumu ve resetleme
        if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
          ball.resetting = true;

          if (ball.x < 0) {
            setScoreRight(prevScore => prevScore + 1);
          }else if (ball.x > canvas.width){
            setScoreLeft(prevScore => prevScore + 1);
          }

          //topu resetle
          setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
          }, 400);
        }

        // Topun paddle'lara çarpma kontrolü
        if (collides(ball, leftPaddle)) {
          ball.dx *= -1;
          ball.x = leftPaddle.x + leftPaddle.width;
          playSound("paddle");
        } else if (collides(ball, rightPaddle)) {
          playSound("paddle");
          ball.dx *= -1;
          ball.x = rightPaddle.x - ball.width;
        }
        context.fillRect(ball.x, ball.y, ball.width, ball.height);

        context.fillStyle = 'lightgrey';
        context.fillRect(0, 0, canvas.width, grid);
        context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

        for (let i = grid; i < canvas.height - grid; i += grid * 2) {
          context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
        }
        lastFrameTime = currentTime;
      }
      requestAnimationFrame(loop);
    }

    //input dinleyen yerler
    document.addEventListener('keydown', function(e) {
      if (e.which === 38) {
        rightPaddle.dy = -paddleSpeed;
      } else if (e.which === 40) {
        rightPaddle.dy = paddleSpeed;
      }

      if (e.which === 87) {
        leftPaddle.dy = -paddleSpeed;
      } else if (e.which === 83) {
        leftPaddle.dy = paddleSpeed;
      }
    });

    document.addEventListener('keyup', function(e) {
      if (e.which === 38 || e.which === 40) {
        rightPaddle.dy = 0;
      }

      if (e.which === 83 || e.which === 87) {
        leftPaddle.dy = 0;
      }
    });

  
    requestAnimationFrame(loop);
  
  }, []);

  return (
    <div className='game'>
      <ScoreBoard scoreLeft={scoreLeft} scoreRight={scoreRight} />
      <canvas width="1000" height="585" id="game" style={{ background: 'black' }}></canvas>
    </div>
  );
};

export default GameScreen;

/*const GameScreen = () => {
    
    //const { matchID } = useParams()

    //const matchInfoData: GameRoom = allGameRoomList.find((value: GameRoom): boolean => { return value.id === matchID})!!

    return (
        <>
            {/* Eski Skore Board }

            {/* <div className="gameScreenRootDiv">
                <div className="gameScreenUsersInfoDiv">
                    <img className="matchAvatarImg" src="https://cdn.intra.42.fr/users/be2eeaebbc2be8a4f6289b5996d64362/omorkoc.jpg" alt=""/>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div className="matchUserInfo">Öner Morkoç</div>
                        <div className="matchUserInfo">Ünvan: Çaylak</div>
                    </div>
                    <div className="skoreTable">05</div>
                </div>
                <img className="vsImg" src={require("../ui-design/images/vs.png")} alt=""/>
                <div className="gameScreenUsersInfoDiv">
                    <div className="skoreTable">03</div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div className="matchUserInfo">Altuğ Alpcan Yaşar</div>
                        <div className="matchUserInfo">Ünvan: Çaylak</div>
                    </div>
                    <img className="matchAvatarImg" src="https://cdn.intra.42.fr/users/3519bd7260eb9395ef762149957b6f43/alyasar.jpg" alt=""/>
                </div>
            </div> }

            {/* Yaysu }
            
            <Game/>

        </>
    )
}

export default GameScreen*/