// Núcleo del juego: funciones puras, sin DOM, sin timers y sin storage.
// Cada función recibe un estado y devuelve un estado nuevo (nunca lo muta).

import { createSnake, getNextHead, moveSnake } from "./snake.js";
import { createFood } from "./food.js";
import { hasCollision } from "./collision.js";

export const DEFAULT_COLUMNS = 20;
export const DEFAULT_ROWS = 20;
export const POINTS_PER_FOOD = 10;
export const MAX_QUEUED_DIRECTIONS = 2;

const OPPOSITE = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

/**
 * Fases: "ready" | "running" | "paused" | "over" | "won".
 * `queue` guarda giros pendientes para no perder pulsaciones rápidas.
 */
export function createInitialState({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  random = Math.random
} = {}) {
  const snake = createSnake(columns, rows);

  return {
    columns,
    rows,
    snake,
    food: createFood(columns, rows, snake, random),
    direction: "right",
    queue: [],
    score: 0,
    phase: "ready"
  };
}

export function restartGame(state, random = Math.random) {
  return createInitialState({ columns: state.columns, rows: state.rows, random });
}

/** Inicia, reanuda o (si la partida terminó) empieza una nueva. */
export function startGame(state, random = Math.random) {
  if (state.phase === "running") {
    return state;
  }

  if (state.phase === "over" || state.phase === "won") {
    return { ...restartGame(state, random), phase: "running" };
  }

  return { ...state, phase: "running" };
}

export function pauseGame(state) {
  return state.phase === "running" ? { ...state, phase: "paused" } : state;
}

/**
 * Encola un giro. Se descarta si la partida no corre, si es igual al último
 * giro (o dirección actual), si es la opuesta o si la cola está llena.
 */
export function queueDirection(state, requested) {
  if (state.phase !== "running" || !Object.hasOwn(OPPOSITE, requested)) {
    return state;
  }

  const last = state.queue.at(-1) ?? state.direction;

  if (requested === last || requested === OPPOSITE[last]) {
    return state;
  }

  if (state.queue.length >= MAX_QUEUED_DIRECTIONS) {
    return state;
  }

  return { ...state, queue: [...state.queue, requested] };
}

/** Avanza un tick. Fuera de la fase "running" no hace nada. */
export function step(state, random = Math.random) {
  if (state.phase !== "running") {
    return state;
  }

  const [queued, ...remaining] = state.queue;
  const direction = queued ?? state.direction;
  const head = getNextHead(state.snake, direction);
  const growing = Boolean(state.food) && head.x === state.food.x && head.y === state.food.y;

  if (hasCollision(head, state.snake, state.columns, state.rows, growing)) {
    return { ...state, direction, queue: remaining, phase: "over" };
  }

  const snake = moveSnake(state.snake, head, growing);
  const food = growing ? createFood(state.columns, state.rows, snake, random) : state.food;

  return {
    ...state,
    snake,
    food,
    direction,
    queue: remaining,
    score: state.score + (growing ? POINTS_PER_FOOD : 0),
    phase: food ? "running" : "won"
  };
}
