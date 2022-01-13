import { useRouter } from 'next/router';
import Canvas from '../components/Canvas';

export default function RoomPage() {
	const router = useRouter();

	return (
		<div>
			<div className="h-screen flex items-center">
				<Canvas />
			</div>
		</div>
	);
}
