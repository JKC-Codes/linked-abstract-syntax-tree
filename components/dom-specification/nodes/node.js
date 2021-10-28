// https://dom.spec.whatwg.org/#interface-node

import { setAnExistingAttributeValue } from '../algorithms/attribute.js';
import { replaceData } from '../algorithms/character-data.js';
import { getDocumentBaseURL } from '../../html-specification/algorithms/document.js';
import { getHTMLUppercasedQualifiedName, getQualifiedName, locateNamespacePrefix } from '../algorithms/element.js';
import { append, preInsert, preRemove, remove, replace } from '../algorithms/mutation.js';
import { clone, getEquality, getLength, locateNamespace } from '../algorithms/node.js';
import { getDescendantTextContent, walkContiguousExclusiveTextNodes } from '../algorithms/text.js';
import { getParentElement, getRoot, isAncestor, isDescendant,	isInclusiveDescendant, isPreceding, walkChildren, walkDescendants } from '../algorithms/tree.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class Node {
	constructor() {
		Object.defineProperties(this, {
			[symbols.firstChild]: {writable: true, value: null},
			[symbols.lastChild]: {writable: true, value: null},
			[symbols.nextSibling]: {writable: true, value: null},
			[symbols.nodeDocument]: {writable: true, value: undefined},
			[symbols.parent]: {writable: true, value: null},
			[symbols.previousSibling]: {writable: true, value: null}
		});
	}


	static get ELEMENT_NODE() { return 1; }
	static get ATTRIBUTE_NODE() { return 2; }
	static get TEXT_NODE() { return 3; }
	static get CDATA_SECTION_NODE() { return 4; }
	static get PROCESSING_INSTRUCTION_NODE() { return 7; }
	static get COMMENT_NODE() { return 8; }
	static get DOCUMENT_NODE() { return 9; }
	static get DOCUMENT_TYPE_NODE() { return 10; }
	static get DOCUMENT_FRAGMENT_NODE() { return 11; }

	static get DOCUMENT_POSITION_DISCONNECTED() { return 1; }
	static get DOCUMENT_POSITION_PRECEDING() { return 2; }
	static get DOCUMENT_POSITION_FOLLOWING() { return 4; }
	static get DOCUMENT_POSITION_CONTAINS() { return 8; }
	static get DOCUMENT_POSITION_CONTAINED_BY() { return 16; }
	static get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC() { return 32; }


	static #interfaces = new Set(['EventTarget', 'Node']);
	get [symbols.interfaces]() {
		return this.constructor.#interfaces;
	}


	get appendChild() {
		return function(node) {
			return append(node, this);
		};
	}
	set appendChild(value) {
		return errors.readOnly('appendChild', value);
	}

	get baseURI() {
		return getDocumentBaseURL(this[symbols.nodeDocument]).href;
	}
	set baseURI(value) {
		return errors.readOnly('baseURI', value);
	}

	get childNodes() {
		const childNodes = [];

		for(const child of walkChildren(this)) {
			childNodes.push(child);
		}

		return childNodes;
	}
	set childNodes(value) {
		return errors.readOnly('childNodes', value);
	}

	get cloneNode() {
		return function(deep = false) {
			return clone(this, deep);
		};
	}
	set cloneNode(value) {
		return errors.readOnly('cloneNode', value);
	}

	get compareDocumentPosition() {
		return function(other) {
			if(this === other) {
				return 0;
			}

			let node1 = other;
			let node2 = this;
			let attr1 = null;
			let attr2 = null;

			if(node1[symbols.interfaces].has('Attr')) {
				attr1 = node1;
				node1 = attr1[symbols.element];
			}

			if(node2[symbols.interfaces].has('Attr')) {
				attr2 = node2;
				node2 = attr2[symbols.element];

				if(attr1 !== null && node1 !== null && node2 === node1) {
					for(const attr of node2[symbols.attributes].values()) {
						if(getEquality(attr, attr1) === true) {
							return this.constructor.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + this.constructor.DOCUMENT_POSITION_PRECEDING;
						}
						else if(getEquality(attr, attr2) === true) {
							return this.constructor.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + this.constructor.DOCUMENT_POSITION_FOLLOWING;
						}
					}
				}
			}

			if(node1 === null || node2 === null || (getRoot(node1) !== getRoot(node2))) {
				return this.constructor.DOCUMENT_POSITION_DISCONNECTED + this.constructor.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + this.constructor.DOCUMENT_POSITION_FOLLOWING;
			}

			if((isAncestor(node1, node2) && attr1 === null) || ((node1 === node2) && attr2 !== null)) {
				return this.constructor.DOCUMENT_POSITION_CONTAINS + this.constructor.DOCUMENT_POSITION_PRECEDING;
			}

			if((isDescendant(node1, node2) && attr2 === null) || ((node1 === node2) && attr1 !== null)) {
				return this.constructor.DOCUMENT_POSITION_CONTAINED_BY + this.constructor.DOCUMENT_POSITION_FOLLOWING;
			}

			if(isPreceding(node1, node2)) {
				return this.constructor.DOCUMENT_POSITION_PRECEDING;
			}

			return this.constructor.DOCUMENT_POSITION_FOLLOWING;
		};
	}
	set compareDocumentPosition(value) {
		return errors.readOnly('compareDocumentPosition', value);
	}

	get contains() {
		return function(other) {
			return other === null ? false : isInclusiveDescendant(other, this);
		};
	}
	set contains(value) {
		return errors.readOnly('contains', value);
	}

	get firstChild() {
		return this[symbols.firstChild];
	}
	set firstChild(value) {
		return errors.readOnly('firstChild', value);
	}

	get getRootNode() {
		return function(options = {}) {
			return getRoot(this);
		};
	}
	set getRootNode(value) {
		return errors.readOnly('getRootNode', value);
	}

	get hasChildNodes() {
		return function() {
			return this[symbols.firstChild] === null ? false : true;
		};
	}
	set hasChildNodes(value) {
		return errors.readOnly('hasChildNodes', value);
	}

	get insertBefore() {
		return function(node, child) {
			return preInsert(node, this, child);
		};
	}
	set insertBefore(value) {
		return errors.readOnly('insertBefore', value);
	}

	get isConnected() {
		return getRoot(this)[symbols.interfaces].has('Document');
	}
	set isConnected(value) {
		return errors.readOnly('isConnected', value);
	}

	get isDefaultNamespace() {
		return function(namespace) {
			if(namespace === '') {
				namespace = null;
			}

			let defaultNamespace = locateNamespace(this, null);

			return defaultNamespace === namespace;
		};
	}
	set isDefaultNamespace(value) {
		return errors.readOnly('isDefaultNamespace', value);
	}

	get isEqualNode() {
		return function(otherNode) {
			if(otherNode === null) {
				return false;
			}
			else {
				return getEquality(this, otherNode);
			}
		};
	}
	set isEqualNode(value) {
		return errors.readOnly('isEqualNode', value);
	}

	get isSameNode() {
		return function(otherNode) {
			return this === otherNode;
		};
	}
	set isSameNode(value) {
		return errors.readOnly('isSameNode', value);
	}

	get lastChild() {
		return this[symbols.lastChild];
	}
	set lastChild(value) {
		return errors.readOnly('lastChild', value);
	}

	get lookupPrefix() {
		return function(namespace) {
			if(namespace === null || namespace === '') {
				return null;
			}

			const interfaces = this[symbols.interfaces];

			if(interfaces.has('Element')) {
				return locateNamespacePrefix(this, namespace);
			}
			else if(interfaces.has('Document')) {
				const documentElement = getDocumentElement(this);

				if(documentElement !== null) {
					return locateNamespacePrefix(documentElement, namespace);
				}
				else {
					return null;
				}
			}
			else if(interfaces.has('DocumentType') || interfaces.has('DocumentFragment')) {
				return null;
			}
			else if(interfaces.has('Attr')) {
				if(this[symbols.element] !== null) {
					return locateNamespacePrefix(this[symbols.element], namespace);
				}
				else {
					return null;
				}
			}
			else {
				const parentElement = getParentElement(this);

				if(parentElement !== null) {
					return locateNamespacePrefix(parentElement, namespace);
				}
				else {
					return null;
				}
			}
		};
	}
	set lookupPrefix(value) {
		return errors.readOnly('lookupPrefix', value);
	}

	get lookupNamespaceURI() {
		return function(prefix) {
			if(prefix === '') {
				prefix = null;
			}

			return locateNamespace(this, prefix);
		};
	}
	set lookupNamespaceURI(value) {
		return errors.readOnly('lookupNamespaceURI', value);
	}

	get nextSibling() {
		return this[symbols.nextSibling];
	}
	set nextSibling(value) {
		return errors.readOnly('nextSibling', value);
	}

	get nodeName() {
		const interfaces = this[symbols.interfaces];

		if(interfaces.has('Element')) {
			return getHTMLUppercasedQualifiedName(this);
		}
		else if(interfaces.has('Attr')) {
			return getQualifiedName(this);
		}
		else if(interfaces.has('Text') && !interfaces.has('CDATASection')) {
			return '#text';
		}
		else if(interfaces.has('CDATASection')) {
			return '#cdata-section';
		}
		else if(interfaces.has('ProcessingInstruction')) {
			return this[symbols.target];
		}
		else if(interfaces.has('Comment')) {
			return '#comment';
		}
		else if(interfaces.has('Document')) {
			return '#document';
		}
		else if(interfaces.has('DocumentType')) {
			return this[symbols.name];
		}
		else if(interfaces.has('DocumentFragment')) {
			return '#document-fragment';
		}
	}
	set nodeName(value) {
		return errors.readOnly('nodeName', value);
	}

	get nodeType() {
		const interfaces = this[symbols.interfaces];

		if(interfaces.has('Element')) {
			return this.constructor.ELEMENT_NODE;
		}
		else if(interfaces.has('Attr')) {
			return this.constructor.ATTRIBUTE_NODE;
		}
		else if(interfaces.has('Text') && !interfaces.has('CDATASection')) {
			return this.constructor.TEXT_NODE;
		}
		else if(interfaces.has('CDATASection')) {
			return this.constructor.CDATASection;
		}
		else if(interfaces.has('ProcessingInstruction')) {
			return this.constructor.PROCESSING_INSTRUCTION_NODE;
		}
		else if(interfaces.has('Comment')) {
			return this.constructor.COMMENT_NODE;
		}
		else if(interfaces.has('Document')) {
			return this.constructor.DOCUMENT_NODE;
		}
		else if(interfaces.has('DocumentType')) {
			return this.constructor.DOCUMENT_TYPE_NODE;
		}
		else if(interfaces.has('DocumentFragment')) {
			return this.constructor.DOCUMENT_FRAGMENT_NODE;
		}
	}
	set nodeType(value) {
		return errors.readOnly('nodeType', value);
	}

	get nodeValue() {
		const interfaces = this[symbols.interfaces];

		if(interfaces.has('Attr')) {
			return this[symbols.value];
		}
		else if(interfaces.has('CharacterData')) {
			return this[symbols.data];
		}
		else {
			return null;
		}
	}
	set nodeValue(value) {
		const interfaces = this[symbols.interfaces];

		if(value === null) {
			value = '';
		}

		if(interfaces.has('Attr')) {
			return setAnExistingAttributeValue(this, value);
		}
		else if(interfaces.has('CharacterData')) {
			return replaceData(this, 0, getLength(this), value);
		}
	}

	get normalize() {
		return function() {
			let lastTextNode = null;

			for(const node of walkDescendants(this)) {
				if(!node[symbols.interfaces].has('Text') || node[symbols.interfaces].has('CDATASection')) {
					continue;
				}

				if(lastTextNode !== null) {
					remove(lastTextNode);
					lastTextNode = null;
				}

				let length = getLength(node);

				if(length === 0) {
					lastTextNode = node;
					continue;
				}

				let data;
				let lastTextSibling = null;

				for(const textNode of walkContiguousExclusiveTextNodes(node)) {
					if(lastTextSibling !== null) {
						remove(lastTextSibling);
						lastTextSibling = null;
					}

					data += textNode[symbols.data];
					lastTextSibling = textNode;
				}

				if(lastTextSibling !== null) {
					remove(lastTextSibling);
				}

				replaceData(node, length, 0, data);
			}

			if(lastTextNode !== null) {
				remove(lastTextNode);
			}
		};
	}
	set normalize(value) {
		return errors.readOnly('normalize', value);
	}

	get ownerDocument() {
		if(this[symbols.interfaces].has('Document')) {
			return null;
		}
		else {
			return this[symbols.nodeDocument];
		}
	}
	set ownerDocument(value) {
		return errors.readOnly('ownerDocument', value);
	}

	get parentElement() {
		return getParentElement(this);
	}
	set parentElement(value) {
		return errors.readOnly('parentElement', value);
	}

	get parentNode() {
		return this[symbols.parent];
	}
	set parentNode(value) {
		return errors.readOnly('parentNode', value);
	}

	get previousSibling() {
		return this[symbols.previousSibling];
	}
	set previousSibling(value) {
		return errors.readOnly('previousSibling', value);
	}

	get removeChild() {
		return function(child) {
			return preRemove(child, this);
		};
	}
	set removeChild(value) {
		return errors.readOnly('removeChild', value);
	}

	get replaceChild() {
		return function(node, child) {
			return replace(child, node, this);
		};
	}
	set replaceChild(value) {
		return errors.readOnly('replaceChild', value);
	}

	get textContent() {
		const interfaces = this[symbols.interfaces];

		if(interfaces.has('DocumentFragment') || interfaces.has('Element')) {
			return getDescendantTextContent(this);
		}
		else if(interfaces.has('Attr')) {
			return this[symbols.value];
		}
		else if(interfaces.has('CharacterData')) {
			return this[symbols.data];
		}
		else {
			return null;
		}
	}
	set textContent(value) {
		const interfaces = this[symbols.interfaces];

		if(value === null) {
			value = '';
		}

		if(interfaces.has('DocumentFragment') || interfaces.has('Element')) {
			return stringReplaceAll(value, this);
		}
		else if(interfaces.has('Attr')) {
			return setAnExistingAttributeValue(this, value);
		}
		else if(interfaces.has('CharacterData')) {
			return replaceData(this, 0, getLength(this), value);
		}
	}
}