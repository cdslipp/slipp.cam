import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return ['theatre', 'collaborators', 'software', 'stuff-i-use', 'links'].includes(param);
};
