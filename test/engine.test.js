import { test } from "node:test";
import assert from "node:assert/strict";
import {
  POINTS_PER_FOOD,
  createInitialState,
  pauseGame,
  queueDirection,
  restartGame,
  startGame,
  step
} from "../game/engine.js";

const first = () => 0;

function running(overrides = {}) {
  return {
    columns: 20,
    rows: 20,
    snake: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ],
    food: { x: 0, y: 0 },
    direction: "right",
    queue: [],
    score: 0,
    phase: "running",
    ...overrides
  };
}

test("createInitialState arranca en fase ready, sin puntos y con comida", () => {
  const state = createInitialState({ random: first });

  assert.equal(state.phase, "ready");
  assert.equal(state.score, 0);
  assert.equal(state.direction, "right");
  assert.deepEqual(state.queue, []);
  assert.deepEqual(state.snake[0], { x: 10, y: 10 });
  assert.deepEqual(state.food, { x: 0, y: 0 });
});

test("movimiento: desde X=5,Y=5 hacia la derecha queda en X=6,Y=5", () => {
  const next = step(running());

  assert.deepEqual(next.snake[0], { x: 6, y: 5 });
  assert.equal(next.snake.length, 3);
  assert.equal(next.score, 0);
});

test("comida: al alcanzarla suma puntos, crece y genera nueva comida", () => {
  const next = step(running({ food: { x: 6, y: 5 } }), first);

  assert.equal(next.score, POINTS_PER_FOOD);
  assert.equal(next.snake.length, 4);
  assert.deepEqual(next.food, { x: 0, y: 0 });
  assert.equal(next.phase, "running");
});

test("colisión: contra la pared termina la partida", () => {
  const state = running({
    snake: [
      { x: 19, y: 5 },
      { x: 18, y: 5 },
      { x: 17, y: 5 }
    ]
  });
  const next = step(state);

  assert.equal(next.phase, "over");
  assert.deepEqual(next.snake, state.snake);
});

test("colisión: contra el propio cuerpo termina la partida", () => {
  const state = running({
    snake: [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 4 },
      { x: 5, y: 4 },
      { x: 4, y: 4 }
    ],
    direction: "left",
    queue: ["up"]
  });

  assert.equal(step(state).phase, "over");
});

test("colisión: pisar la cola cuando no se crece está permitido", () => {
  const state = running({
    snake: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 1 }
    ],
    food: { x: 10, y: 10 },
    direction: "up",
    queue: ["right"]
  });

  assert.equal(step(state).phase, "running");
});

test("victoria: al llenar el tablero la fase pasa a won", () => {
  const state = running({
    columns: 2,
    rows: 2,
    snake: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 }
    ],
    food: { x: 0, y: 0 },
    direction: "left",
    queue: ["up"]
  });
  const next = step(state);

  assert.equal(next.phase, "won");
  assert.equal(next.food, null);
  assert.equal(next.snake.length, 4);
  assert.equal(next.score, POINTS_PER_FOOD);
});

test("step no hace nada fuera de la fase running", () => {
  for (const phase of ["ready", "paused", "over", "won"]) {
    const state = running({ phase });
    assert.equal(step(state), state);
  }
});

test("step no muta el estado anterior", () => {
  const state = running({ food: { x: 6, y: 5 }, queue: ["up"] });
  const before = structuredClone(state);

  step(state, first);

  assert.deepEqual(state, before);
});

test("queueDirection ignora la dirección opuesta y la repetida", () => {
  const state = running();

  assert.equal(queueDirection(state, "left"), state);
  assert.equal(queueDirection(state, "right"), state);
});

test("queueDirection ignora valores inválidos y fases distintas de running", () => {
  const state = running();
  assert.equal(queueDirection(state, "diagonal"), state);
  assert.equal(queueDirection(state, "toString"), state);

  const paused = running({ phase: "paused" });
  assert.equal(queueDirection(paused, "up"), paused);
});

test("queueDirection admite dos giros rápidos y descarta el tercero", () => {
  let state = running();
  state = queueDirection(state, "up");
  state = queueDirection(state, "left");
  assert.deepEqual(state.queue, ["up", "left"]);

  const full = queueDirection(state, "down");
  assert.equal(full, state);
});

test("queueDirection valida contra el último giro encolado, no contra el actual", () => {
  const state = queueDirection(running(), "up");

  // "down" es opuesto al giro pendiente ("up"), aunque no a la dirección actual.
  assert.equal(queueDirection(state, "down"), state);
});

test("los giros encolados se aplican uno por tick", () => {
  let state = running();
  state = queueDirection(state, "up");
  state = queueDirection(state, "left");

  state = step(state);
  assert.deepEqual(state.snake[0], { x: 5, y: 4 });
  assert.equal(state.direction, "up");

  state = step(state);
  assert.deepEqual(state.snake[0], { x: 4, y: 4 });
  assert.equal(state.direction, "left");
  assert.deepEqual(state.queue, []);
});

test("pausa y reanudación conservan el estado del juego", () => {
  const state = running({ score: 30 });
  const paused = pauseGame(state);

  assert.equal(paused.phase, "paused");
  assert.equal(paused.score, 30);

  const resumed = startGame(paused);
  assert.equal(resumed.phase, "running");
  assert.deepEqual(resumed.snake, state.snake);
});

test("pauseGame solo aplica mientras el juego corre", () => {
  const ready = createInitialState({ random: first });

  assert.equal(pauseGame(ready), ready);
});

test("reinicio: serpiente en posición inicial, puntos en 0 y fase ready", () => {
  const finished = running({ phase: "over", score: 120 });
  const fresh = restartGame(finished, first);
  const initial = createInitialState({ random: first });

  assert.deepEqual(fresh, initial);
});

test("startGame tras una derrota empieza una partida nueva ya en marcha", () => {
  const over = running({ phase: "over", score: 120 });
  const next = startGame(over, first);

  assert.equal(next.phase, "running");
  assert.equal(next.score, 0);
  assert.deepEqual(next.snake[0], { x: 10, y: 10 });
});
