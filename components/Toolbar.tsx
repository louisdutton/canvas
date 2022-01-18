import Palette from './Palette';
import List from './List';
import IconButton from './IconButton';
import { PenTool, EraserTool, FillTool } from '../lib/tools';
import { Tool } from '../lib/useCanvas';
// import { Pen, Eraser, PaintBucket, Rectangle, IconProps } from 'phosphor-react';
import { TiPen, TiBrush, TiPipette } from 'react-icons/ti';
import { BiEraser, BiDroplet } from 'react-icons/bi';
import { IconType } from 'react-icons';

interface Props {
	activeTool: Tool;
	setTool: (tool: Tool) => void;
	setWeight: (value: number) => void;
	setColor: (value: string) => void;
	setOpacity: (value: number) => void;
}

const Toolbar = ({
	setTool,
	setWeight,
	setColor,
	setOpacity,
	activeTool
}: Props) => {
	// const [tool, setTool] = useState<Tool>(Tool.Pen);
	const toolIcons = [TiPen, BiEraser, BiDroplet, TiPipette];

	return (
		<div className="z-50 bg-neutral-100 dark:bg-neutral-800 absolute bottom-0 left-0 w-screen">
			<div className="py-3 flex sm:flex-row gap-4 items-center justify-evenly">
				<Palette setColor={(col) => setColor(col)} />
				<List<IconType>
					items={toolIcons}
					render={(Tool, i) => (
						<IconButton onClick={() => setTool(i)} active={activeTool === i}>
							<Tool size={24} />
						</IconButton>
					)}
					className="flex gap-2"
				/>
				<input
					type="range"
					step={10}
					max={200}
					min={10}
					defaultValue={20}
					onChange={(e) => setWeight(parseInt(e.target.value))}
				/>
				<input
					type="range"
					step={0.1}
					max={1}
					min={0}
					defaultValue={1}
					onChange={(e) => setOpacity(parseFloat(e.target.value))}
				/>
			</div>
		</div>
	);
};

export default Toolbar;
