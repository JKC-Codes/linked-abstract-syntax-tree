import { remove } from './mutation.js';
import { walkChildren, walkInclusiveDescendants } from './tree.js';

import symbols from '../../symbols.js';


export default {
	adopt,
	getDoctype,
	getDocumentElement
}


// https://dom.spec.whatwg.org/#concept-node-adopt
export function adopt(node, document) {
	let oldDocument = node[symbols.nodeDocument];

	if(node[symbols.parent] !== null) {
		remove(node);
	}

	if(document !== oldDocument) {
		for(const inclusiveDescendant of walkInclusiveDescendants(node)) {
			inclusiveDescendant[symbols.nodeDocument] = document;

			if(inclusiveDescendant[symbols.interfaces].has('Element')) {
				for(const attribute of inclusiveDescendant[symbols.attributes].values()) {
					attribute[symbols.nodeDocument] = document;
				}
			}
		}
	}
}

// https://dom.spec.whatwg.org/#dom-document-doctype
export function getDoctype(document) {
	for(const child of walkChildren(document)) {
		if(child[symbols.interfaces].has('DocumentType')) {
			return child;
		}
	}

	return null;
}

// https://dom.spec.whatwg.org/#document-element
export function getDocumentElement(document) {
	for(const child of walkChildren(document)) {
		if(child[symbols.interfaces].has('Element')) {
			return child;
		}
	}

	return null;
}