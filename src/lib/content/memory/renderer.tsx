// This component visualizes the memory of the computer.
// By showing addresses in a vertical column with an address and a 1byte value.
// Values can go across cells.
// Pointers are shown as arrows to the right.
// Addresses are shown as hex values to the left of each cell.
// Cells are aligned vertically

import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { MemorySpan } from './types';
import { MemoryCellLook } from './cell';

function calculate_percent(span: MemorySpan, address: number) {
	// Calculates the percentage of the span that the address is
	// note than values outside the span are supported and will render outside the span
	return ((address - span.start) / (span.end - span.start)) * 100;
}

export function AnimatedBlock(props: { visual_span: MemorySpan; look: MemoryCellLook }) {
	// Creates a memory block
	// The block is absolute positioned and is sized to fit the visual span
	// The whole width of the parent is used
	// The vertical position is calculated based on the block span and the visual span

	// look.side_text is shown vertically to the left of the block the size is constant, but the position is animated

	const [style, set] = useSpring(() => ({
		top: calculate_percent(props.visual_span, props.look.span.start) + '%',
		height: calculate_percent(props.visual_span, props.look.span.end - props.look.span.start) + '%'
	}));

	const [side_style, side_set] = useSpring(() => ({
		top: calculate_percent(props.visual_span, props.look.span.start) + '%',
		height: calculate_percent(props.visual_span, props.look.span.end - props.look.span.start) + '%'
	}));

	useEffect(() => {
		set({
			top: calculate_percent(props.visual_span, props.look.span.start) + '%',
			height:
				calculate_percent(props.visual_span, props.look.span.end - props.look.span.start) + '%'
		});
		side_set({
			top: calculate_percent(props.visual_span, props.look.span.start) + '%',
			height:
				calculate_percent(props.visual_span, props.look.span.end - props.look.span.start) + '%'
		});
	}, [props.look.span, props.visual_span, set]);

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
					width: '1em',
					transform: 'rotate(-90deg)',
					transformOrigin: 'top left',
					whiteSpace: 'nowrap'
				}}
			>
				{props.look.side_text}
			</animated.p>
		</>
	);
}
