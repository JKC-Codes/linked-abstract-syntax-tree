import NodeFilter from '../traversal/node-filter.js';

import symbols from '../../symbols.js';


export default {
	filter,
	traverseChildren,
	traverseSiblings
}


// https://dom.spec.whatwg.org/#concept-node-filter
export function filter(node, traverser) {
	if(traverser[symbols.isActive] === true) {
		throw new Error(`DOMException: InvalidStateError`);
	}

	const n = node.nodeType - 1;
	if(((1 << n) & traverser[symbols.whatToShow]) === 0) {
		return NodeFilter.FILTER_SKIP;
	}

	if(traverser[symbols.filter] === null) {
		return NodeFilter.FILTER_ACCEPT;
	}

	traverser[symbols.isActive] = true;

	let result;
	try {
		result = traverser[symbols.filter].acceptNode(node);
	}
	catch(err) {
		traverser[symbols.isActive] = false;
		throw err;
	}

	traverser[symbols.isActive] = false;

	return result;
}

// https://dom.spec.whatwg.org/#concept-traverse-children
export function traverseChildren(walker, type) {
	let node = walker[symbols.current];
	node = type === 'first' ? node[symbols.firstChild] : node[symbols.lastChild];

	while(node !== null) {
		let result = filter(node, walker);

		if(result === NodeFilter.FILTER_ACCEPT) {
			walker[symbols.current] = node;
			return node;
		}
		else if(result === NodeFilter.FILTER_SKIP) {
			let child = type === 'first' ? node[symbols.firstChild] : node[symbols.lastChild];

			if(child !== null) {
				node = child;
				continue;
			}
		}

		while(node !== null) {
			let sibling = type === 'first' ? node[symbols.nextSibling] : node[symbols.previousSibling];

			if(sibling !== null) {
				node = sibling;
				break;
			}

			let parent = node[symbols.parent];

			if(parent === null || parent === walker[symbols.root] || parent === walker[symbols.current]) {
				return null;
			}

			node = parent;
		}
	}

	return null;
}

// https://dom.spec.whatwg.org/#concept-traverse-siblings
export function traverseSiblings(walker, type) {
	let node = walker[symbols.current];

	if(node === this[symbols.root]) {
		return null;
	}

	while(true) {
		let sibling = type === 'next' ? node[symbols.nextSibling] : node[symbols.previousSibling];

		while(sibling !== null) {
			node = sibling;
			let result = filter(node, walker);

			if(result === NodeFilter.FILTER_ACCEPT) {
				walker[symbols.current] = node;
				return node;
			}

			sibling = type === 'next' ? node[symbols.firstChild] : node[symbols.lastChild];

			if(result === NodeFilter.FILTER_REJECT || sibling === null) {
				sibling = type === 'next' ? node[symbols.nextSibling] : node[symbols.previousSibling];
			}
		}

		node = node[symbols.parent];

		if(node === null || node === walker[symbols.root]) {
			return null;
		}

		if(filter(node, walker) === NodeFilter.FILTER_ACCEPT) {
			return null;
		}
	}
}