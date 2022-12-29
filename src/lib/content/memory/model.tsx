// This component visualizes the memory of the computer.
// By showing addresses in a vertical column with an address and a 1byte value.
// Values can go across cells.
// Pointers are shown as arrows to the right.
// Addresses are shown as hex values to the left of each cell.
// Implemented using d3
// Cells are aligned vertically
import * as d3 from 'd3';
import { range, typed_entries, typed_from_entries } from 'functional-utilities';
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

type DataTypesRecordValue = {
	size: (value: any) => number | undefined;
	color: string;
	edge_color: string;
};

const datatypes = {
	null: {
		size: (_) => undefined,
		color: '#eeeeff',
		edge_color: '#ddddff'
	},
	int: {
		size: (_) => 8, // 64 bits
		color: '#ddddff',
		edge_color: '#ccccff'
	},
	pointer: {
		size: (_) => 8, // 64 bits
		color: '#e6e6ff',
		edge_color: '#d6d6ff'
	},
	string: {
		size: (value: string) => value.length, // 1 byte per character
		color: '#ddffdd',
		edge_color: '#ccffcc'
	}
} satisfies Record<string, DataTypesRecordValue>;

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
	text: string;
	top_border_color: string;
	bottom_border_color: string;
}

const colors = {
	...(() => {
		const entries = typed_entries<DataType, DataTypesRecordValue>(datatypes);
		const new_entries = entries.map(
			([key, value]) => [key, value.color] as [typeof key, typeof value.color]
		);
		return typed_from_entries(new_entries);
	})(),
	overlap: '#ffdddd',
	empty: '#f6f6f6',
	default_border: '#000000'
} satisfies Record<DataType | 'overlap' | 'empty' | 'default_border', string>;

function get_cell_data(data: MemoryModelProps): CellData[] {
	const { start_address, end_address, values } = data;
	const cells: CellData[] = range(start_address, end_address).map((address) => ({
		address,
		color: colors.empty,
		claimed: false,
		text: address.toString(16),
		top_border_color: colors.default_border,
		bottom_border_color: colors.default_border
	}));
	for (const value of values) {
		if (value.type === 'bracket') {
			continue;
		}
		const end_address =
			'end_address' in value
				? value.end_address
				: value.type === 'string'
				? datatypes.string.size(value.value)
				: datatypes[value.type].size(value.value);
		for (const address of range(value.start_address, end_address)) {
			const is_start = address === value.start_address;
			const is_end = address === end_address - 1;
			const cell = cells[address - start_address];
			if (cell.claimed) {
				cell.color = colors.overlap;
			} else {
				cell.claimed = true;
				cell.color = colors[value.type];
				if ('value' in value) {
					cell.text = value.value.toString();
				}
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
		const cell_width = 50; // in px
		const cell_height = 100 / cells.length; // in percent

		const get_y = (i: number) => i * cell_height;
		const g = svg
			.selectAll('g')
			.data(cells, ((c: CellData) => c.address) as (d: any) => any)
			.join(
				(enter) => enter.append('g'),
				(update) => update,
				(exit) => exit.remove()
			);

		g.append('rect')
			.attr('width', cell_width)
			.attr('height', cell_height)
			.attr('fill', (d) => d.color)
			.attr('stroke', 'black')
			.attr('stroke-width', 0.5)
			.attr('y', (_, i) => get_y(i))
			.attr('x', 0);

		{
			const font_size = cell_height * 0.8;
			const text = g
				.append('text')
				.text((d) => d.text)
				.attr('y', (_, i) => get_y(i) + cell_height / 2)
				.attr('x', cell_width / 2)
				.style('dominant-baseline', 'central')
				.style('text-anchor', 'middle');

			if (cell_height < 3) {
				text.style('display', 'none');
			} else {
				text.attr('font-size', font_size);
			}
		}
	}, [cells, config.hide_addresses, config.hide_arrows]);
	return <svg className="absolute top-0 left-0 w-full h-full" ref={ref} viewBox={`0 0 50 100`} />;
};
