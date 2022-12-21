import { SimpleSlideData, TitleSlideData } from './content';

export const DefaultSlide = (props: SimpleSlideData) => {
	return (
		<div>
			<h1>{props.title}</h1>
			<ul>
				{props.aspects.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>
	);
};

export const TitleSlide = (props: TitleSlideData) => {
	return (
		<div>
			<h1>{props.title}</h1>
			{props.subtitle && <h2>{props.subtitle}</h2>}
		</div>
	);
};
