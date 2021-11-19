// https://dom.spec.whatwg.org/#interface-nondocumenttypechildnode

import { walkFollowingSiblings, walkPrecedingSiblings } from '../algorithms/tree.js';

import symbols from '../../symbols.js';


export default {
	nextElementSibling,
	previousElementSibling
}


export function nextElementSibling() {
	for(const sibling of walkFollowingSiblings(this)) {
		if(sibling[symbols.interfaces].has('Element')) {
			return sibling;
		}
	}

	return null;
}

export function previousElementSibling() {
	for(const sibling of walkPrecedingSiblings(this)) {
		if(sibling[symbols.interfaces].has('Element')) {
			return sibling;
		}
	}

	return null;
}