import { test } from "node:test";
import assert from "node:assert/strict";
import { clearGameState, loadGameState, restoreState, saveGameState } from "../game/session.js";

const size = { columns: 20, rows: 20 };

function validState(overrides = {}) {
  return {
    columns: 20,
    rows: 20,
    snake: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ],
    food: { x: 10, y: 10 },
    direction: "right",
    queue: ["up"],
    score: 30,
    phase: "running",
    ...overrides
  };
}

function fakeArea() {
  const store = {};
  return {
    store,
    async get(key) {
      return key in store ? { [key]: store[key] } : {};
    },
    async set(values) {
      Object.assign(store, structuredClone(values));
    },
    async remove(key) {
      delete store[key];
    }
  };
}

test("restoreState recupera una partida válida siempre en pausa", () => {
  const restored = restoreState(validState(), size);

  assert.equal(restored.phase, "paused");
  assert.equal(restored.score, 30);
  assert.deepEqual(restored.queue, ["up"]);
  assert.equal(restored.snake.length, 3);
});

test("restoreState acepta comida nula (tablero completo)", () => {
  assert.notEqual(restoreState(validState({ food: null }), size), null);
});

test("restoreState rechaza datos no confiables", () => {
  const invalid = [
    null,
    "texto",
    validState({ phase: "over" }),
    validState({ phase: "ready" }),
    validState({ columns: 10 }),
    validState({ snake: [] }),
    validState({ snake: [{ x: 99, y: 0 }] }),
    validState({
      snake: [
        { x: 1, y: 1 },
        { x: 1, y: 1 }
      ]
    }),
    validState({ snake: "no-es-un-array" }),
    validState({ food: { x: 5, y: 5 } }),
    validState({ food: { x: -1, y: 0 } }),
    validState({ direction: "diagonal" }),
    validState({ queue: ["up", "left", "down"] }),
    validState({ queue: ["toString"] }),
    validState({ score: -10 }),
    validState({ score: 1.5 })
  ];

  for (const value of invalid) {
    assert.equal(restoreState(value, size), null);
  }
});

test("save, load y clear recorren el ciclo completo", async () => {
  const area = fakeArea();

  await saveGameState(validState(), area);
  const loaded = await loadGameState(size, area);
  assert.equal(loaded.phase, "paused");
  assert.equal(loaded.score, 30);

  await clearGameState(area);
  assert.equal(await loadGameState(size, area), null);
});

test("sin almacenamiento o con errores, las funciones no lanzan", async () => {
  const broken = {
    async get() {
      throw new Error("fallo");
    },
    async set() {
      throw new Error("fallo");
    },
    async remove() {
      throw new Error("fallo");
    }
  };

  assert.equal(await loadGameState(size, null), null);
  assert.equal(await loadGameState(size, broken), null);
  await assert.doesNotReject(saveGameState(validState(), broken));
  await assert.doesNotReject(clearGameState(broken));
  await assert.doesNotReject(saveGameState(validState(), null));
});
