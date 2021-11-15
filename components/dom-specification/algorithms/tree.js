import symbols from '../../symbols.js';


export default {
	getParentElement,
	getRoot,
	isAncestor,
	isInclusiveAncestor,
	isDescendant,
	isInclusiveDescendant,
	isPreceding,
	walkChildren,
	walkDescendants,
	walkInclusiveDescendants,
	walkFollowing,
	walkInclusiveFollowing,
	walkPreceding,
	walkFollowingSiblings,
	walkPrecedingSiblings
}


// https://dom.spec.whatwg.org/#parent-element
export function getParentElement(node) {
	const parent = node[symbols.parent];

	if(parent !== null && parent[symbols.interfaces].has('Element')) {
		return parent;
	}
	else {
		return null;
	}
}

// https://dom.spec.whatwg.org/#concept-tree-root
export function getRoot(node) {
	let currentNode = node;

	while(currentNode[symbols.parent] !== null) {
		currentNode = currentNode[symbols.parent];
	}

	return currentNode;
}

// https://dom.spec.whatwg.org/#concept-tree-ancestor
export function isAncestor(nodeA, nodeB) {
	let currentNode = nodeB[symbols.parent];

	while(currentNode !== null) {
		if(currentNode === nodeA) {
			return true;
		}
		else {
			currentNode = currentNode[symbols.parent];
		}
	}

	return false;
}

// https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
export function isInclusiveAncestor(nodeA, nodeB) {
	return nodeA === nodeB ? true : isAncestor(nodeA, nodeB);
}

// https://dom.spec.whatwg.org/#concept-tree-descendant
export function isDescendant(nodeA, nodeB) {
	return isAncestor(nodeB, nodeA);
}

// https://dom.spec.whatwg.org/#concept-tree-inclusive-descendant
export function isInclusiveDescendant(nodeA, nodeB) {
	return nodeA === nodeB ? true : isDescendant(nodeA, nodeB);
}

// https://dom.spec.whatwg.org/#concept-tree-preceding
export function isPreceding(nodeA, nodeB) {
	for(const precedingNode of walkPreceding(nodeB)) {
		if(precedingNode === nodeA) {
			return true;
		}
	}

	return false;
}

// https://dom.spec.whatwg.org/#concept-tree-child
export function* walkChildren(node) {
	let currentNode = node[symbols.firstChild];

	while(currentNode !== null) {
		yield currentNode;
		currentNode = currentNode[symbols.nextSibling];
	}
}

// https://dom.spec.whatwg.org/#concept-tree-descendant
export function* walkDescendants(node) {
	yield* walkFollowing(node, node);
}

// https://dom.spec.whatwg.org/#concept-tree-inclusive-descendant
export function* walkInclusiveDescendants(node) {
	yield node;
	yield* walkDescendants(node);
}

// https://dom.spec.whatwg.org/#concept-tree-following
export function* walkFollowing(node, root = null) {
	let currentNode = node;

	while(currentNode !== null) {
		while(currentNode[symbols.firstChild] !== null) {
			currentNode = currentNode[symbols.firstChild];
			yield currentNode;
		}

		let sibling = null;
		let temporary = currentNode;

		while(temporary !== null) {
			if(temporary === root) {
				currentNode = null;
				break;
			}

			sibling = temporary[symbols.nextSibling];

			if(sibling !== null) {
				currentNode = sibling;
				yield currentNode;
				break;
			}

			temporary = temporary[symbols.parent];
		}
	}
}

// https://dom.spec.whatwg.org/#concept-tree-inclusive-descendant
export function* walkInclusiveFollowing(node) {
	yield node;
	yield* walkFollowing(node);
}

// https://dom.spec.whatwg.org/#concept-tree-preceding
export function* walkPreceding(node) {
	let currentNode = node;

	while(currentNode !== null) {
		let sibling = currentNode[symbols.previousSibling];

		while(sibling !== null) {
			currentNode = sibling;

			while(currentNode[symbols.lastChild] !== null) {
				currentNode = currentNode[symbols.lastChild];
			}

			yield currentNode;

			sibling = currentNode[symbols.previousSibling];
		}

		if(currentNode[symbols.parent] === null) {
			currentNode = null;
			break;
		}

		currentNode = currentNode[symbols.parent];

		yield currentNode;
	}
}

// https://dom.spec.whatwg.org/#concept-tree-following
// https://dom.spec.whatwg.org/#concept-tree-sibling
export function* walkFollowingSiblings(node) {
	let currentNode = node;

	while(currentNode !== null) {
		currentNode = currentNode[symbols.nextSibling];
		yield currentNode;
	}
}

// https://dom.spec.whatwg.org/#concept-tree-preceding
// https://dom.spec.whatwg.org/#concept-tree-sibling
export function* walkPrecedingSiblings(node) {
	let currentNode = node;

	while(currentNode !== null) {
		currentNode = currentNode[symbols.previousSibling];
		yield currentNode;
	}
}