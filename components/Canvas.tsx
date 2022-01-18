import { useEffect, useRef, useState, PointerEvent, useCallback } from 'react';
import useCanvas, { DrawData, Tool } from '../lib/useCanvas';
import Toolbar from './Toolbar';

export default function Canvas() {
	const ref = useCanvas(960, 540);
	// const [tool, setTool] = useState<Tool>(Tool.Pen);

	// const keyBindings: Record<string, () => void> = {
	// 	KeyD: () => setTool(Tool.Pen),
	// 	KeyE: () => setTool(Tool.Eraser),
	// 	KeyF: () => setTool(Tool.Fill)
	// };

	// const handleKeyPress = (e: KeyboardEvent) => {
	// 	// e.preventDefault();
	// 	const binding = keyBindings[e.code];
	// 	if (binding) binding();
	// };

	// key bindings
	// useEffect(() => {
	// 	if (!ref.current) return;

	// 	const canvas = document.createElement('canvas');
	// 	// console.log(ink);

	// 	ref.current.replaceWith(canvas);
	// 	// Event subscriptions
	// 	window.addEventListener('keydown', handleKeyPress);

	// 	return () => {
	// 		window.removeEventListener('keydown', handleKeyPress);
	// 	};
	// }, []);

	return (
		<>
			<canvas ref={ref} className="bg-white rounded-lg shadow-lg" />
			{/* <Toolbar
				setColor={(value) => (ink.color = value)}
				setOpacity={(value) => (ink.opacity = value)}
				setWeight={(value) => (ink.weight = value)}
				setTool={setTool}
				activeTool={tool}
			/> */}
		</>
	);
}
