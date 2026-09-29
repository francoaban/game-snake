window.SnakeGame = window.SnakeGame || {};

window.SnakeGame.drawBoard = function (context, state) {
	const { columns, rows, cellSize, snake, food } = state;
	const width = columns * cellSize;
	const height = rows * cellSize;

	context.fillStyle = "#162821";
	context.fillRect(0, 0, width, height);

	context.strokeStyle = "rgba(219, 239, 206, 0.07)";
	context.lineWidth = 1;
	for (let column = 1; column < columns; column += 1) {
		context.beginPath();
		context.moveTo(column * cellSize, 0);
		context.lineTo(column * cellSize, height);
		context.stroke();
	}
	for (let row = 1; row < rows; row += 1) {
		context.beginPath();
		context.moveTo(0, row * cellSize);
		context.lineTo(width, row * cellSize);
		context.stroke();
	}

	snake.forEach((segment, index) => {
		const inset = index === 0 ? 2 : 3;
		context.fillStyle = index === 0 ? "#d6f36a" : "#8fbd54";
		context.beginPath();
		context.roundRect(
			segment.x * cellSize + inset,
			segment.y * cellSize + inset,
			cellSize - inset * 2,
			cellSize - inset * 2,
			4
		);
		context.fill();
	});

	if (food) {
		context.fillStyle = "#ff765e";
		context.beginPath();
		context.arc(
			food.x * cellSize + cellSize / 2,
			food.y * cellSize + cellSize / 2,
			cellSize * 0.34,
			0,
			Math.PI * 2
		);
		context.fill();
	}
};