// https://dom.spec.whatwg.org/#interface-node

import nodeFilter from '../traversal/node-filter.js';
import preInsert from '../mutation-algorithms/pre-insert.js';
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

	get parentElement() {
		if(this[symbols.parent].constructor[symbols.interfaces].has('Element')) {
			return this[symbols.parent];
		}
		else {
			return null;
		}
	}
	set parentElement(value) {}

	get parentNode() {
		return this[symbols.parent];
	}
	set parentNode(value) {}

	get previousSibling() {
		return this[symbols.previousSibling];
	}
	set previousSibling(value) {}

	get textContent() {
		const interfaces = this.constructor[symbols.interfaces];

		if(interfaces.has('DocumentFragment') || interfaces.has('Element')) {
			const treeWalker = this[symbols.nodeDocument].createTreeWalker(this, nodeFilter.SHOW_TEXT);
			let textContent = '';
			let currentNode = treeWalker.nextNode();

			while(currentNode !== null) {
				textContent += currentNode.data;
				currentNode = treeWalker.nextNode();
			}

			return textContent;
		}
		else if(interfaces.has('Attr')) {
			return this.data;
		}
		else {
			return null;
		}
	}
	set textContent(value) {
		const interfaces = this.constructor[symbols.interfaces];

		if(value === null) {
			value = '';
		}

		if(interfaces.has('DocumentFragment') || interfaces.has('Element')) {
			let node = null;

			if(value !== '') {
				node = this[symbols.nodeDocument].createTextNode(value);
			}

			replaceAll(node, this[symbols.parent]);
		}
		else if(interfaces.has('Attr')) {
			this.value = value;
		}
		else if(interfaces.has('CharacterData')) {
			this.replaceData(0, this[symbols.length], value);
		}
	}


	// Methods
	get appendChild() {
		return function(node) {
			return preInsert(node, this, null);
		};
	}
	set appendChild(value) {}

	get cloneNode() {
		return function(cloneChildren) {
			let document = this[symbols.nodeDocument];

			async function clone(node) {
				let copy;

				if(node.constructor[symbols.interfaces].has('Element')) {
					copy = document.createElement(node.localName);

					node[symbols.attributes].forEach((value, key) => {
						copy[symbols.attributes].set(key, value.cloneNode());
					})
				}
				else {
					if(node.constructor[symbols.interfaces].has('Document')) {
						const Document = await import('./document.js');
						copy = new Document();
						copy[symbols.encoding] = node[symbols.encoding];
						copy[symbols.contentType] = node[symbols.contentType];
						copy[symbols.URL] = node[symbols.URL];
						copy[symbols.origin] = node[symbols.origin];
						copy[symbols.type] = node[symbols.type];
						copy[symbols.mode] = node[symbols.mode];
					}
					else if(node.constructor[symbols.interfaces].has('DocumentType')) {
						const DocumentType = await import('./document-type.js');
						copy = new DocumentType();
						copy[symbols.name] = node[symbols.name];
						copy[symbols.publicID] = node[symbols.publicID];
						copy[symbols.systemID] = node[symbols.systemID];
					}
					else if(node.constructor[symbols.interfaces].has('Attr')) {
						copy = document.createAttribute();
						copy[symbols.localName] = node[symbols.localName];
						copy.value = node.vlaue;
						copy[symbols.quotes] = node[symbols.quotes];
					}
					else if(node.constructor[symbols.interfaces].has('Text')) {
						copy = document.createTextNode(node.data);
					}
					else if(node.constructor[symbols.interfaces].has('Comment')) {
						copy = document.createComment(node.data);
					}
					else if(node.constructor[symbols.interfaces].has('ProcessingInstruction')) {
						copy = document.createProcessingInstruction(node.target, node.data);
					}
				}

				if(copy.nodeType === nodeTypes.DOCUMENT_NODE) {
					copy[symbols.nodeDocument] = copy;
					document = copy;
				}
				else {
					copy[symbols.nodeDocument] = document;
				}

				return copy;
			}

			const rootCopy = clone(this);

			if(cloneChildren === true) {
				const treeWalker = this[symbols.nodeDocument].createTreeWalker(this);
				let currentNode = treeWalker.firstChild();
				let cloneParent = rootCopy;

				while(currentNode !== null) {
					cloneParent.appendChild(clone(currentNode));

					let lastNode = currentNode;
					currentNode = treeWalker.nextNode();

					if(currentNode === null) {
						break;
					}
					else if(lastNode[symbols.nextSibling] === currentNode) {
						continue;
					}
					else if(lastNode[symbols.firstChild] === currentNode) {
						cloneParent = cloneParent[symbols.lastChild];
					}
					else {
						do {
							cloneParent = cloneParent[symbols.parent];
							lastNode = lastNode[symbols.parent];
						}
						while(lastNode[symbols.nextSibling] !== currentNode);
					}
				}
			}

			return rootCopy;
		}
	}
	set cloneNode(value) {}

	get compareDocumentPosition() {
		const DOCUMENT_POSITION_DISCONNECTED = 1;
		const DOCUMENT_POSITION_PRECEDING = 2;
		const DOCUMENT_POSITION_FOLLOWING = 4;
		const DOCUMENT_POSITION_CONTAINS = 8;
		const DOCUMENT_POSITION_CONTAINED_BY = 16;
		const DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

		return function(other) {
			if(this === other) {
				return 0;
			}

			let node1 = other;
			let node2 = this;
			let attr1 = null;
			let attr2 = null;

			if(node1.constructor[symbols.interfaces].has('Attr')) {
				attr1 = node1;
				node1 = attr1.ownerElement;
			}

			if(node2.constructor[symbols.interfaces].has('Attr')) {
				attr2 = node2;
				node2 = attr2.ownerElement;

				if(attr1 !== null && node1 !== null && node2 === node1) {
					node2[symbols.attributes].forEach(attr => {
						if(attr.isEqualNode(attr1)) {
							return DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DOCUMENT_POSITION_PRECEDING;
						}
						else if(attr.isEqualNode(attr2)) {
							return DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DOCUMENT_POSITION_FOLLOWING;
						}
					});
				}
			}

			if(node1 === null || node2 === null || node1.getRootNode() !== node2.getRootNode()) {
				return DOCUMENT_POSITION_DISCONNECTED + DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DOCUMENT_POSITION_FOLLOWING;
			}

			if((node1.contains(node2) && attr1 !== null) || (node1 === node2 && attr2 !== null)) {
				return DOCUMENT_POSITION_CONTAINS + DOCUMENT_POSITION_PRECEDING;
			}

			if((node2.contains(node1) && attr2 !== null) || (node1 === node2 && attr1 !== null)) {
				return DOCUMENT_POSITION_CONTAINED_BY + DOCUMENT_POSITION_FOLLOWING;
			}

			const treeWalker = node1[symbols.nodeDocument].createTreeWalker(node1[symbols.nodeDocument]);
			treeWalker.currentNode = node1;
			let currentNode = treeWalker.nextNode();

			while(currentNode !== null) {
				if(currentNode === node2) {
					return DOCUMENT_POSITION_PRECEDING;
				}
				else {
					currentNode = treeWalker.nextNode();
				}
			}

			return DOCUMENT_POSITION_FOLLOWING;
		}
	}
	set compareDocumentPosition(value) {}

	get contains() {
		return function(other) {
			if(this === other) {
				return true;
			}
			else if(other === null) {
				return false;
			}
			else {
				const treeWalker = this[symbols.nodeDocument].createTreeWalker(this);
				let currentNode = treeWalker.firstChild();

				while(currentNode !== null) {
					if(currentNode === other) {
						return true;
					}
					currentNode = treeWalker.nextNode();
				}

				return false;
			}
		};
	}
	set contains(value) {}

	get getRootNode() {
		let rootNode = this;

		while(rootNode[symbols.parent]) {
			rootNode = rootNode[symbols.parent];
		}

		return rootNode;
	}
	set getRootNode(value) {}

	get hasChildNodes() {
		return this.firstChild ? true : false;
	}
	set hasChildNodes(value) {}

	get insertBefore() {
		return function(node, child) {
			return preInsert(node, this, child);
		};
	}
	set insertBefore(value) {}

	get isEqualNode() {
		return function(otherNode) {
			function compareNodes(nodeA, nodeB) {
				const interfaces = nodeA.constructor[symbols.interfaces];

				function compareProperties(properties) {
					for(const property of properties) {
						if(nodeA[property] !== nodeB[property]) {
							return false;
						}
					}
				}

				for(const currentInterface of interfaces) {
					if(!nodeB.constructor[symbols.interfaces].has(currentInterface)) {
						return false;
					}
				}

				if(interfaces.has('DocumentType') && compareProperties([
					'name',
					'publicId',
					'systemId'
				]) === false) {
					return false;
				}
				else if(interfaces.has('Element')) {
					if(compareProperties([
					symbols.namespace,
					symbols.namespacePrefix,
					'localName',
					[symbols.attributes].size
					]) === false) {
						return false;
					}

					for(const [attributeName, attributeNode] of nodeA[symbols.attributes]) {
						if(!attributeNode.isEqualNode(nodeB[symbols.attributes][attributeName])) {
							return false;
						}
					}
				}
				else if(interfaces.has('Attr') && compareProperties([
					symbols.namespace,
					'localName',
					'value'
				]) === false) {
					return false;
				}
				else if(interfaces.has('ProcessingInstruction') && compareProperties([
					'target',
					'data'
				]) === false) {
					return false;
				}
				else if((interfaces.has('Text') || interfaces.has('Comment')) && compareProperties([
					'data'
				]) === false) {
					return false;
				}
			}

			if(compareNodes(this, otherNode) === false) {
				return false;
			}

			const treeWalkerA = this[symbols.nodeDocument].createTreeWalker(this);
			const treeWalkerB = this[symbols.nodeDocument].createTreeWalker(this);
			let currentNodeA = treeWalkerA.firstChild();
			let currentNodeB = treeWalkerB.firstChild();

			while(currentNodeA !== null && currentNodeB !== null) {
				if(compareNodes(currentNodeA, currentNodeB) === false) {
					return false;
				}
				else {
					currentNodeA = treeWalkerA.nextNode();
					currentNodeB = treeWalkerB.nextNode();
				}
			}

			if(currentNodeA !== null || currentNodeB !== null) {
				return false;
			}
			else {
				return true;
			}
		}
	}
	set isEqualNode(value) {}

	get isSameNode() {
		return function(otherNode) {
			return this === otherNode;
		}
	}
	set isSameNode(value) {}

	get normalize() {
		function exclusiveTextNodeFilter(node) {
			if(node.constructor[symbols.interfaces].has('CDATASection')) {
				return nodeFilter.FILTER_SKIP;
			}
			else {
				return nodeFilter.FILTER_ACCEPT;
			}
		}

		const treeWalker = this[symbols.nodeDocument].createTreeWalker(this, nodeFilter.SHOW_TEXT, {acceptNode: exclusiveTextNodeFilter});
		let node = treeWalker.nextNode();

		while(node !== null) {
			let length = node.data.length;

			if(length === 0) {
				remove(node);
				node = treeWalker.nextNode();
				continue;
			}

			const textWalker = this[symbols.nodeDocument].createTreeWalker(node, nodeFilter.SHOW_TEXT, {acceptNode: exclusiveTextNodeFilter});
			let currentTextNode = textWalker.nextSibling();
			let data = '';

			while(currentTextNode !== null) {
				data += currentTextNode.data;
				remove(currentTextNode);
				currentTextNode = textWalker.nextSibling();
			}

			node.replaceData(length, 0, data);
			node = treeWalker.nextNode();
		}
	}
	set normalize(value) {}

	get removeChild() {
		return function(child) {
			return preRemove(child, this);
		};
	}
	set removeChild(value) {}

	get replaceChild() {
		return function(node, child) {
			return replace(child, node, this);
		};
	}
	set replaceChild(value) {}
}