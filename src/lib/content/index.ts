export interface SimpleSlideData {
    title: string;
    aspects: string[];
}

export interface TitleSlideData {
    title: string;
    subtitle?: string;
}

export type Stage = (
    ({
        type: "simple";
    } & SimpleSlideData) |
    ({
        type: "title";
    } & TitleSlideData) |
    {
        id: string;
        stage_duration: number;
        component: (substage_index: number) => JSX.Element;
        type: "custom";
    }
)

export const stages: Stage[] = [
    {
        title: "The Aspects of Programming languages",
        type: "title"
    },
    {
        title: "Introduction",
        aspects: ["What is a computer?", "What is a computer program?", "What is a programming language?"],
        type: "simple"
    },
    {
        title: "Variables",
        aspects: ["What is a variable?", "How do I declare a variable?", "How do I assign a value to a variable?"],
        type: "simple"
    },
]
