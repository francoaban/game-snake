import { test } from "node:test";
import assert from "node:assert/strict";
import { createSnake, getNextHead, moveSnake } from "../game/snake.js";

test("createSnake crea 3 segmentos centrados y orientados a la derecha", () => {
  assert.deepEqual(createSnake(20, 20), [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
});

test("getNextHead mueve la cabeza una celda en cada dirección", () => {
  const snake = [{ x: 5, y: 5 }];

  assert.deepEqual(getNextHead(snake, "right"), { x: 6, y: 5 });
  assert.deepEqual(getNextHead(snake, "left"), { x: 4, y: 5 });
  assert.deepEqual(getNextHead(snake, "up"), { x: 5, y: 4 });
  assert.deepEqual(getNextHead(snake, "down"), { x: 5, y: 6 });
});

test("getNextHead rechaza direcciones no válidas", () => {
  const snake = [{ x: 5, y: 5 }];

  assert.throws(() => getNextHead(snake, "diagonal"), /Dirección no válida/);
  assert.throws(() => getNextHead(snake, "toString"), /Dirección no válida/);
  assert.throws(() => getNextHead(snake, undefined), /Dirección no válida/);
});

test("moveSnake sin crecer conserva la longitud y descarta la cola", () => {
  const snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];

  assert.deepEqual(moveSnake(snake, { x: 6, y: 5 }, false), [
    { x: 6, y: 5 },
    { x: 5, y: 5 },
    { x: 4, y: 5 }
  ]);
});

test("moveSnake creciendo conserva la cola", () => {
  const snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 }
  ];

  assert.equal(moveSnake(snake, { x: 6, y: 5 }, true).length, 3);
});

test("moveSnake no muta la serpiente original", () => {
  const snake = Object.freeze([
    { x: 5, y: 5 },
    { x: 4, y: 5 }
  ]);

  assert.doesNotThrow(() => moveSnake(snake, { x: 6, y: 5 }, false));
  assert.equal(snake.length, 2);
});
