// This component visualizes the memory of the computer.
// By showing addresses in a vertical column with an address and a 1byte value.
// Values can go across cells.
// Pointers are shown as arrows to the right.
// Addresses are shown as hex values to the left of each cell.
// Implemented using d3
// Cells are aligned vertically
import * as d3 from "d3";
import { range } from "functional-utilities";
import { useEffect, useRef, useState } from "react";

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

type DataType = 'int' | 'pointer' | 'string' | 'null';

export type MemoryValue = {
	start_address: number;
	end_address: number;
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
      }
)

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
} satisfies Record<DataType | "overlap" | 'empty', string>

function get_cell_data(data: MemoryModelProps): CellData[] {
    const { start_address, end_address, values } = data;
    const cells: CellData[] = range(start_address, end_address).map((address) => ({
        address,
        color: colors.empty,
        claimed: false,
    }));
    for (const value of values) {
        if (value.type === 'bracket') {
            continue;
        }
        for (const address of range(value.start_address, value.end_address)) {
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
        d3.select(ref.current).selectAll('*').remove();




    