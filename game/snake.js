export function createSnake(columns, rows) {
  const centerX = Math.floor(columns / 2);
  const centerY = Math.floor(rows / 2);

  return [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY }
  ];
}

const MOVEMENTS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export function getNextHead(snake, direction) {
  const movement = Object.hasOwn(MOVEMENTS, direction) ? MOVEMENTS[direction] : null;

  if (!movement) {
    throw new Error(`Dirección no válida: ${direction}`);
  }

  return {
    x: snake[0].x + movement.x,
    y: snake[0].y + movement.y
  };
}

export function moveSnake(snake, nextHead, grow) {
  const nextSnake = [nextHead, ...snake];

  if (!grow) {
    nextSnake.pop();
  }

  return nextSnake;
}
