import { useEffect, useRef, useState, PointerEvent, useCallback } from 'react';
import Palette from './Palette';
import List from './List';
import IconButton from './IconButton';
import { PenTool, EraserTool, FillTool } from '../lib/tools';
import { Pen, Eraser, PaintBucket, Rectangle, IconProps } from 'phosphor-react';

type Icon = React.ForwardRefExoticComponent<
	IconProps & React.RefAttributes<SVGSVGElement>
>;

export interface DrawData {
	roomId: string;
	px: number;
	py: number;
	x: number;
	y: number;
	tool: Tool;
	color: string;
	pressure: number;
	weight: number;
}

const dimensions = {
	width: 960,
	height: 540
};

enum Tool {
	Pen,
	Eraser,
	Fill
}

export default function Canvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
	const [tool, setTool] = useState<Tool>(Tool.Pen);
	const [drawing, setDrawing] = useState(false);
	const [position, setPosition] = useState<[number, number]>();
	const [color, setColor] = useState('#000000');
	const tools = [Pen, Eraser, PaintBucket];
	const weightSlider = useRef<HTMLInputElement>(null);

	const draw = useCallback(
		(drawData: DrawData) => {
			if (!ctx) return;
			const { tool, color, pressure, weight, px, py, x, y } = drawData;

			switch (tool) {
				case Tool.Pen:
					PenTool.move(ctx, color, pressure, weight, px, py, x, y);
					break;
				case Tool.Eraser:
					EraserTool.move(ctx, px, py, x, y, weight);
					break;
			}
		},
		[ctx]
	);

	const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
		const x = e.nativeEvent.offsetX;
		const y = e.nativeEvent.offsetY;

		if (!drawing || !position || !ctx || !weightSlider.current) {
			setPosition([x, y]);
			return;
		}

		const drawData: DrawData = {
			tool,
			color,
			pressure: e.pressure,
			weight: parseInt(weightSlider.current?.value),
			px: position[0],
			py: position[1],
			x,
			y,
			roomId: ''
		};

		// draw locally
		draw(drawData);
		setPosition([x, y]);
	};

	const handlePointerUp = () => setDrawing(false);
	const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
		setDrawing(true);

		if (!ctx || !weightSlider.current) return;

		const x = e.nativeEvent.offsetX;
		const y = e.nativeEvent.offsetY;
		const pressure = e.pressure;
		const weight = parseInt(weightSlider.current.value);

		switch (tool) {
			case Tool.Eraser:
				EraserTool.move(ctx, x, y, x, y, weight);
				break;

			case Tool.Pen:
				PenTool.move(ctx, color, pressure, weight, x, y, x, y);
				break;

			case Tool.Fill:
				FillTool.down(ctx, x, y, color, window.devicePixelRatio);
				break;
		}
	};

	useEffect(() => {
		if (!ref.current) return;

		const canvas = ref.current;
		const ctx = canvas.getContext('2d')!;
		setCtx(ctx); // async

		canvas.style.height = dimensions.height + 'px';
		canvas.style.width = dimensions.width + 'px';

		const scale = window.devicePixelRatio;
		canvas.width = Math.floor(dimensions.width * scale);
		canvas.height = Math.floor(dimensions.height * scale);
		ctx.scale(scale, scale);
		console.log('Canvas Scale: ' + scale);

		// fill white
		// ctx.imageSmoothingEnabled = true;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// stroke style
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		// global pointer up event so it works outside of canvas
		window.addEventListener('pointerup', handlePointerUp);

		return () => {
			window.removeEventListener('pointerup', handlePointerUp);
		};
	}, [draw]);

	const handleKeyPress = (e: KeyboardEvent) => {
		e.preventDefault();
		if (!ctx) return;

		switch (e.code) {
			case 'KeyB':
				setTool(Tool.Pen);
				break;
			case 'KeyE':
				setTool(Tool.Eraser);
				break;
			case 'Backspace':
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				break;
		}
	};

	// key bindings
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	});

	return (
		<div className="sm:rounded-xl overflow-hidden shadow-xl flex flex-col dark:border border-neutral-700 touch-none">
			<canvas
				ref={ref}
				className="!border-b-0 cursor-cell bg-white"
				onPointerMove={(e) => handlePointerMove(e)}
				onPointerDown={(e) => handlePointerDown(e)}
				// onBlur={(e) => setDrawing(false)}
				// onKeyDown={(e) => handleKeyDown(e)}
			/>
			<div className="z-50 flex flex-col bg-neutral-100 dark:bg-neutral-800">
				<div className="py-3 flex flex-col sm:flex-row gap-4 items-center justify-evenly">
					<Palette setColor={(col) => setColor(col)} />
					<List<Icon>
						items={tools}
						render={(Tool, i) => (
							<IconButton onClick={() => setTool(i)} active={tool === i}>
								<Tool size={30} weight="duotone" />
							</IconButton>
						)}
						className="flex gap-2"
					/>
				</div>
				<div className="p-4 w-full">
					<input
						type="range"
						step={10}
						max={200}
						min={10}
						defaultValue={20}
						ref={weightSlider}
					/>
				</div>
			</div>
		</div>
	);
}
