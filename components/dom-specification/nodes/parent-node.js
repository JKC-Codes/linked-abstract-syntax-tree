// https://dom.spec.whatwg.org/#interface-parentnode

import { convertNodesIntoANode } from '../algorithms/node.js';
import { append as nodeAppend, ensurePreInsertionValidity, preInsert, replaceAll } from '../algorithms/mutation.js';
import { walkChildren, walkPrecedingSiblings } from '../algorithms/tree.js';

import symbols from '../../symbols.js';


export default {
	append,
	children,
	childElementCount,
	firstElementChild,
	lastElementChild,
	prepend,
	querySelector, // TODO
	querySelectorAll, // TODO
	replaceChildren
}


export function append(nodes) {
	const node = convertNodesIntoANode(nodes, this[symbols.nodeDocument]);

	nodeAppend(node, this);
}

export function children() {
	const HTMLCollection = [];

	for(const child of walkChildren(this)) {
		if(child[symbols.interfaces].has('Element')) {
			HTMLCollection.push(child);
		}
	}

	return HTMLCollection;
}

export function childElementCount() {
	const childElementCount = 0;

	for(const child of walkChildren(this)) {
		if(child[symbols.interfaces].has('Element')) {
			childElementCount++;
		}
	}

	return childElementCount;
}

export function firstElementChild() {
	for(const child of walkChildren(this)) {
		if(child[symbols.interfaces].has('Element')) {
			return child;
		}
	}

	return null;
}

export function lastElementChild() {
	for(const child of walkPrecedingSiblings(this[symbols.lastChild])) {
		if(child[symbols.interfaces].has('Element')) {
			return child;
		}
	}

	return null;
}

export function prepend(nodes) {
	const node = convertNodesIntoANode(nodes, this[symbols.nodeDocument]);

	preInsert(node, this);
}

export function querySelector(selectors) {
	// TODO
}

export function querySelectorAll(selectors) {
	// TODO
}

export function replaceChildren(nodes) {
	const node = convertNodesIntoANode(nodes, this[symbols.nodeDocument]);

	ensurePreInsertionValidity(node, this, null);
	replaceAll(node, this);
}