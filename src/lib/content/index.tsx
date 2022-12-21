import { MemoryModel, MemoryModelProps } from './memory/model';

export interface SimpleSlideData {
	title: string;
	aspects: string[];
}

export interface TitleSlideData {
	title: string;
	subtitle?: string;
}

export type Stage =
	| ({
			type: 'simple';
	  } & SimpleSlideData)
	| ({
			type: 'title';
	  } & TitleSlideData)
	| {
			id: string;
			stage_duration: number; // how many slides are in this stage
			component: (substage_index: number) => JSX.Element;
			type: 'custom';
	  };

export const stages: Stage[] = [
	{
		title: 'The Aspects of Programming languages',
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
	{
		type: 'custom',
		id: 'memory_test',
		stage_duration: 3,
		component: (substage_index: number) => {
			const data: MemoryModelProps = (
				[
					{
						start_address: 0,
						end_address: 20,
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
							}
						]
					}
				] satisfies MemoryModelProps[]
			)[0];
			return <MemoryModel {...data} />;
		}
	}
];
