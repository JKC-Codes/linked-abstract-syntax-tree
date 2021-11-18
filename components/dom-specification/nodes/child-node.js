// https://dom.spec.whatwg.org/#interface-childnode

import { convertNodesIntoANode } from '../algorithms/node.js';
import { preInsert, remove as nodeRemove, replace } from '../algorithms/mutation.js';
import { walkFollowingSiblings, walkPrecedingSiblings } from '../algorithms/tree.js';

import symbols from '../../symbols.js';


export default {
	after,
	before,
	remove,
	replaceWith
}


export function after(nodes) {
	const parent = this[symbols.parent];

	if(parent === null) {
		return;
	}
	else {
		let viableNextSibling = null;

		for(const sibling of walkFollowingSiblings(this)) {
			if(!nodes.includes(sibling)) {
				viableNextSibling = sibling;
				break;
			}
		}

		const node = convertNodesIntoANode(nodes, this[symbols.nodeDocument]);

		preInsert(node, parent, viableNextSibling);
	}
}

export function before(nodes) {
	const parent = this[symbols.parent];

	if(parent === null) {
		return;
	}
	else {
		let viablePreviousSibling = null;

		for(const sibling of walkPrecedingSiblings(this)) {
			if(!nodes.includes(sibling)) {
				viablePreviousSibling = sibling;
				break;
			}
		}

		const node = convertNodesIntoANode(nodes, this[symbols.nodeDocument]);

		preInsert(node, parent, viablePreviousSibling);
	}
}

export function remove() {
	if(this[symbols.parent] === null) {
		return;
	}
	else {
		nodeRemove(this);
	}
}

export function replaceWith(nodes) {
	const parent = this[symbols.parent];

	if(parent === null) {
		return;
	}
	else {
		let viableNextSibling = null;

		for(const sibling of walkFollowingSiblings(this)) {
			if(!nodes.includes(sibling)) {
				viableNextSibling = sibling;
				break;
			}
		}

		const node = convertNodesIntoANode(nodes, this[symbols.nodeDocument]);

		if(this[symbols.parent] === parent) {
			replace(this, node, parent);
		}
		else {
			preInsert(node, parent, viableNextSibling);
		}
	}
}