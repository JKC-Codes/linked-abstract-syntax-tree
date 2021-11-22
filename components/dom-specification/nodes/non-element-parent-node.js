// https://dom.spec.whatwg.org/#interface-nonelementparentnode

import { walkDescendants } from '../algorithms/tree.js';

import symbols from '../../symbols.js';


export default {
	getElementById
}


export function getElementById(elementId) {
	for(const descendant of walkDescendants(this)) {
		if(descendant[symbols.attributes].has('id')) {
			const descendantId = descendant[symbols.attributes].get('id')[symbols.value];

			if(descendantId === elementId) {
				return descendant;
			}
		}
	}

	return null;
}