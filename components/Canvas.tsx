import { useEffect, useRef, useState, PointerEvent, useCallback } from 'react';
import { setColor } from '../lib/tools/color';
import useCanvas, { DrawData, Tool } from '../lib/useCanvas';
import Toolbar from './Toolbar';

export default function Canvas() {
	const { canvasRef, tool, setColor, setOpacity, setTool, setWeight } =
		useCanvas(960, 540);
	// const [tool, setTool] = useState<Tool>(Tool.Pen);

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
		// Event subscriptions
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	return (
		<>
			<canvas
				ref={canvasRef}
				className="bg-white rounded-lg shadow-lg touch-none"
			/>
			<Toolbar
				setColor={setColor}
				setOpacity={setOpacity}
				setWeight={setWeight}
				setTool={setTool}
				activeTool={tool}
			/>
		</>
	);
}
