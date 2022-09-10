// https://dom.spec.whatwg.org/#interface-document

import Attr from './attr.js';
import CDATASection from './cdata-section.js';
import Comment from './comment.js';
import DocumentFragment from './document-fragment.js';
import DOMImplementation from './dom-implementation.js';
import Node from './node.js';
import ProcessingInstruction from './processing-instruction.js';
import Text from './text.js';
import TreeWalker from '../traversal/tree-walker.js';

import nonElementParentNode from './non-element-parent-node.js';
import parentNode from './parent-node.js';

import { adopt, getDoctype, getDocumentElement } from '../algorithms/document.js';
import { createAnElement, createAnElementNS } from '../algorithms/element.js';
import { validateAndExtract } from '../algorithms/namespace.js';
import { clone, getElementsWithClassNames, getElementsWithNamespace, getElementsWithQualifiedName } from '../algorithms/node.js';

import errors from '../../errors.js';
import regex from '../../regex.js';
import symbols from '../../symbols.js';


export default class Document extends Node {
	constructor() {
		super();
		Object.defineProperties(this, {
			[symbols.contentType]: {writable: true, value: 'application/xml'},
			[symbols.DOMImplementation]: {writable: true, value: new DOMImplementation()},
			[symbols.origin]: {writable: true, value: Symbol('null')},
			[symbols.type]: {writable: true, value: 'xml'},
			[symbols.URL]: {writable: true,	value: new URL('about:blank')},
			[symbols.window]: {writable: true, value: undefined}
		});

		this[symbols.nodeDocument] = this;
		this[symbols.DOMImplementation][symbols.nodeDocument] = this;
	}


	static #interfaces = new Set(['EventTarget', 'Node', 'Document']);
	get [symbols.interfaces]() {
		return this.constructor.#interfaces;
	}

	get [symbols.encoding]() {
		return 'utf-8';
	}

	get [symbols.mode]() {
		return 'no-quirks';
	}


	get getRootNode() {
		return function(options) {
			return this;
		};
	}
	set getRootNode(value) {
		return errors.readOnly('getRootNode', value);
	}

	get nodeName() {
		return '#document';
	}
	set nodeName(value) {
		return errors.readOnly('nodeName', value);
	}

	get nodeType() {
		return this.constructor.DOCUMENT_NODE;
	}
	set nodeType(value) {
		return errors.readOnly('nodeType', value);
	}

	get nodeValue() {
		return null;
	}
	set nodeValue(value) {
		// Do nothing
	}

	get ownerDocument() {
		return null;
	}
	set ownerDocument(value) {
		return errors.readOnly('ownerDocument', value);
	}

	get parentElement() {
		return null;
	}
	set parentElement(value) {
		return errors.readOnly('parentElement', value);
	}

	get parentNode() {
		return null;
	}
	set parentNode(value) {
		return errors.readOnly('parentNode', value);
	}

	get textContent() {
		return null;
	}
	set textContent(value) {
		// Do nothing
	}


	get adoptNode() {
		return function(node) {
			if(node[symbols.interfaces].has('Document')) {
				throw new Error(`DOMException: NotSupportedError. Can not adopt a document.`);
			}

			adopt(node, this);

			return node;
		};
	}
	set adoptNode(value) {
		return errors.readOnly('adoptNode', value);
	}

	get append() {
		return function(...nodes) {
			return parentNode.append(nodes);
		};
	}
	set append(value) {
		return errors.readOnly('append', value);
	}

	get characterSet() {
		return this[symbols.encoding];
	}
	set characterSet(value) {
		return errors.readOnly('characterSet', value);
	}

	get charset() {
		return this[symbols.encoding];
	}
	set charset(value) {
		return errors.readOnly('charset', value);
	}

	get children() {
		return parentNode.children();
	}
	set children(value) {
		return errors.readOnly('children', value);
	}

	get childElementCount() {
		return parentNode.childElementCount();
	}
	set childElementCount(value) {
		return errors.readOnly('childElementCount', value);
	}

	get compatMode() {
		return 'CSS1Compat';
	}
	set compatMode(value) {
		return errors.readOnly('compatMode', value);
	}

	get contentType() {
		return this[symbols.contentType];
	}
	set contentType(value) {
		return errors.readOnly('contentType', value);
	}

	get createAttribute() {
		return function(localName) {
			if(!regex.name.test(localName)) {
				throw new Error(`DOMException: InvalidCharacterError. ${localName} is not a valid attribute name.`);
			}

			if(this[symbols.type] !== 'xml') {
				localName = localName.toLowerCase();
			}

			const attribute = new Attr();

			attribute[symbols.nodeDocument] = this;
			attribute[symbols.localName] = localName;

			return attribute;
		};
	}
	set createAttribute(value) {
		return errors.readOnly('createAttribute', value);
	}

	get createAttributeNS() {
		return function(passedInNamespace, qualifiedName) {
			const [namespace, prefix, localName] = validateAndExtract(passedInNamespace, qualifiedName);
			const attribute = new Attr();

			attribute[symbols.nodeDocument] = this;
			attribute[symbols.localName] = localName;
			attribute[symbols.namespace] = namespace;
			attribute[symbols.namespacePrefix] = prefix;

			return attribute;
		};
	}
	set createAttributeNS(value) {
		return errors.readOnly('createAttributeNS', value);
	}

	get createCDATASection() {
		return function(data) {
			if(this[symbols.type] !== 'xml') {
				throw new Error(`DOMException: NotSupportedError. Can only create a CDATASection on XML documents.`);
			}

			if(data.includes(']]>')) {
				throw new Error(`DOMException: InvalidCharacterError. CDATA values can not contain the string ']]>'.`);
			}

			const CDATA = new CDATASection();

			CDATA[symbols.nodeDocument] = this;
			CDATA[symbols.data] = data;

			return CDATA;
		};
	}
	set createCDATASection(value) {
		return errors.readOnly('createCDATASection', value);
	}

	get createComment() {
		return function(data) {
			const comment = new Comment();

			comment[symbols.nodeDocument] = this;
			comment[symbols.data] = data;

			return comment;
		};
	}
	set createComment(value) {
		return errors.readOnly('createComment', value);
	}

	get createDocumentFragment() {
		return function() {
			const documentFragment = new DocumentFragment();

			documentFragment[symbols.nodeDocument] = this;

			return documentFragment;
		};
	}
	set createDocumentFragment(value) {
		return errors.readOnly('createDocumentFragment', value);
	}

	get createElement() {
		return function(localName, options) {
			if(!regex.name.test(localName)) {
				throw new Error(`DOMException: InvalidCharacterError. ${localName} is not a valid element name.`);
			}

			if(this[symbols.type] !== 'xml') {
				localName = localName.toLowerCase();
			}

			let is = null;
			if(options && 'is' in options) {
				is = options.is;
			}

			let namespace = null;
			if(this[symbols.type] !== 'xml' || this[symbols.contentType] === 'application/xhtml+xml') {
				namespace = 'http://www.w3.org/1999/xhtml';
			}

			return createAnElement(this, localName, namespace, null, is, true);
		};
	}
	set createElement(value) {
		return errors.readOnly('createElement', value);
	}

	get createElementNS() {
		return function(namespace, qualifiedName, options) {
			return createAnElementNS(this, namespace, qualifiedName, options);
		};
	}
	set createElementNS(value) {
		return errors.readOnly('createElementNS', value);
	}

	get createEvent() {
		return function(eventInterface) {
			return errors.unsupported('createEvent');
		};
	}
	set createEvent(value) {
		return errors.readOnly('createEvent', value);
	}

	get createNodeIterator() {
		return function(root, whatToShow, filter) {
			return errors.unsupported('createNodeIterator');
		};
	}
	set createNodeIterator(value) {
		return errors.readOnly('createNodeIterator', value);
	}

	get createProcessingInstruction() {
		return function(target, data) {
			if(!regex.name.test(target)) {
				throw new Error(`DOMException: InvalidCharacterError. ${target} is not a valid element name.`);
			}

			if(data.includes('?>')) {
				throw new Error(`DOMException: InvalidCharacterError. Processing instruction values can not contain the string '?>'.`);
			}

			const processingInstruction = new ProcessingInstruction();

			processingInstruction[symbols.nodeDocument] = this;
			processingInstruction[symbols.data] = data;
			processingInstruction[symbols.target] = target;

			return processingInstruction;
		};
	}
	set createProcessingInstruction(value) {
		return errors.readOnly('createProcessingInstruction', value);
	}

	get createRange() {
		return function() {
			return errors.unsupported('createRange');
		};
	}
	set createRange(value) {
		return errors.readOnly('createRange', value);
	}

	get createTextNode() {
		return function(data) {
			const textNode = new Text();

			textNode[symbols.nodeDocument] = this;
			textNode[symbols.data] = data;

			return textNode;
		};
	}
	set createTextNode(value) {
		return errors.readOnly('createTextNode', value);
	}

	get createTreeWalker() {
		return function(root, whatToShow, filter) {
			const walker = new TreeWalker();

			walker[symbols.root] = root;
			walker[symbols.current] = root;
			walker[symbols.whatToShow] = whatToShow;
			walker[symbols.filter] = filter;

			return walker;
		};
	}
	set createTreeWalker(value) {
		return errors.readOnly('createTreeWalker', value);
	}

	get doctype() {
		return getDoctype(this);
	}
	set doctype(value) {
		return errors.readOnly('doctype', value);
	}

	get documentElement() {
		return getDocumentElement(this);
	}
	set documentElement(value) {
		return errors.readOnly('documentElement', value);
	}

	get documentURI() {
		return this[symbols.URL].href;
	}
	set documentURI(value) {
		return errors.readOnly('documentURI', value);
	}

	get firstElementChild() {
		return parentNode.firstElementChild();
	}
	set firstElementChild(value) {
		return errors.readOnly('firstElementChild', value);
	}

	get getElementsByClassName() {
		return function(classNames) {
			return getElementsWithClassNames(classNames, this);
		};
	}
	set getElementsByClassName(value) {
		return errors.readOnly('getElementsByClassName', value);
	}

	get getElementsByTagName() {
		return function(qualifiedName) {
			return getElementsWithQualifiedName(qualifiedName, this);
		};
	}
	set getElementsByTagName(value) {
		return errors.readOnly('getElementsByTagName', value);
	}

	get getElementsByTagNameNS() {
		return function(namespace, localName) {
			return getElementsWithNamespace(namespace, localName, this);
		};
	}
	set getElementsByTagNameNS(value) {
		return errors.readOnly('getElementsByTagNameNS', value);
	}

	get implementation() {
		return this[symbols.DOMImplementation];
	}
	set implementation(value) {
		return errors.readOnly('implementation', value);
	}

	get importNode() {
		return function(node, deep) {
			if(node[symbols.interfaces].has('Document')) {
				throw new Error(`DOMException: NotSupportedError. Can not import a document.`);
			}
			else {
				return clone(node, deep);
			}
		};
	}
	set importNode(value) {
		return errors.readOnly('importNode', value);
	}

	get inputEncoding() {
		return this[symbols.encoding];
	}
	set inputEncoding(value) {
		return errors.readOnly('inputEncoding', value);
	}

	get lastElementChild() {
		return parentNode.lastElementChild();
	}
	set lastElementChild(value) {
		return errors.readOnly('lastElementChild', value);
	}

	get getElementById() {
		return function(elementId) {
			return nonElementParentNode.getElementById(elementId);
		};
	}
	set getElementById(value) {
		return errors.readOnly('getElementById', value);
	}

	get prepend() {
		return function(...nodes) {
			return parentNode.prepend(nodes);
		};
	}
	set prepend(value) {
		return errors.readOnly('prepend', value);
	}

	get querySelector() {
		return function(selectors) {
			return parentNode.querySelector(selectors);
		};
	}
	set querySelector(value) {
		return errors.readOnly('querySelector', value);
	}

	get querySelectorAll() {
		return function(selectors) {
			return parentNode.querySelectorAll(selectors);
		};
	}
	set querySelectorAll(value) {
		return errors.readOnly('querySelectorAll', value);
	}

	get replaceChildren() {
		return function(...nodes) {
			return parentNode.replaceChildren(nodes);
		};
	}
	set replaceChildren(value) {
		return errors.readOnly('replaceChildren', value);
	}

	get URL() {
		return this[symbols.URL].href;
	}
	set URL(value) {
		return errors.readOnly('URL', value);
	}
}