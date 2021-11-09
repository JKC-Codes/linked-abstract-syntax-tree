import { adopt } from './document.js';
import { isInclusiveAncestor, walkChildren, walkFollowing, walkInclusiveFollowing } from './tree.js';

import symbols from '../../symbols.js';


export default {
	append,
	ensurePreInsertionValidity,
	insert,
	preInsert,
	preRemove,
	remove,
	replace,
	replaceAll
}


// https://dom.spec.whatwg.org/#concept-node-append
export function append(node, parent) {
	return preInsert(node, parent, null);
}

// https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
export function ensurePreInsertionValidity(node, parent, child) {
	if(
		!parent[symbols.interfaces].has('Document') &&
		!parent[symbols.interfaces].has('DocumentFragment') &&
		!parent[symbols.interfaces].has('Element')
	) {
		throw new Error(`DOMException: HierarchyRequestError. Can only insert into a document, document fragment or element.`);
	}

	if(isInclusiveAncestor(node, parent)) {
		throw new Error(`DOMException: HierarchyRequestError. Can not insert an ancestor into its descendant.`);
	}

	if(child !== null && child[symbols.parent] !== parent) {
		throw new Error(`DOMException: NotFoundError. Can not insert a node before a child when node's and child's parents are different.`);
	}

	if(
		!node[symbols.interfaces].has('DocumentFragment') &&
		!node[symbols.interfaces].has('DocumentType') &&
		!node[symbols.interfaces].has('Element') &&
		!node[symbols.interfaces].has('CharacterData')
	) {
		throw new Error(`DOMException: HierarchyRequestError. Can not insert attributes or documents.`);
	}

	// if(node[symbols.interfaces].has('Text') && parent[symbols.interfaces].has('Document')) {
	// 	throw new Error(`DOMException: HierarchyRequestError. Can not insert text into a document.`);
	// }

	if(node[symbols.interfaces].has('DocumentType') && !parent[symbols.interfaces].has('Document'))	{
		throw new Error(`DOMException: HierarchyRequestError. A doctype can only be inserted into a document.`);
	}

	if(parent[symbols.interfaces].has('Document')) {
		if(node[symbols.interfaces].has('DocumentFragment') && child !== null) {
			// Skipping: If node has more than one element child or has a Text node child
			// Skipping: If node has one element child and parent has an element child

			let fragmentHasElementChild = false;

			for(const currentChild of walkChildren(node)) {
				if(currentChild[symbols.interfaces].has('Element')) {
					fragmentHasElementChild = true;
					break;
				}
			}

			if(fragmentHasElementChild) {
				for(const followingNode of walkInclusiveFollowing(child)) {
					if(followingNode[symbols.interfaces].has('DocumentType')) {
						throw new Error(`DOMException: HierarchyRequestError. Can not insert an element before a doctype.`);
					}
				}
			}
		}
		else if(node[symbols.interfaces].has('Element') && child !== null) {
			// Skipping: If parent has an element child

			for(const followingNode of walkInclusiveFollowing(child)) {
				if(followingNode[symbols.interfaces].has('DocumentType')) {
					throw new Error(`DOMException: HierarchyRequestError. Can not insert an element before a doctype.`);
				}
			}
		}
		else if(node[symbols.interfaces].has('DocumentType')) {
			let passedChild = child === null;

			for(const currentChild of walkChildren(parent)) {
				if(currentChild === child) {
					passedChild = true;
				}
				else {
					if(currentChild[symbols.interfaces].has('DocumentType')) {
						throw new Error(`DOMException: HierarchyRequestError. Can not insert multiple doctypes into a document.`);
					}
					else if(!passedChild && currentChild[symbols.interfaces].has('Element')) {
						throw new Error(`DOMException: HierarchyRequestError. Can not insert a doctype after an element.`);
					}
				}
			}
		}
	}
}

// https://dom.spec.whatwg.org/#concept-node-insert
export function insert(node, parent, child, suppressObservers = false) {
	let nodes = new Set();

	if(node[symbols.interfaces].has('DocumentFragment')) {
		let currentNode = node[symbols.firstChild];

		while(currentNode !== null) {
			let nextSibling = currentNode[symbols.nextSibling];

			nodes.add(currentNode);
			remove(currentNode, true);
			currentNode = nextSibling;
		}
	}
	else {
		nodes.add(node);
	}

	if(nodes.size === 0) {
		return;
	}

	for(const node of nodes) {
		adopt(node, parent[symbols.nodeDocument]);

		if(child === null) {
			if(parent[symbols.lastChild]) {
				parent[symbols.lastChild][symbols.nextSibling] = node;
				node[symbols.previousSibling] = parent[symbols.lastChild];
			}
			else {
				parent[symbols.firstChild] = node;
			}

			parent[symbols.lastChild] = node;
		}
		else {
			if(parent[symbols.firstChild] === child) {
				parent[symbols.firstChild] = node;
			}
			else {
				child[symbols.previousSibling][symbols.nextSibling] = node;
			}
			node[symbols.previousSibling] = child[symbols.previousSibling];
			node[symbols.nextSibling] = child;
			child[symbols.previousSibling] = node;
		}

		node[symbols.parent] = parent;
	}
}

// https://dom.spec.whatwg.org/#concept-node-pre-insert
export function preInsert(node, parent, child) {
	ensurePreInsertionValidity(node, parent, child);

	let referenceChild = child;

	if(referenceChild === node) {
		referenceChild = node[symbols.nextSibling];
	}

	insert(node, parent, referenceChild);

	return node;
}

// https://dom.spec.whatwg.org/#concept-node-pre-remove
export function preRemove(child, parent) {
	if(child[symbols.parent] !== parent) {
		throw new Error(`DOMException: NotFoundError. Can only remove a child.`);
	}

	remove(child);

	return child;
}

// https://dom.spec.whatwg.org/#concept-node-remove
export function remove(node, suppressObservers = false) {
	const parent = node[symbols.parent];

	if(parent === null) {
		return;
	}

	if(node[symbols.nextSibling]) {
		node[symbols.nextSibling][symbols.previousSibling] = node[symbols.previousSibling];
	}

	if(node[symbols.previousSibling]) {
		node[symbols.previousSibling][symbols.nextSibling] = node[symbols.nextSibling];
	}

	if(parent[symbols.firstChild] === node) {
		parent[symbols.firstChild] = node[symbols.nextSibling];
	}

	if(parent[symbols.lastChild] === node) {
		parent[symbols.lastChild] = node[symbols.previousSibling];
	}

	node[symbols.previousSibling] = null;
	node[symbols.nextSibling] = null;
	node[symbols.parent] = null;
}

// https://dom.spec.whatwg.org/#concept-node-replace
export function replace(child, node, parent) {
	if(
		!parent[symbols.interfaces].has('Document') &&
		!parent[symbols.interfaces].has('DocumentFragment') &&
		!parent[symbols.interfaces].has('Element')
	) {
		throw new Error(`DOMException: HierarchyRequestError. Can only replace from a document, document fragment or element.`);
	}

	if(isInclusiveAncestor(node, parent)) {
		throw new Error(`DOMException: HierarchyRequestError. A replacement can not be an inclusive ancestor of its new parent.`);
	}

	if(child[symbols.parent] !== parent) {
		throw new Error(`DOMException: NotFoundError. Can only replace a child.`);
	}

	if(
		!node[symbols.interfaces].has('DocumentFragment') &&
		!node[symbols.interfaces].has('DocumentType') &&
		!node[symbols.interfaces].has('Element') &&
		!node[symbols.interfaces].has('CharacterData')
	) {
		throw new Error(`DOMException: HierarchyRequestError. Can not replace attributes or documents.`)
	}

	// if(node[symbols.interfaces].has('Text') && parent[symbols.interfaces].has('Document')) {
	// 	throw new Error(`DOMException: HierarchyRequestError. Can not insert a text replacement into a document.`);
	// }

	if(node[symbols.interfaces].has('DocumentType') && !parent[symbols.interfaces].has('Document'))	{
		throw new Error(`DOMException: HierarchyRequestError. A doctype replacement can only be inserted into a document.`);
	}

	if(parent[symbols.interfaces].has('Document')) {
		if(node[symbols.interfaces].has('DocumentFragment')) {
			// Skipping: If node has more than one element child or has a Text node child
			// Skipping: If node has one element child and parent has an element child that is not child

			let fragmentHasElementChild = false;

			for(const currentChild of walkChildren(node)) {
				if(currentChild[symbols.interfaces].has('Element')) {
					fragmentHasElementChild = true;
					break;
				}
			}

			if(fragmentHasElementChild) {
				for(const followingNode of walkFollowing(child)) {
					if(followingNode[symbols.interfaces].has('DocumentType')) {
						throw new Error(`DOMException: HierarchyRequestError. Can not insert an element before a doctype.`);
					}
				}
			}
		}
		else if(node[symbols.interfaces].has('Element')) {
			// Skipping: If parent has an element child that is not child

			for(const followingNode of walkFollowing(child)) {
				if(followingNode[symbols.interfaces].has('DocumentType')) {
					throw new Error(`DOMException: HierarchyRequestError. Can not insert an element before a doctype.`);
				}
			}
		}
		else if(node[symbols.interfaces].has('DocumentType')) {
			let passedChild = false;

			for(const currentChild of walkChildren(parent)) {
				if(currentChild === child) {
					passedChild = true;
				}
				else {
					if(currentChild[symbols.interfaces].has('DocumentType')) {
						throw new Error(`DOMException: HierarchyRequestError. Can not insert multiple doctypes into a document.`);
					}
					else if(!passedChild && currentChild[symbols.interfaces].has('Element')) {
						throw new Error(`DOMException: HierarchyRequestError. Can not insert a doctype after an element.`);
					}
				}
			}
		}
	}

	let referenceChild = child[symbols.nextSibling];

	if(referenceChild === node) {
		referenceChild = node[symbols.nextSibling];
	}

	if(child[symbols.parent] !== null) {
		remove(child, true);
	}

	insert(node, parent, referenceChild, true);

	return child;
}

// https://dom.spec.whatwg.org/#concept-node-replace-all
export function replaceAll(node, parent) {
	let currentNode = parent[symbols.firstChild];

	while(currentNode !== null) {
		let nextSibling = currentNode[symbols.nextSibling];
		remove(currentNode, true);
		currentNode = nextSibling;
	}

	if(node !== null) {
		insert(node, parent, null, true);
	}
}