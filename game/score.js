const STORAGE_KEY = "bestScore";
const FALLBACK_KEY = "snakeBestScore";

function getStorageArea() {
  return globalThis.browser?.storage?.local ?? globalThis.chrome?.storage?.local ?? null;
}

function sanitizeScore(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

/** Devuelve el mayor entre el récord actual y el candidato. */
export function resolveBestScore(current, candidate) {
  return Math.max(sanitizeScore(current), sanitizeScore(candidate));
}

export async function loadBestScore(area = getStorageArea()) {
  try {
    if (area) {
      const result = await area.get(STORAGE_KEY);
      return sanitizeScore(result?.[STORAGE_KEY]);
    }

    return sanitizeScore(globalThis.localStorage?.getItem(FALLBACK_KEY));
  } catch {
    return 0;
  }
}

export async function saveBestScore(score, area = getStorageArea()) {
  try {
    if (area) {
      await area.set({ [STORAGE_KEY]: sanitizeScore(score) });
      return;
    }

    globalThis.localStorage?.setItem(FALLBACK_KEY, String(sanitizeScore(score)));
  } catch {
    // El juego sigue funcionando aunque el almacenamiento no esté disponible.
  }
}
