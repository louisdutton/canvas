import { useEffect, useRef, useState } from 'react';
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

interface Position {
	x: number;
	y: number;
}

// interface Props {
// 	width: number;
// 	height: number;
// }

const useCanvas = (width: number, height: number) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
	const [drawing, setDrawing] = useState(false);
	const [path, setPath] = useState<Path2D>();
	const [prevPosition, setPrevPosition] = useState<Position>({ x: -1, y: -1 });
	const [opacity, setOpacity] = useState(1.0);
	const [weight, setWeight] = useState(10);
	const [history, setHistory] = useState<History>();
	const [tool, setTool] = useState<Tool>(Tool.Pen);
	const [color, setColor] = useState('#000000');

	const draw = ({ pressure, px, py, x, y }: DrawData) => {
		if (!ctx || !weight || !path) return;

		// eraser or pen
		if (tool < 2) {
			ctx.strokeStyle = tool === 0 ? color : '#ffffff';
			ctx.globalAlpha = opacity;
			ctx.lineWidth = pressure * weight;
			ctx.beginPath();
			// path.moveTo(px, py);
			// path.lineTo(x, y);
			// ctx.stroke(path);
			ctx.moveTo(px, py);
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	};

	const onup = () => {
		console.log('up');
		setDrawing(false);
		path?.closePath();
		history?.push();
	};

	const ondown = (e: PointerEvent) => {
		console.log('down');

		setDrawing(true);

		const x = e.offsetX;
		const y = e.offsetY;
		const pressure = e.pressure;

		// create new path
		const path = new Path2D();
		path.moveTo(x, y);
		setPath(path);

		if (tool < 2) {
			draw({ roomId: '', pressure, x, y, px: x, py: y });
		} else {
			// FillTool.down(x, y, window.devicePixelRatio);
		}
	};

	const onmove = (e: PointerEvent) => {
		console.log('move');

		const x = e.offsetX;
		const y = e.offsetY;

		if (!drawing) {
			setPrevPosition({ x, y });
			return;
		}

		// draw locally
		draw({
			roomId: '',
			pressure: e.pressure,
			px: prevPosition.x,
			py: prevPosition.y,
			x,
			y
		});

		setPrevPosition({ x, y });
	};

	useEffect(() => {
		console.log('test');

		const canvas = canvasRef.current;
		if (!canvas) throw new Error('Canvas is undefined');

		const ctx = canvas.getContext('2d')!;

		canvas.style.height = height + 'px';
		canvas.style.width = width + 'px';

		const scale = window.devicePixelRatio;
		canvas.width = Math.floor(width * scale);
		canvas.height = Math.floor(height * scale);
		ctx.scale(scale, scale);
		// console.log('Canvas Scale: ' + scale);

		// fill white
		ctx.imageSmoothingEnabled = true;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// stroke style
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		// global pointer up event so it works outside of canvas
		window.addEventListener('pointerup', onup);
		canvas.addEventListener('pointerdown', ondown);
		canvas.addEventListener('pointermove', onmove);
		canvas.addEventListener('blur', onup);

		// init history
		const history = new History(ctx);
		history.push(); // push intial state

		setHistory(history);
		setCtx(ctx);

		return () => {
			window.removeEventListener('pointerup', onup);
			canvas.removeEventListener('pointerdown', ondown);
			canvas.removeEventListener('pointermove', onmove);
			canvas.removeEventListener('blur', onup);
		};
	}, []);

	return canvasRef;
};

export default useCanvas;
