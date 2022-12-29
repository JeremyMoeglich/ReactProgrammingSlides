import { useState } from 'react';
import './App.css';
import { useListenKey } from './lib/keypress';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { get_slides } from './lib/slide_data';

function FullScreenApp() {
	const handle = useFullScreenHandle();
	let is_fullscreen = false;
	useListenKey('f', () => {
		if (is_fullscreen) {
			handle.exit();
		} else {
			handle.enter();
		}
		is_fullscreen = !is_fullscreen;
	});
	useListenKey('Escape', () => {
		handle.exit();
		is_fullscreen = false;
	});
	return (
		<FullScreen handle={handle}>
			<App />
		</FullScreen>
	);
}

function App() {
	const [slide_index, unchecked_setSlideIndex] = useState(0);
	const setSlideIndex = (index: number | ((index: number) => number)) => {
		if (typeof index === 'number') {
			unchecked_setSlideIndex(Math.max(0, Math.min(slides.length - 1, index)));
		} else {
			unchecked_setSlideIndex((prev_index) => {
				const new_index = index(prev_index);
				return Math.max(0, Math.min(slides.length - 1, new_index));
			});
		}
	};
	const next_slide = () => {
		setSlideIndex((prev_index) => prev_index + 1)
	};
	const prev_slide = () => {
		setSlideIndex((prev_index) => prev_index - 1)
	};
	const slides = get_slides();
	useListenKey('ArrowRight', next_slide);
	useListenKey('ArrowLeft', prev_slide);
	useListenKey('ArrowUp', prev_slide);
	useListenKey('ArrowDown', next_slide);

	const slide = slides[slide_index];
	return (
		<div className="App">
			<p>
				{slide_index} / {slides.length}
			</p>
			<div className="slide grow relative w-full">{slide.component(slide.props)}</div>
		</div>
	);
}

export default FullScreenApp;
