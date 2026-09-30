import { test } from "node:test";
import assert from "node:assert/strict";
import { hasCollision } from "../game/collision.js";

const snake = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 }
];

test("no hay colisión en una celda libre", () => {
  assert.equal(hasCollision({ x: 6, y: 5 }, snake, 10, 10, false), false);
});

test("detecta colisión con cada pared", () => {
  assert.equal(hasCollision({ x: -1, y: 5 }, snake, 10, 10, false), true);
  assert.equal(hasCollision({ x: 5, y: -1 }, snake, 10, 10, false), true);
  assert.equal(hasCollision({ x: 10, y: 5 }, snake, 10, 10, false), true);
  assert.equal(hasCollision({ x: 5, y: 10 }, snake, 10, 10, false), true);
});

test("las celdas del borde interior son válidas", () => {
  assert.equal(hasCollision({ x: 0, y: 0 }, snake, 10, 10, false), false);
  assert.equal(hasCollision({ x: 9, y: 9 }, snake, 10, 10, false), false);
});

test("detecta colisión con el propio cuerpo", () => {
  assert.equal(hasCollision({ x: 4, y: 5 }, snake, 10, 10, false), true);
});

test("la cola se puede pisar si no crece, pero no si crece", () => {
  assert.equal(hasCollision({ x: 3, y: 5 }, snake, 10, 10, false), false);
  assert.equal(hasCollision({ x: 3, y: 5 }, snake, 10, 10, true), true);
});
