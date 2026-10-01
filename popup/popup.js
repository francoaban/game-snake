import {
  createInitialState,
  pauseGame,
  queueDirection,
  restartGame,
  startGame,
  step
} from "../game/engine.js";
import { drawBoard } from "../game/board.js";
import { loadBestScore, resolveBestScore, saveBestScore } from "../game/score.js";
import { clearGameState, loadGameState, saveGameState } from "../game/session.js";

const CELL_SIZE = 16;
const TICK_MS = 130;

const KEY_TO_DIRECTION = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
};

// Textos y estado de los botones para cada fase del juego.
const PHASE_UI = {
  ready: {
    status: "Pulsa Iniciar o una flecha para jugar",
    start: "Iniciar",
    startDisabled: false,
    pause: "Pausar",
    pauseDisabled: true
  },
  running: {
    status: "¡A por la comida!",
    start: "En marcha",
    startDisabled: true,
    pause: "Pausar",
    pauseDisabled: false
  },
  paused: {
    status: "Partida en pausa",
    start: "Pausado",
    startDisabled: true,
    pause: "Continuar",
    pauseDisabled: false
  },
  over: {
    status: "Fin de partida · pulsa R para reiniciar",
    start: "Jugar otra vez",
    startDisabled: false,
    pause: "Pausar",
    pauseDisabled: true
  },
  won: {
    status: "¡Tablero completo! Has ganado",
    start: "Jugar otra vez",
    startDisabled: false,
    pause: "Pausar",
    pauseDisabled: true
  }
};

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const scoreValue = document.getElementById("scoreValue");
const bestValue = document.getElementById("bestValue");
const gameStatus = document.getElementById("gameStatus");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

let state = createInitialState();
let bestScore = 0;
let timer = null;

function setText(element, text) {
  // Evita reescribir el mismo texto: el lector de pantalla lo anunciaría de nuevo.
  if (element.textContent !== text) {
    element.textContent = text;
  }
}

function render() {
  const ui = PHASE_UI[state.phase];

  setText(scoreValue, String(state.score));
  setText(bestValue, String(bestScore));
  setText(gameStatus, ui.status);
  setText(startButton, ui.start);
  startButton.disabled = ui.startDisabled;
  setText(pauseButton, ui.pause);
  pauseButton.disabled = ui.pauseDisabled;

  drawBoard(context, {
    columns: state.columns,
    rows: state.rows,
    cellSize: CELL_SIZE,
    snake: state.snake,
    food: state.food
  });

  persist();
}

// Guarda la partida en curso para recuperarla si el popup se cierra.
function persist() {
  if (state.phase === "running" || state.phase === "paused") {
    saveGameState(state);
  } else if (state.phase === "over" || state.phase === "won") {
    clearGameState();
  }
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function startTimer() {
  stopTimer();
  timer = setInterval(tick, TICK_MS);
}

function tick() {
  state = step(state);

  if (state.score > bestScore) {
    bestScore = state.score;
    saveBestScore(bestScore);
  }

  if (state.phase !== "running") {
    stopTimer();
  }

  render();
}

// Inicia, reanuda o empieza una partida nueva según la fase actual.
function begin() {
  if (state.phase === "running") {
    return;
  }

  state = startGame(state);
  startTimer();
  render();
}

function togglePause() {
  if (state.phase === "running") {
    stopTimer();
    state = pauseGame(state);
    render();
  } else if (state.phase === "paused") {
    begin();
  }
}

function restart() {
  stopTimer();
  state = restartGame(state);
  begin();
}

function bindButton(button, action) {
  button.addEventListener("click", () => {
    action();
    // Sin foco residual, Espacio/Enter no vuelve a activar el botón.
    button.blur();
  });
}

bindButton(startButton, begin);
bindButton(pauseButton, togglePause);
bindButton(restartButton, restart);

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const direction = KEY_TO_DIRECTION[event.key];

  if (direction) {
    event.preventDefault();
    if (state.phase === "ready") {
      begin();
    }
    state = queueDirection(state, direction);
    return;
  }

  if (event.repeat) {
    return;
  }

  // Sobre un botón enfocado, Espacio/Enter conservan su comportamiento nativo.
  if (event.target instanceof HTMLButtonElement && (event.key === " " || event.key === "Enter")) {
    return;
  }

  if (event.key === " ") {
    event.preventDefault();
    if (state.phase === "running" || state.phase === "paused") {
      togglePause();
    } else {
      begin();
    }
    return;
  }

  const key = event.key.toLowerCase();

  if (key === "p") {
    togglePause();
  } else if (key === "r") {
    restart();
  }
});

render();

loadBestScore().then((value) => {
  bestScore = resolveBestScore(bestScore, value);
  render();
});

// Si el popup se cerró en mitad de una partida, se recupera en pausa.
loadGameState({ columns: state.columns, rows: state.rows }).then((saved) => {
  if (saved && state.phase === "ready") {
    state = saved;
    render();
  }
});
