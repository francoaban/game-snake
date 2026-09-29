window.SnakeGame = window.SnakeGame || {};

window.SnakeGame.loadBestScore = async function () {
  try {
    if (globalThis.browser?.storage?.local) {
      const result = await browser.storage.local.get("bestScore");
      return Number(result.bestScore) || 0;
    }

    return Number(globalThis.localStorage?.getItem("snakeBestScore")) || 0;
  } catch {
    return 0;
  }
};

window.SnakeGame.saveBestScore = async function (score) {
  try {
    if (globalThis.browser?.storage?.local) {
      await browser.storage.local.set({ bestScore: score });
      return;
    }

    globalThis.localStorage?.setItem("snakeBestScore", String(score));
  } catch {
    // The game remains playable if storage is unavailable.
  }
};