
export interface MemorySpan {
    // Describes what part of the memory is shown
    start: number;
    end: number;
}


export interface MemoryModelProps {
    visual_span: MemorySpan;
    rendered_span: MemorySpan;
    values: MemoryValue[];
    config: MemoryModelConfig;
}

export interface MemoryModelConfig {
    hide_arrows?: boolean;
    hide_addresses?: boolean;
    mark_overlapping_values?: boolean;
}


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
            type: 'null';
            end_address: number;
        }
        | {
            type: 'float';
            value: number;
        }
        | {
            type: 'boolean';
            value: boolean;
        }
    );
