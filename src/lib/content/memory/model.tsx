// This component visualizes the memory of the computer.
// By showing addresses in a vertical column with an address and a 1byte value.
// Values can go across cells.
// Pointers are shown as arrows to the right.
// Addresses are shown as hex values to the left of each cell.
// Implemented using d3
// Cells are aligned vertically
import * as d3 from 'd3';
import { range } from 'functional-utilities';
import { useEffect, useRef, useState } from 'react';

export interface MemoryModelProps {
	start_address: number;
	end_address: number;
	values: MemoryValue[];
	config: MemoryModelConfig;
}

export interface MemoryModelConfig {
	hide_arrows?: boolean;
	hide_addresses?: boolean;
	mark_overlapping_values?: boolean;
}

const datatypes = {
	int: {
		size: (_) => 8, // 64 bits
		color: '#ddddff'
	},
	pointer: {
		size: (_) => 8, // 64 bits
		color: '#e6e6ff'
	},
	string: {
		size: (value: string) => value.length, // 1 byte per character
		color: '#ddffdd'
	},
	null: {
		size: (_) => undefined,
		color: '#eeeeff'
	}
} satisfies Record<string, { size: (value: any) => number | undefined; color: string }>;

type DataType = keyof typeof datatypes;

export type MemoryValue = {
	start_address: number;
} & (
	| {
			value: number;
			type: 'int';
	  }
	| {
			value: number;
			type: 'pointer';
	  }
	| {
			value: string;
			type: 'string';
	  }
	| {
			type: 'bracket';
			order: number;
			text: string;
	  }
	| {
			type: 'null';
			end_address: number;
	  }
);

interface CellData {
	address: number;
	color: string;
	claimed: boolean;
}

const colors = {
	int: '#ddddff',
	pointer: '#e6e6ff',
	string: '#ddffdd',
	overlap: '#ffdddd',
	empty: '#f6f6f6',
	null: '#eeeeff'
} satisfies Record<DataType | 'overlap' | 'empty', string>;

function get_cell_data(data: MemoryModelProps): CellData[] {
	const { start_address, end_address, values } = data;
	const cells: CellData[] = range(start_address, end_address).map((address) => ({
		address,
		color: colors.empty,
		claimed: false
	}));
	for (const value of values) {
		if (value.type === 'bracket') {
			continue;
		}
		for (const address of range(
			value.start_address,
			'end_address' in value
				? value.end_address
				: value.type === 'string'
				? datatypes.string.size(value.value)
				: datatypes[value.type].size(value.value)
		)) {
			const cell = cells[address - start_address];
			if (cell.claimed) {
				cell.color = colors.overlap;
			} else {
				cell.claimed = true;
				cell.color = colors[value.type];
			}
		}
	}
	return cells;
}

export const MemoryModel = (props: MemoryModelProps) => {
	const { start_address, end_address, values, config } = props;

	const cells = get_cell_data(props);
	const ref = useRef<SVGSVGElement>(null);
	useEffect(() => {
		const svg = d3.select(ref.current);
		const cell_width = 50;
		const cell_height = 100 / cells.length; // in percent
		const cell_padding = 1;
		const cell = svg
			.selectAll('g')
			.data(cells)
			.join('g')
			.attr('transform', (d, i) => `translate(0, ${i * cell_height}%)`)
			.attr('width', cell_width)
			.attr('height', cell_height);
		cell
			.append('rect')
			.attr('width', cell_width)
			.attr('height', cell_height - cell_padding)
			.attr('fill', (d) => d.color);
		if (!config.hide_addresses) {
			cell
				.append('text')
				.attr('x', 0)
				.attr('y', cell_height / 2)
				.attr('dominant-baseline', 'middle')
				.attr('text-anchor', 'end')
				.text((d) => d.address.toString(16));
		}
		if (!config.hide_arrows) {
			cell
				.filter((d) => d.color === colors.pointer)
				.append('path')
				.attr(
					'd',
					`M${cell_width} ${cell_height / 2} l${cell_width / 2} 0 l0 ${cell_height / 2} l${
						cell_width / 2
					} 0`
				)
				.attr('stroke', 'black')
				.attr('fill', 'none');
		}
		cell
			.filter((d) => d.color === colors.overlap)
			.append('text')
			.attr('x', cell_width / 2)
			.attr('y', cell_height / 2)
			.attr('dominant-baseline', 'middle')
			.attr('text-anchor', 'middle')
			.text('overlap');
	}, [cells, config.hide_addresses, config.hide_arrows]);
	return (
		<svg ref={ref} width={50} height={100} viewBox={`0 0 50 100`} preserveAspectRatio="none" />
	);
};
