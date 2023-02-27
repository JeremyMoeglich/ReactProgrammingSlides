import { stages } from "./content";
import { Stage, stage_to_base_stage } from "./stage_types";
import { range } from "functional-utilities";

interface Slide {
    id: string;
    component: () => JSX.Element;
}

function stage_to_slides(stage: Stage): Slide[] {
    const base_stage = stage_to_base_stage(stage);
    return range(0, base_stage.stage_duration).map((i) => {
        const slide_id = `${base_stage.id}_${i}`;
        return { id: slide_id, component: () => base_stage.component(i) };
    });
}

export function get_slides(): Slide[] {
    return stages.flatMap(stage_to_slides);
}