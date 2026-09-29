(() => {
  const columns = 20;
  const rows = 20;
  const cellSize = 16;
  const tickDuration = 130;
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");
  const scoreValue = document.getElementById("scoreValue");
  const bestValue = document.getElementById("bestValue");
  const gameStatus = document.getElementById("gameStatus");
  const startButton = document.getElementById("startButton");
  const pauseButton = document.getElementById("pauseButton");
  const restartButton = document.getElementById("restartButton");

  let snake;
  let food;
  let direction;
  let nextDirection;
  let score = 0;
  let bestScore = 0;
  let phase = "ready";
  let timer = null;

  function draw() {
    window.SnakeGame.drawBoard(context, {
      columns,
      rows,
      cellSize,
      snake,
      food
    });
  }

  function reset() {
    window.clearInterval(timer);
    timer = null;
    snake = window.SnakeGame.createSnake(columns, rows);
    food = window.SnakeGame.createFood(columns, rows, snake);
    direction = "right";
    nextDirection = direction;
    score = 0;
    phase = "ready";
    scoreValue.textContent = String(score);
    gameStatus.textContent = "Pulsa Iniciar para jugar (Tecla R)";
    startButton.textContent = "Iniciar (Tecla R)";
    pauseButton.textContent = "Pausar (Tecla P)";
    pauseButton.disabled = true;
    draw();
  }

  function start() {
    if (phase === "running") {
      return;
    }

    if (phase === "over") {
      reset();
    }

    phase = "running";
    gameStatus.textContent = "¡A por la comida!";
    startButton.textContent = "En marcha";
    startButton.disabled = true;
    pauseButton.disabled = false;
    timer = window.setInterval(tick, tickDuration);
  }

  function pause() {
    if (phase === "running") {
      window.clearInterval(timer);
      timer = null;
      phase = "paused";
      gameStatus.textContent = "Partida en pausa";
      pauseButton.textContent = "Continuar";
      startButton.disabled = false;
      startButton.textContent = "Continuar";
    } else if (phase === "paused") {
      start();
    }
  }

  function endGame(message) {
    window.clearInterval(timer);
    timer = null;
    phase = "over";
    gameStatus.textContent = message;
    startButton.disabled = false;
    startButton.textContent = "Jugar otra vez";
    pauseButton.disabled = true;
  }

  function tick() {
    direction = nextDirection;
    const head = window.SnakeGame.getNextHead(snake, direction);
    const growing = head.x === food.x && head.y === food.y;

    if (window.SnakeGame.hasCollision(head, snake, columns, rows, growing)) {
      endGame("Fin de partida · pulsa Reiniciar");
      return;
    }

    snake = window.SnakeGame.moveSnake(snake, head, growing);
    if (growing) {
      score += 10;
      scoreValue.textContent = String(score);
      if (score > bestScore) {
        bestScore = score;
        bestValue.textContent = String(bestScore);
        window.SnakeGame.saveBestScore(bestScore);
      }
      food = window.SnakeGame.createFood(columns, rows, snake);
      if (!food) {
        draw();
        endGame("¡Tablero completo! Has ganado");
        return;
      }
    }

    draw();
  }

  function requestDirection(requestedDirection) {
    const opposite = {
      up: "down",
      down: "up",
      left: "right",
      right: "left"
    };

    if (phase === "running" && requestedDirection !== opposite[direction]) {
      nextDirection = requestedDirection;
    }
  }

  startButton.addEventListener("click", start);
  pauseButton.addEventListener("click", pause);
  restartButton.addEventListener("click", () => {
    reset();
    start();
  });

  document.addEventListener("keydown", (event) => {
    const directions = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right"
    };

    if (directions[event.key]) {
      event.preventDefault();
      requestDirection(directions[event.key]);
    } else if (event.key.toLowerCase() === "p") {
      pause();
    } else if (event.key.toLowerCase() === "r") {
      reset();
      start();
    }
  });

  reset();
  window.SnakeGame.loadBestScore().then((value) => {
    bestScore = value;
    bestValue.textContent = String(bestScore);
  });
})();