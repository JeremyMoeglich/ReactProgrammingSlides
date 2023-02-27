import { typed_entries, typed_from_entries } from "functional-utilities";
import { MemoryValue } from "./types";

export type DataTypesRecordValue = {
    size: (value: any) => number | undefined;
    color: string;
    edge_color: string;
    subcell_edge_color: string;
};

export const datatypes = {
    null: {
        size: () => undefined,
        color: '#eeeeff',
        edge_color: '#ddddff',
        subcell_edge_color: '#ccccff'
    },
    int: {
        size: (_) => 8, // 64 bits
        color: '#ddddff',
        edge_color: '#ccccff',
        subcell_edge_color: '#bbbbff'
    },
    pointer: {
        size: (_) => 8, // 64 bits
        color: '#e6e6ff',
        edge_color: '#d6d6ff',
        subcell_edge_color: '#c6c6ff'
    },
    string: {
        size: (value: string) => value.length, // 1 byte per character
        color: '#ddffdd',
        edge_color: '#ccffcc',
        subcell_edge_color: '#bbffbb'
    },
    float: {
        size: (_) => 8, // 64 bits
        color: '#ffdddd',
        edge_color: '#ffcccc',
        subcell_edge_color: '#ffbbbb'
    },
    boolean: {
        size: (_) => 1, // 1 byte
        color: '#ffffdd',
        edge_color: '#ffffcc',
        subcell_edge_color: '#ffffbb'
    }
} satisfies Record<string, DataTypesRecordValue>;

export type DataType = keyof typeof datatypes;

export function get_size(value: MemoryValue): number {
    switch (value.type) {
        case 'null':
            return value.end_address - value.start_address;
        case 'int':
            return datatypes.int.size(value.value);
        case 'pointer':
            return datatypes.pointer.size(value.value);
        case 'string':
            return datatypes.string.size(value.value);
        case 'float':
            return datatypes.float.size(value.value);
        case 'boolean':
            return datatypes.boolean.size(value.value);
    }
}


export const colors = {
    ...(() => {
        const entries = typed_entries<DataType, DataTypesRecordValue>(datatypes);
        const new_entries = entries.map(
            ([key, value]) => [key, value.color] as [typeof key, typeof value.color]
        );
        return typed_from_entries(new_entries);
    })(),
    overlap: '#ff0000',
    empty: '#f6f6f6',
    default_border: '#000000'
} satisfies Record<DataType | 'overlap' | 'empty' | 'default_border', string>;


export function get_color(type: DataType): {
    color: string;
    edge_color: string;
    subcell_edge_color: string;
} {
    return {
        color: colors[type],
        edge_color: datatypes[type].edge_color,
        subcell_edge_color: datatypes[type].subcell_edge_color
    };
}