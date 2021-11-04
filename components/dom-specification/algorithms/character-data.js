import { getLength } from './node.js';

import symbols from '../../symbols.js';


export default {
	replaceData
}


// https://dom.spec.whatwg.org/#concept-cd-replace
export function replaceData(node, offset, count, data) {
	const length = getLength(node);

	if(offset > length) {
		throw new Error(`DOMException: IndexSizeError. Cannot replace at an index greater than data's length`);
	}

	const newDataStart = node[symbols.data].substring(0, offset) + data;
	const newDataEnd = node[symbols.data].substring(offset + count);

	node[symbols.data] = newDataStart.concat(newDataEnd);
}