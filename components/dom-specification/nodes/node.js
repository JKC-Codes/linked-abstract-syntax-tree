// https://dom.spec.whatwg.org/#interface-node

import symbols from '../../symbols.js';

const nodeTypes = {
	ELEMENT_NODE: 1,
	ATTRIBUTE_NODE: 2,
	TEXT_NODE: 3,
	CDATA_SECTION_NODE: 4,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE: 8,
	DOCUMENT_NODE: 9,
	DOCUMENT_TYPE_NODE: 10,
	DOCUMENT_FRAGMENT_NODE: 11
}

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

	get nodeType() {
		const interfaces = this.constructor[symbols.interfaces];

		if(interfaces.has('Element')) {
			return nodeTypes.ELEMENT_NODE;
		}
		else if(interfaces.has('Attr')) {
			return nodeTypes.ATTRIBUTE_NODE;
		}
		else if(interfaces.has('Text') && !interfaces.has('CDATASection')) {
			return nodeTypes.TEXT_NODE;
		}
		else if(interfaces.has('CDATASection')) {
			return nodeTypes.CDATASection;
		}
		else if(interfaces.has('ProcessingInstruction')) {
			return nodeTypes.PROCESSING_INSTRUCTION_NODE;
		}
		else if(interfaces.has('Comment')) {
			return nodeTypes.COMMENT_NODE;
		}
		else if(interfaces.has('Document')) {
			return nodeTypes.DOCUMENT_NODE;
		}
		else if(interfaces.has('DocumentType')) {
			return nodeTypes.DOCUMENT_TYPE_NODE;
		}
		else if(interfaces.has('DocumentFragment')) {
			return nodeTypes.DOCUMENT_FRAGMENT_NODE;
		}
	}
	set nodeType(value) {}

	get nodeValue() {
		const interfaces = this.constructor[symbols.interfaces];

		if(interfaces.has('Attr')) {
			return this.value;
		}
		else if(interfaces.has('CharacterData')) {
			return this.data;
		}
		else {
			return null;
		}
	}
	set nodeValue(value) {
		const interfaces = this.constructor[symbols.interfaces];

		if(value === null) {
			value = '';
		}

		if(interfaces.has('Attr')) {
			this.value = value;
		}
		else if(interfaces.has('CharacterData')) {
			this.replaceData(0, this[symbols.length], value);
		}
	}

	get ownerDocument() {
		if(this.constructor[symbols.interfaces].has('Document')) {
			return null;
		}
		else {
			return this[symbols.nodeDocument];
		}
	}
	set ownerDocument(value) {}
}