import { range } from 'functional-utilities';
import { MemoryModelProps, MemorySpan, MemoryValue } from './types';
import { colors, datatypes, get_color, get_size } from './datatypes';
import { cloneDeep } from 'lodash-es';

export interface MemoryCellLook {
	// Describes the look of a single memory block
	// most datatypes will consist of multiple blocks
	span: MemorySpan;
	color: string;
	claimed: boolean;
	text: string;
	vertical_border: string;
	horizontal_border: string;
	side_text: string;
	margin: number;
	opacity: number;
	id: string;
}

const empty_border = '#000000';

function address_to_span(address: number): MemorySpan {
	return {
		start: address,
		end: address + 1
	};
}

function pairs<T>(arr: T[]): [T, T][] {
	const pairs: [T, T][] = [];
	for (let i = 0; i < arr.length - 1; i++) {
		pairs.push([arr[i], arr[i + 1]]);
	}
	return pairs;
}

function span_overlap(a: MemorySpan, b: MemorySpan): MemorySpan | undefined {
	if (a.end <= b.start || b.end <= a.start) {
		return undefined;
	}
	return {
		start: Math.max(a.start, b.start),
		end: Math.min(a.end, b.end)
	};
}

function get_value_span(value: MemoryValue): MemorySpan {
	return {
		start: value.start_address,
		end: value.start_address + get_size(value)
	};
}

function sort_spans(spans: MemorySpan[]): MemorySpan[] {
	return cloneDeep(spans).sort((a, b) => a.start - b.start);
}

function simplify_spans(spans: MemorySpan[]): MemorySpan[] {
	const sorted_spans = sort_spans(spans);
	const simplified_spans: MemorySpan[] = [];
	for (const span of sorted_spans) {
		if (simplified_spans.length === 0) {
			simplified_spans.push(span);
			continue;
		}
		const last_span = simplified_spans[simplified_spans.length - 1];
		const overlap = span_overlap(last_span, span);
		if (overlap === undefined) {
			simplified_spans.push(span);
			continue;
		}
		last_span.end = span.end;
	}
	return simplified_spans;
}

function calculate_overlap_spans(
	props: MemoryModelProps,
): MemorySpan[] {
	const sorted_spans = cloneDeep(props.values).sort((a, b) => a.start_address - b.start_address);
	const overlap_spans: MemorySpan[] = pairs(sorted_spans).flatMap(([a, b]) => {
		const overlap = span_overlap(
			get_value_span(a),
			get_value_span(b)
		);
		if (overlap === undefined) {
			return [];
		}
		return [{
			start: overlap.start,
			end: overlap.end
		}]
	});
	return simplify_spans(overlap_spans);
}



export function calculate_single_cells(props: MemoryModelProps): MemoryCellLook[] {
	const base_cells: MemoryCellLook[] = range(
		props.rendered_span.start,
		props.rendered_span.end
	).map((address) => ({
		span: address_to_span(address),
		color: colors.empty,
		claimed: false,
		text: '',
		vertical_border: empty_border,
		horizontal_border: empty_border,
		side_text: render_address(address),
		margin: 3,
		opacity: 1,
		id: `base_cell-${address}`
	}));

	for (const value of props.values) {
		const size = get_size(value);

		for (let i = 0; i < size; i++) {
			const index = value.start_address + i;
			const base_cell_ref = base_cells[index];
			base_cell_ref.color = get_color(value.type).color;
			base_cell_ref.claimed = true;
			base_cell_ref.text = (() => {
				switch (value.type) {
					case 'int':
						return '';
					case 'string':
						return value.value[i];
					case 'pointer':
						return '';
					case 'null':
						return '';
					case 'float':
						return '';
					case 'boolean':
						return '';
				}
			})();
			const edge_color = get_color(value.type).subcell_edge_color;
			base_cell_ref.vertical_border = edge_color;
			base_cell_ref.horizontal_border = edge_color;
			base_cell_ref.margin = 10;

		}
	}
	return base_cells;
}

export function calculate_outer_cells(props: MemoryModelProps): MemoryCellLook[] {
	// These cells wrap around the single cells

	return props.values.map((value) => {
		const size = get_size(value);
		const datatype = datatypes[value.type];
		return {
			span: {
				start: value.start_address,
				end: value.start_address + size
			},
			color: datatype.color,
			claimed: true,
			text: get_outer_text(value),
			vertical_border: datatype.subcell_edge_color,
			horizontal_border: datatype.subcell_edge_color,
			side_text: '',
			margin: 3,
			opacity: 0.5,
			id: `outer-${value.start_address}-${value.start_address + size}`
		};
	}).concat(calculate_overlap_spans(props).map((span) => ({
		span,
		color: colors.overlap,
		claimed: true,
		text: '',
		vertical_border: '#000000',
		horizontal_border: '#000000',
		side_text: '',
		margin: 0,
		opacity: 0.5,
		id: `overlap-${span.start}-${span.end}`
	})));
}

function get_outer_text(value: MemoryValue): string {
	switch (value.type) {
		case 'int':
			return value.value.toString();
		case 'string':
			return ''; // Strings are rendered in the single cells
		case 'pointer':
			return `-> ${render_address(value.value)}`
		case 'null':
			return 'null';
		case 'float':
			return value.value.toString();
		case 'boolean':
			return value.value ? 'true' : 'false';
	}
}

function render_address(address: number): string {
	return `0x${address.toString(16)}`;
}
