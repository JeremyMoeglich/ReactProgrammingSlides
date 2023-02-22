import { range } from 'functional-utilities';
import { MemoryModelProps, MemorySpan, MemoryValue } from './types';
import { datatypes, get_color, get_size } from './datatypes';

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
}

const empty_color = '#f6f6f6';
const empty_border = '#000000';

function address_to_span(address: number): MemorySpan {
	return {
		start: address,
		end: address + 1
	};
}

export function calculate_single_cells(props: MemoryModelProps): MemoryCellLook[] {
	const single_cells: MemoryCellLook[] = range(
		props.rendered_span.start,
		props.rendered_span.end
	).map((address) => ({
		span: address_to_span(address),
		color: empty_color,
		claimed: false,
		text: '',
		vertical_border: empty_border,
		horizontal_border: empty_border,
		side_text: '',
		margin: 3
	}));
	for (const value of props.values) {
		const size = get_size(value);

		for (let i = 0; i < size; i++) {
			single_cells[i + value.start_address] = {
				span: address_to_span(value.start_address + i),
				color: get_color(value.type).color,
				claimed: true,
				text: (() => {
					switch (value.type) {
						case 'int':
							return '';
						case 'string':
							return value.value[i];
						case 'pointer':
							return '';
						case 'null':
							return '';
					}
				})(),
				vertical_border: get_color(value.type).subcell_edge_color,
				horizontal_border: get_color(value.type).subcell_edge_color,
				side_text: render_address(value.start_address + i),
				margin: 10
			};
		}
	}
	return single_cells;
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
			side_text: render_address(value.start_address),
			margin: 3
		};
	});
}

function get_outer_text(value: MemoryValue): string {
	switch (value.type) {
		case 'int':
			return value.value.toString();
		case 'string':
			return ''; // Strings are rendered in the single cells
		case 'pointer':
			return render_address(value.value);
		case 'null':
			return 'null';
	}
}

function render_address(address: number): string {
	return `0x${address.toString(16)}`;
}
