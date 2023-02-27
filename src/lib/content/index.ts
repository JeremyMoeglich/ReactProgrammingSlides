import { MemoryStage } from './memory/memory_stage';
import { Stage } from '../stage_types';


export const stages: Stage[] = [
	{
		title: 'Abstraktion bei Programmiersprachen',
		type: 'title'
	},
	{
		title: 'Introduction',
		aspects: [
			'What is a computer?',
			'What is a computer program?',
			'What is a programming language?'
		],
		type: 'simple'
	},
	{
		title: 'Variables',
		aspects: [
			'What is a variable?',
			'How do I declare a variable?',
			'How do I assign a value to a variable?'
		],
		type: 'simple'
	},
	MemoryStage([
		{
			visual_span: {
				start: 0,
				end: 30
			},
			config: {},
			values: [
				{
					type: 'int',
					start_address: 3,
					value: 5
				},
				{
					type: 'string',
					start_address: 9,
					value: 'Hello'
				},
				{
					type: 'null',
					start_address: 15,
					end_address: 20
				}
			]
		},
		{
			visual_span: {
				start: 15,
				end: 40
			},
			config: {},
			values: [
				{
					type: 'int',
					start_address: 3,
					value: 5
				},
				{
					type: 'string',
					start_address: 9,
					value: 'Hello'
				},
				{
					type: 'null',
					start_address: 15,
					end_address: 20
				}
			]
		},
		{
			visual_span: {
				start: 10,
				end: 30
			},
			config: {},
			values: [
				{
					type: 'float',
					start_address: 12,
					value: 3.14
				},
				{
					type: 'string',
					start_address: 18,
					value: 'World'
				},
				{
					type: 'boolean',
					start_address: 24,
					value: true
				}
			]
		},
		{
			visual_span: {
				start: 20,
				end: 40
			},
			config: {},
			values: [
				{
					type: 'boolean',
					start_address: 27,
					value: false
				},
				{
					type: 'string',
					start_address: 31,
					value: 'Test'
				}
			]
		},
		{
			visual_span: {
				start: 30,
				end: 50
			},
			config: {},
			values: [
				{
					type: 'int',
					start_address: 41,
					value: 100
				},
				{
					type: 'float',
					start_address: 45,
					value: 2.71828
				}
			]
		},
		{
			visual_span: {
				start: 40,
				end: 60
			},
			config: {},
			values: [
				{
					type: 'string',
					start_address: 61,
					value: 'Lorem ipsum dolor sit amet'
				},
				{
					type: 'int',
					start_address: 71,
					value: -10
				},
				{
					type: 'null',
					start_address: 78,
					end_address: 80
				}
			]
		}
	])
];
