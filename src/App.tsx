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
	const setSlideIndex = (index: number) => {
		unchecked_setSlideIndex(Math.max(0, index));
	};
	const slides = get_slides();
	useListenKey('ArrowRight', () => setSlideIndex(slide_index + 1));
	useListenKey('ArrowLeft', () => setSlideIndex(slide_index - 1));
	useListenKey('ArrowUp', () => setSlideIndex(slide_index - 1));
	useListenKey('ArrowDown', () => setSlideIndex(slide_index + 1));

	const slide = slides[slide_index];
	return (
		<div className="App">
			<div className="slide w-full h-full">{slide.component(slide.props)}</div>
		</div>
	);
}

export default FullScreenApp;
