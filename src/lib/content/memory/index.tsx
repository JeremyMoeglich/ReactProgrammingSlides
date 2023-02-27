import { useEffect, useRef, useState } from 'react';
import { MemoryModelProps, MemorySpan } from './types';
import { MemoryCellLook, calculate_outer_cells, calculate_single_cells } from './cell';
import { AnimatedBlock } from './renderer';

export function MemoryModel(props: MemoryModelProps) {
	const [cells, set_cells] = useState<MemoryCellLook[]>([]);
	const [previous_visual_span, set_previous_visual_span] = useState<MemorySpan>(props.visual_span);
	const [current_visual_span, set_current_visual_span] = useState<MemorySpan>(props.visual_span);

	useEffect(() => {
		set_cells(calculate_single_cells(props).concat(calculate_outer_cells(props)));
		set_previous_visual_span(current_visual_span);
		set_current_visual_span(props.visual_span);
	}, [props]);

	return (
		<div className="w-full h-full relative">
			{cells.map((cell) => (
				<AnimatedBlock
					key={cell.id}
					visual_span={props.visual_span}
					look={cell}
					previous_visual_span={previous_visual_span}
				/>
			))}
		</div>
	);
}
