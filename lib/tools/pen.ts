export const PenTool = {
	down: () => {},
	up: () => {},
	move: (
		ctx: CanvasRenderingContext2D,
		path: Path2D,
		color: string,
		opacity: number,
		pressure: number,
		weight: number,
		px: number,
		py: number,
		x: number,
		y: number
	) => {
		// ctx.globalCompositeOperation = 'source-over';
		ctx.strokeStyle = color;
		ctx.globalAlpha = opacity;
		ctx.lineWidth = pressure * weight;
		ctx.beginPath();
		path.moveTo(px, py);
		path.lineTo(x, y);
		ctx.stroke(path);
	}
};
