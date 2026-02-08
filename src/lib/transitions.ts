import { cubicOut } from 'svelte/easing';

export function tvOn(node: HTMLElement, { duration = 250 } = {}) {
	const height = node.offsetHeight;
	return {
		duration,
		easing: cubicOut,
		css: (t: number) => {
			const inset = 50 * (1 - t);
			return `clip-path: inset(${inset}% 0 ${inset}% 0); height: ${t * height}px; overflow: hidden;`;
		}
	};
}
