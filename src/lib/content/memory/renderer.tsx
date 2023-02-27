// This component visualizes the memory of the computer.
// By showing addresses in a vertical column with an address and a 1byte value.
// Values can go across cells.
// Pointers are shown as arrows to the right.
// Addresses are shown as hex values to the left of each cell.
// Cells are aligned vertically

import { useState, useEffect } from 'react';
import { useSpring, animated, SpringConfig } from '@react-spring/web';
import { MemorySpan } from './types';
import { MemoryCellLook } from './cell';

function cell_height(visual_span: MemorySpan) {
	// Calculates the height of a cell in percent
	return 100 / (visual_span.end - visual_span.start);
}

function calculate_percent(span: MemorySpan, start_address: number) {
	// Calculates the percentage of the span that the address is
	// note than values outside the span are supported and will render outside the span
	const p = cell_height(span) * (start_address - span.start);
	return p;
}

function calculate_position(
	visual_span: MemorySpan,
	element_span: MemorySpan
): { top: string; height: string } {
	const top = calculate_percent(visual_span, element_span.start);
	const height = cell_height(visual_span) * (element_span.end - element_span.start);
	return {
		top: top + '%',
		height: height + '%'
	};
}
export function AnimatedBlock(props: {
	previous_visual_span: MemorySpan;
	visual_span: MemorySpan;
	look: MemoryCellLook;
}) {
	// Creates a memory block
	// The block is absolute positioned and is sized to fit the visual span
	// The whole width of the parent is used
	// The vertical position is calculated based on the block span and the visual span

	// look.side_text is shown vertically to the left of the block the size is constant, but the position is animated

	const config = {
		mass: 20,
		tension: 500,
		friction: 180,
		precision: 0.001
	} satisfies SpringConfig;

	const [style, set] = useSpring(() => ({
		...calculate_position(props.previous_visual_span, props.look.span),
		config
	}));

	const [side_style, side_set] = useSpring(() => ({
		...calculate_position(props.previous_visual_span, props.look.span),
		config
	}));

	useEffect(() => {
		set(calculate_position(props.visual_span, props.look.span));
		side_set(calculate_position(props.visual_span, props.look.span));
	}, [props.look.span, props.look.span, props.visual_span]);

	return (
		<>
			<animated.div
				style={{
					...style,
					position: 'absolute',
					width: '100%',
					padding: `${props.look.margin}px`,
					opacity: props.look.opacity
				}}
			>
				<animated.div
					style={{
						width: '100%',
						height: '100%',
						backgroundColor: props.look.color,
						borderRight: '1px solid ' + props.look.horizontal_border,
						borderLeft: '1px solid ' + props.look.horizontal_border,
						borderTop: '1px solid ' + props.look.vertical_border,
						borderBottom: '1px solid ' + props.look.vertical_border
					}}
				></animated.div>
			</animated.div>
			<animated.p
				style={{
					...side_style,
					position: 'absolute',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					width: 'fit-content',
					whiteSpace: 'nowrap',
					left: '0px',
					transform: 'translateX(-100%)',
					padding: '0px 5px'
				}}
			>
				{props.look.side_text}
			</animated.p>
		</>
	);
}
