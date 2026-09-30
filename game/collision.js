export function hasCollision(head, snake, columns, rows, growing) {
  const hitsWall = head.x < 0 || head.y < 0 || head.x >= columns || head.y >= rows;
  // Si no crece, la cola se libera en este mismo tick y se puede pisar.
  const bodyToCheck = growing ? snake : snake.slice(0, -1);
  const hitsBody = bodyToCheck.some((segment) => segment.x === head.x && segment.y === head.y);

  return hitsWall || hitsBody;
}
