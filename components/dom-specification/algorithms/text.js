import { walkDescendants, walkFollowingSiblings } from './tree.js';

import symbols from '../../symbols.js';


export default {
	getDescendantTextContent,
	walkContiguousTextNodes,
	walkContiguousExclusiveTextNodes
}


// https://dom.spec.whatwg.org/#concept-descendant-text-content
export function getDescendantTextContent(node) {
	const descendantTextContent = '';

	for(const descendant of walkDescendants(node)) {
		if(descendant[symbols.interfaces].has('Text')) {
			descendantTextContent = descendantTextContent.concat(descendant[symbols.data]);
		}
	}

	return descendantTextContent;
}

// https://dom.spec.whatwg.org/#contiguous-text-nodes
export function* walkContiguousTextNodes(node) {
	for(const sibling of walkFollowingSiblings(node)) {
		if(sibling[symbols.interfaces].has('Text')) {
			yield sibling;
		}
	}
}

// https://dom.spec.whatwg.org/#contiguous-exclusive-text-nodes
export function* walkContiguousExclusiveTextNodes(node) {
	for(const textNode of walkContiguousTextNodes(node)) {
		if(!textNode[symbols.interfaces].has('CDATASection')) {
			yield sibling;
		}
	}
}