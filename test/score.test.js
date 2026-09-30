import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBestScore, resolveBestScore, saveBestScore } from "../game/score.js";

function fakeArea(initial = {}) {
  const store = { ...initial };
  return {
    store,
    async get(key) {
      return key in store ? { [key]: store[key] } : {};
    },
    async set(values) {
      Object.assign(store, values);
    }
  };
}

const brokenArea = {
  async get() {
    throw new Error("storage no disponible");
  },
  async set() {
    throw new Error("storage no disponible");
  }
};

test("récord: si el nuevo puntaje supera al actual pasa a ser el récord", () => {
  assert.equal(resolveBestScore(100, 150), 150);
});

test("récord: un puntaje menor no lo reemplaza", () => {
  assert.equal(resolveBestScore(100, 50), 100);
});

test("resolveBestScore ignora valores inválidos", () => {
  assert.equal(resolveBestScore(undefined, "abc"), 0);
  assert.equal(resolveBestScore(-5, NaN), 0);
  assert.equal(resolveBestScore(40, undefined), 40);
});

test("saveBestScore y loadBestScore guardan y recuperan el récord", async () => {
  const area = fakeArea();

  await saveBestScore(250, area);

  assert.deepEqual(area.store, { bestScore: 250 });
  assert.equal(await loadBestScore(area), 250);
});

test("loadBestScore devuelve 0 si no hay récord guardado", async () => {
  assert.equal(await loadBestScore(fakeArea()), 0);
});

test("loadBestScore sanea valores corruptos", async () => {
  assert.equal(await loadBestScore(fakeArea({ bestScore: "abc" })), 0);
  assert.equal(await loadBestScore(fakeArea({ bestScore: -20 })), 0);
  assert.equal(await loadBestScore(fakeArea({ bestScore: 12.7 })), 12);
});

test("si el almacenamiento falla, load devuelve 0 y save no lanza", async () => {
  assert.equal(await loadBestScore(brokenArea), 0);
  await assert.doesNotReject(saveBestScore(100, brokenArea));
});
