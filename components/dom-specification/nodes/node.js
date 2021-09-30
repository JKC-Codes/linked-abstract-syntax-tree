// https://dom.spec.whatwg.org/#interface-node

import symbols from '../../symbols.js';

export default class Node {
	constructor(nodeDocument) {
		this[symbols.firstChild] = null;
		this[symbols.lastChild] = null;
		this[symbols.nextSibling] = null;
		this[symbols.nodeDocument] = nodeDocument;
		this[symbols.parent] = null;
		this[symbols.previousSibling] = null;
	}

	static [symbols.interfaces] = new Set(['Node']);

	get [symbols.length]() {
		const interfaces = this.constructor[symbols.interfaces];

		if(interfaces.has('DocumentType') || interfaces.has('Attr')) {
			return 0;
		}
		else if(interfaces.has('CharacterData')) {
			return this.data.length;
		}
		else {
			return this.childNodes.size;
		}
	}


	// Properties
	get baseURI() {
		try {
			return new URL(this[symbols.nodeDocument].querySelector('base').href).href;
		}
		catch {
			return null;
		}
	}
	set baseURI(value) {}

	get childNodes() {
		const treeWalker = this[symbols.nodeDocument].createTreeWalker(this);
		const childNodes = new Set();
		let currentNode = treeWalker.firstChild();

		while(currentNode !== null) {
			childNodes.add(currentNode);
			currentNode = treeWalker.nextSibling();
		}

		return childNodes;
	}
	set childNodes(value) {}

	get firstChild() {
		return this[symbols.firstChild];
	}
	set firstChild(value) {}

	get isConnected() {
		return this.getRootNode().constructor[symbols.interfaces].has('Document');
	}
	set isConnected(value) {}

	get lastChild() {
		return this[symbols.lastChild];
	}
	set lastChild(value) {}

	get nextSibling() {
		return this[symbols.nextSibling];
	}
	set nextSibling(value) {}

	get nodeName() {
		const interfaces = this.constructor[symbols.interfaces];

		if(interfaces.has('Element')) {
			return this.localName.toUpperCase();
		}
		else if(interfaces.has('Attr')) {
			return this.localName;
		}
		else if(interfaces.has('Text') && !interfaces.has('CDATASection')) {
			return '#text';
		}
		else if(interfaces.has('CDATASection')) {
			return '#cdata-section';
		}
		else if(interfaces.has('ProcessingInstruction')) {
			return this.target;
		}
		else if(interfaces.has('Comment')) {
			return '#comment';
		}
		else if(interfaces.has('Document')) {
			return '#document';
		}
		else if(interfaces.has('DocumentType')) {
			return this.name;
		}
		else if(interfaces.has('DocumentFragment')) {
			return '#document-fragment';
		}
	}
	set nodeName(value) {}
}