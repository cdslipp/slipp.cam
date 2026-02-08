import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return { section: params.section ?? null };
};
