import { useEffect, useRef, useState, PointerEvent, useCallback } from 'react';
import Palette from './Palette';
import List from './List';
import IconButton from './IconButton';
import { PenTool, EraserTool, FillTool } from '../lib/tools';
import { DrawData, Tool } from '../lib/ink';
import { Pen, Eraser, PaintBucket, Rectangle, IconProps } from 'phosphor-react';
import History from '../lib/history';

type Icon = React.ForwardRefExoticComponent<
	IconProps & React.RefAttributes<SVGSVGElement>
>;

const history = new History();

export default function Canvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	const [tool, setTool] = useState<Tool>(Tool.Pen);
	const toolIcons = [Pen, Eraser, PaintBucket];
	const weightSlider = useRef<HTMLInputElement>(null);
	const opacitySlider = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!ref.current) return;
	}, [ref.current]);

	const keyBindings: Record<string, () => void> = {
		KeyD: () => setTool(Tool.Pen),
		KeyE: () => setTool(Tool.Eraser),
		KeyF: () => setTool(Tool.Fill)
	};

	const handleKeyPress = (e: KeyboardEvent) => {
		// e.preventDefault();
		const binding = keyBindings[e.code];
		if (binding) binding();
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
				className="bg-white"
				onPointerMove={(e) => handlePointerMove(e)}
				onPointerDown={(e) => handlePointerDown(e)}
				onBlur={(e) => handlePointerUp()}
				// onKeyDown={(e) => handleKeyDown(e)}
			/>
			<div className="z-50 flex flex-col bg-neutral-100 dark:bg-neutral-800">
				<div className="py-3 flex flex-col sm:flex-row gap-4 items-center justify-evenly">
					<Palette setColor={(col) => setColor(col)} />
					<List<Icon>
						items={toolIcons}
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
					<input
						type="range"
						step={0.1}
						max={1}
						min={0}
						defaultValue={1}
						ref={opacitySlider}
					/>
				</div>
			</div>
		</div>
	);
}
