import { animated } from '@react-spring/web'

interface SlideProps {
    title: string;
    text: string;
    type: 'default_slide'
}

export const Slide = (props: SlideProps) => {
    return (
        <div>
            <h1>{props.title}</h1>
            <p>{props.text}</p>
        </div>
    );
};