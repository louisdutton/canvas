import History from './history';
import { PenTool, EraserTool } from './tools';

export enum Tool {
	Pen,
	Eraser,
	Fill
}

export interface DrawData {
	roomId: string;
	px: number;
	py: number;
	x: number;
	y: number;
	pressure: number;
}

export default class Ink {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	drawing: boolean;
	px: number;
	py: number;
	opacity: number;
	weight: number;
	history: History;
	path?: Path2D;
	tool: Tool;
	color: string;

	constructor(canvas: HTMLCanvasElement, width: 960, height: 540) {
		const ctx = canvas.getContext('2d')!;

		canvas.style.height = height + 'px';
		canvas.style.width = width + 'px';

		const scale = window.devicePixelRatio;
		canvas.width = Math.floor(width * scale);
		canvas.height = Math.floor(height * scale);
		ctx.scale(scale, scale);
		console.log('Canvas Scale: ' + scale);

		// fill white
		ctx.imageSmoothingEnabled = true;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// stroke style
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		// global pointer up event so it works outside of canvas
		window.addEventListener('pointerup', up);

		// init history
		const history = new History(ctx);
		history.push(); // push intial state

		// store in obj
		this.canvas = canvas;
		this.ctx = ctx;
		this.px = 0;
		this.py = 0;
		this.drawing = false;
		this.opacity = 1;
		this.weight = 10;
		this.history = history;
		this.tool = Tool.Pen;
		this.color = '#';
	}

	draw({ pressure, px, py, x, y }: DrawData) {
		// eraser or pen
		if (this.tool < 2) {
			if (!this.path) return;
			this.ctx.strokeStyle = this.tool === 0 ? this.color : '#ffffff';
			this.ctx.globalAlpha = this.opacity;
			this.ctx.lineWidth = pressure * this.weight;
			this.ctx.beginPath();
			this.path.moveTo(px, py);
			this.path.lineTo(x, y);
			this.ctx.stroke(this.path);
		}
	}

	onup() {
		this.drawing = false;
		this.path?.closePath();
		this.history.push();
	}

	ondown = (e: PointerEvent) => {
		this.drawing = true;

		const x = e.offsetX;
		const y = e.offsetY;
		const pressure = e.pressure;

		// create new path
		this.path = new Path2D();
		this.path.moveTo(x, y);

		if (this.tool < 2) {
			this.draw({ roomId: '', pressure, x, y, px: x, py: y });
		} else {
			// FillTool.down(x, y, window.devicePixelRatio);
		}
	};

	onmove = (e: PointerEvent) => {
		const x = e.offsetX;
		const y = e.offsetY;

		if (!this.drawing) {
			this.px = x;
			this.py = y;
			return;
		}

		// draw locally
		this.draw({
			roomId: '',
			pressure: e.pressure,
			px: this.px,
			py: this.py,
			x,
			y
		});

		// update previous position
		this.px = x;
		this.py = y;
	};
}
