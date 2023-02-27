import { animated, useSprings } from '@react-spring/web';
import { transition_duration } from '../vars';

interface ReplaceableProps<Props> {
	component: React.ComponentType<Props>;
	props: Props;
	key: string;
	out_side?: 'left' | 'right' | 'top' | 'bottom';
}

// This is a component replaces the existing component by moving it out of the screen
// and moving in the new component. This is done by using the react-spring
export const Replaceable = <Props extends {}>(props: ReplaceableProps<Props>) => {
	const springs = useSprings(2, [
		{
			from: {
				opacity: 1,
				transform: 'translate3d(0, 0, 0)'
			},
			to: {
				opacity: 0,
				transform: `translate3d(${
					props.out_side === 'left'
						? '-100%'
						: props.out_side === 'right'
						? '100%'
						: props.out_side === 'top'
						? '0, -100%'
						: '0, 100%'
				}, 0)`
			},
			config: {
				duration: transition_duration * 1000
			}
		},
		{
			from: {
				opacity: 0,
				transform: `translate3d(${
					props.out_side === 'left'
						? '100%'
						: props.out_side === 'right'
						? '-100%'
						: props.out_side === 'top'
						? '0, 100%'
						: '0, -100%'
				}, 0)`
			},
			to: {
				opacity: 1,
				transform: 'translate3d(0, 0, 0)'
			},
			config: {
				duration: transition_duration * 1000
			}
		}
	]);

	return (
		<div className="flex flex-col gap-4 items-center">
			{springs.map((spring, index) => (
				<animated.div style={spring} key={index}>
					{index === 1 && <props.component {...props.props} />}
				</animated.div>
			))}
		</div>
	);
};
