import { error } from 'functional-utilities';
import { MemoryModel } from '.';
import { Stage } from '../../stage_types';
import { MemoryModelProps } from './types';

export type MemoryStage = Omit<MemoryModelProps, 'rendered_span'>;

function calculate_rendered_memory_span(slides: MemoryStage[]): MemoryModelProps[] {
	// Calculates the span that all the slides will be rendered in
	// The span is the smallest span that contains all the cells
	const min_start = Math.min(...slides.map((slide) => slide.visual_span.start));
	const max_end = Math.max(...slides.map((slide) => slide.visual_span.end));
	return slides.map((slide) => ({
		...slide,
		rendered_span: {
			start: min_start,
			end: max_end
		}
	}));
}

export function MemoryStage(slides: MemoryStage[]): Stage {
	const slides_with_rendered_span = calculate_rendered_memory_span(slides);
	return {
		type: 'custom',
		id: 'memory_test',
		stage_duration: slides.length,
		component: (substage_index: number) => {
			return (
				<div className="w-64 h-full">
					<MemoryModel
						{...(slides_with_rendered_span[substage_index] ??
							error(`Out of bound substage - ${substage_index}`))}
					/>
				</div>
			);
		}
	};
}
