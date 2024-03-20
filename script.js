var score = 0;
var lives = 5;
var gameOver = false;
var highScore = 0;
var canRestart = true;

function text(txt, fnt, x, y, c) {
  context.fillStyle = c;
  context.font = fnt;
  context.fillText(txt, x, y);
}

const storedHighScore = localStorage.getItem("highScore");
if (storedHighScore) {
  highScore = parseInt(storedHighScore);
}

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const wallSize = 12;

const playerLength = 80;
var moveLeft = false;
var moveRight = false;
const player = {
  x: canvas.width / 2 - playerLength / 2,
  y: 440,
  width: playerLength,
  height: 12,
  dx: 0,
};

function drawPlayer() {
  context.fillStyle = "white";
  context.fillRect(player.x, player.y, player.width, player.height);
}

const balls = [];
const ballSpeed = 7;

function makeBall() {
  balls.push({
    x: Math.random() * (canvas.width - wallSize * 2) + wallSize,
    y: wallSize + 10,
    width: 10,
    height: 10,
    dx: Math.random() > 0.5 ? ballSpeed : -ballSpeed,
    dy: ballSpeed,
  });
}

function drawBalls() {
  context.fillStyle = "white";
  balls.forEach((ball) => {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.width / 2, 0, Math.PI * 2);
    context.fill();
  });
}

function moveBalls() {
  balls.forEach((ball) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x < wallSize || ball.x > canvas.width - wallSize) {
      ball.dx *= -1;
    }

    if (ball.y > canvas.height - wallSize) {
      balls.splice(balls.indexOf(ball), 1);
      if (--lives === 0) {
        gameOver = true;
        canRestart = true;
      } else {
        canRestart = true;
      }
    } else if (ball.y < wallSize) {
      ball.dy *= -1;
    } else if (
      ball.y + ball.height >= player.y &&
      ball.x >= player.x &&
      ball.x <= player.x + player.width
    ) {
      ball.dy *= -1;
      score++;
    }
  });
}
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case " ": // Spacebar
      event.preventDefault(); // Prevent default spacebar behavior (like scrolling)
      if (gameOver || canRestart) {
        console.log("im here");
        makeBall();
        canRestart = false;
        gameOver = false;
      }
      break;
    case "ArrowLeft": // Left arrow key
      moveLeft = true;
      break;
    case "ArrowRight": // Right arrow key
      moveRight = true;
      break;
  }
});

document.addEventListener("keyup", function (e) {
  switch (e.which) {
    case 65:
    case 37:
      moveLeft = false;
      break;
    case 68:
    case 39:
      moveRight = false;
      break;
  }
});

function movement() {
  player.x += player.dx;
  if (moveLeft) {
    player.dx = -7;
  } else if (moveRight) {
    player.dx = 7;
  } else {
    player.dx = 0;
  }

  if (player.x < wallSize) {
    player.x = wallSize;
  } else if (player.x + playerLength > canvas.width - wallSize) {
    player.x = canvas.width - wallSize - playerLength;
  }
}

function gameOverScreen() {
  if (gameOver) {
    player.dx = 0;
    text(
      "Game Over",
      "30px Cosmic Sans MS",
      canvas.width / 2 - 60,
      340,
      "white"
    );
    text(
      "High Score: " + highScore,
      "36px Cosmic Sans MS",
      canvas.width / 2 - 90,
      300,
      "white"
    );
    text(
      "Press Space to play again",
      "18px Cosmic Sans MS",
      canvas.width / 2 - 85,
      365,
      "white"
    );
    lives = 5;
    score = 0;
  }
}

function loop() {
  if (score > highScore) {
    highScore = score;
  }

  localStorage.setItem("highScore", highScore);
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  text("Score: " + score, "30px Cosmic Sans MS", 20, 35, "white");
  text("Lives: " + lives, "30px Cosmic Sans MS", 260, 35, "white");
  gameOverScreen();

  moveBalls();
  drawBalls();
  movement();
  drawPlayer();
}

makeBall();
requestAnimationFrame(loop);
