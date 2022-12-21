import { SimpleSlideData, Stage, TitleSlideData, stages } from "./content";
import { DefaultSlide, TitleSlide } from "./slides";
import { range } from "functional-utilities";

interface Slide<T> {
    id: string;
    component: (props: T) => JSX.Element;
    props: T;
}

type EmptyObject = Record<string, never>;

function process_stage<T extends Stage>(index: number, stage: T): Slide<T extends { type: "simple" } ? SimpleSlideData : (T extends { type: "title" } ? TitleSlideData : number)>[] {
    if (stage.type === "simple") {
        const slide = {
            id: stage.title,
            component: DefaultSlide,
            props: stage
        } satisfies Slide<SimpleSlideData>;
        return [slide as any];
    } else if (stage.type === "title") {
        const slide = {
            id: stage.title,
            component: TitleSlide,
            props: stage
        } satisfies Slide<TitleSlideData>;
        return [slide as any];
    } else {
        const slides = range(index, stage.stage_duration + index).map((substage_index) => {
            const slide = {
                id: stage.id,
                component: stage.component,
                props: substage_index
            } satisfies Slide<number>;
            return slide;
        });
        return slides as any[];
    }
}

export function get_slides(): Slide<SimpleSlideData | TitleSlideData | number>[] {
    return stages.reduce((acc, stage) => {
        const next_slides = process_stage(acc.length, stage);
        return acc.concat(next_slides);
    }, [] as Slide<SimpleSlideData | TitleSlideData | number>[]);
}