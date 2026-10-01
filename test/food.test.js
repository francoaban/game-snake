import { test } from "node:test";
import assert from "node:assert/strict";
import { createFood } from "../game/food.js";

test("createFood elige una celda libre de forma determinista", () => {
  const snake = [{ x: 0, y: 0 }];

  assert.deepEqual(
    createFood(3, 3, snake, () => 0),
    { x: 1, y: 0 }
  );
  assert.deepEqual(
    createFood(3, 3, snake, () => 0.999999),
    { x: 2, y: 2 }
  );
});

test("createFood nunca cae sobre la serpiente", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 }
  ];

  for (let i = 0; i < 100; i += 1) {
    const food = createFood(3, 3, snake, () => i / 100);
    assert.ok(!snake.some((s) => s.x === food.x && s.y === food.y));
  }
});

test("createFood devuelve la única celda libre", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ];

  assert.deepEqual(createFood(2, 2, snake), { x: 1, y: 1 });
});

test("createFood devuelve null si el tablero está lleno", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 }
  ];

  assert.equal(createFood(2, 2, snake), null);
});
