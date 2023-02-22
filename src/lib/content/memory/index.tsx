import { useEffect, useRef, useState } from 'react';
import { MemoryModelProps, MemorySpan } from './types';
import { MemoryCellLook, calculate_outer_cells, calculate_single_cells } from './cell';
import { AnimatedBlock } from './renderer';

export function MemoryModel(props: MemoryModelProps) {
	const [cells, set_cells] = useState<MemoryCellLook[]>([]);

	useEffect(() => {
		set_cells(calculate_single_cells(props).concat(calculate_outer_cells(props)));
	});

	return (
		<div className="w-full h-full relative">
			{cells.map((cell) => (
				<AnimatedBlock key={cell.span.start} visual_span={props.visual_span} look={cell} />
			))}
		</div>
	);
}
