import { DefaultSlide, TitleSlide } from './slides';

export interface SimpleSlideData {
	title: string;
	aspects: string[];
}

export interface TitleSlideData {
	title: string;
	subtitle?: string;
}

export type BaseStage = {
	id: string;
	stage_duration: number; // how many slides are in this stage
	component: (substage_index: number) => JSX.Element;
};

const stage_types = {
	simple: (data: SimpleSlideData): BaseStage => ({
		id: `simple_${data.title}`,
		stage_duration: 1,
		component: () => DefaultSlide(data)
	}),
	title: (data: TitleSlideData): BaseStage => ({
		id: `title_${data.title}`,
		stage_duration: 1,
		component: () => TitleSlide(data)
	}),
	custom: (data: BaseStage): BaseStage => ({
		id: `custom_${data.id}`,
		stage_duration: data.stage_duration,
		component: data.component
	})
} satisfies Record<string, (data: any) => BaseStage>;

export type StageParameterObj = {
	[key in keyof typeof stage_types]: Parameters<typeof stage_types[key]>[0];
};

export type Stage = {
	[K in keyof StageParameterObj]: {
		type: K;
	} & StageParameterObj[K];
}[keyof StageParameterObj];

export function stage_to_base_stage(stage: Stage): BaseStage {
	const func = stage_types[stage.type];
	return func(stage as any);
}
