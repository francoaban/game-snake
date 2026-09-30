// Persistencia de la partida en curso (storage.session: vive en memoria
// mientras el navegador esté abierto). Permite recuperar la partida si el
// popup se cierra al perder el foco.

const SESSION_KEY = "gameState";
const DIRECTIONS = ["up", "down", "left", "right"];
const MAX_QUEUE = 2;

function getSessionArea() {
  return globalThis.browser?.storage?.session ?? globalThis.chrome?.storage?.session ?? null;
}

function isCell(value, columns, rows) {
  return (
    Number.isInteger(value?.x) &&
    Number.isInteger(value?.y) &&
    value.x >= 0 &&
    value.y >= 0 &&
    value.x < columns &&
    value.y < rows
  );
}

/**
 * Valida un estado leído del almacenamiento. Devuelve un estado seguro en
 * fase "paused", o null si los datos no son confiables.
 */
export function restoreState(value, { columns, rows }) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const { snake, food, direction, queue, score, phase } = value;

  if (value.columns !== columns || value.rows !== rows) {
    return null;
  }
  if (phase !== "running" && phase !== "paused") {
    return null;
  }
  if (!Array.isArray(snake) || snake.length === 0 || snake.length > columns * rows) {
    return null;
  }
  if (!snake.every((segment) => isCell(segment, columns, rows))) {
    return null;
  }

  const keys = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  if (keys.size !== snake.length) {
    return null;
  }
  if (food !== null && (!isCell(food, columns, rows) || keys.has(`${food.x},${food.y}`))) {
    return null;
  }
  if (!DIRECTIONS.includes(direction)) {
    return null;
  }
  if (
    !Array.isArray(queue) ||
    queue.length > MAX_QUEUE ||
    !queue.every((d) => DIRECTIONS.includes(d))
  ) {
    return null;
  }
  if (!Number.isInteger(score) || score < 0) {
    return null;
  }

  return {
    columns,
    rows,
    snake: snake.map(({ x, y }) => ({ x, y })),
    food: food === null ? null : { x: food.x, y: food.y },
    direction,
    queue: [...queue],
    score,
    phase: "paused"
  };
}

export async function saveGameState(state, area = getSessionArea()) {
  try {
    await area?.set({ [SESSION_KEY]: state });
  } catch {
    // Sin persistencia, la partida sigue funcionando con normalidad.
  }
}

export async function loadGameState(dimensions, area = getSessionArea()) {
  try {
    if (!area) {
      return null;
    }
    const result = await area.get(SESSION_KEY);
    return restoreState(result?.[SESSION_KEY], dimensions);
  } catch {
    return null;
  }
}

export async function clearGameState(area = getSessionArea()) {
  try {
    await area?.remove(SESSION_KEY);
  } catch {
    // Nada que limpiar si el almacenamiento no está disponible.
  }
}
