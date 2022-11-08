// https://dom.spec.whatwg.org/#interface-element

import Node from './node.js';

import childNode from './child-node.js';
import nonDocumentTypeChildNode from './non-document-type-child-node.js';
import parentNode from './parent-node.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class Element extends Node {
	constructor() {
		super();
		Object.defineProperties(this, {
			[symbols.attributes]: {writable: true,	value: new Map()},
			[symbols.hasImpliedCloseTag]: {writable: true,	value: false},

			[symbols.namespace]: {writable: true,	value: undefined},
			[symbols.namespacePrefix]: {writable: true,	value: undefined},
			[symbols.localName]: {writable: true,	value: undefined},
			[symbols.is]: {writable: true,	value: undefined},

			[symbols.HTMLUppercasedQualifiedName]: {get: function() {
				return 'TODO: https://dom.spec.whatwg.org/#element-html-uppercased-qualified-name'
			}}
		});
	}


	static #interfaces = new Set(['Node', 'Element']);
	get [symbols.interfaces]() {
		return this.constructor.#interfaces;
	}


	get after() {
		return function(...nodes) {
			return childNode.after(nodes);
		}
	}
	set after(value) {
		return errors.readOnly('after', value);
	}

	get append() {
		return function(...nodes) {
			return parentNode.append(nodes);
		}
	}
	set append(value) {
		return errors.readOnly('append', value);
	}

	get before() {
		return function(...nodes) {
			return childNode.before(nodes);
		}
	}
	set before(value) {
		return errors.readOnly('before', value);
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

	get firstElementChild() {
		return parentNode.firstElementChild();
	}
	set firstElementChild(value) {
		return errors.readOnly('firstElementChild', value);
	}

	get lastElementChild() {
		return parentNode.lastElementChild();
	}
	set lastElementChild(value) {
		return errors.readOnly('lastElementChild', value);
	}

	get nextElementSibling() {
		return nonDocumentTypeChildNode.nextElementSibling();
	}
	set nextElementSibling(value) {
		return errors.readOnly('nextElementSibling', value);
	}

	get nodeType() {
		return this.constructor.ELEMENT_NODE;
	}
	set nodeType(value) {
		return errors.readOnly('nodeType', value);
	}

	get prepend() {
		return function(...nodes) {
			return parentNode.prepend(nodes);
		}
	}
	set prepend(value) {
		return errors.readOnly('prepend', value);
	}

	get previousElementSibling() {
		return nonDocumentTypeChildNode.previousElementSibling();
	}
	set previousElementSibling(value) {
		return errors.readOnly('previousElementSibling', value);
	}

	get querySelector() {
		return function(selectors) {
			return parentNode.querySelector(selectors);
		}
	}
	set querySelector(value) {
		return errors.readOnly('querySelector', value);
	}

	get querySelectorAll() {
		return function(selectors) {
			return parentNode.querySelectorAll(selectors);
		}
	}
	set querySelectorAll(value) {
		return errors.readOnly('querySelectorAll', value);
	}

	get remove() {
		return function() {
			return childNode.remove();
		}
	}
	set remove(value) {
		return errors.readOnly('remove', value);
	}

	get replaceChildren() {
		return function(...nodes) {
			return parentNode.replaceChildren(nodes);
		}
	}
	set replaceChildren(value) {
		return errors.readOnly('replaceChildren', value);
	}

	get replaceWith() {
		return function(...nodes) {
			return childNode.replaceWith(nodes);
		}
	}
	set replaceWith(value) {
		return errors.readOnly('replaceWith', value);
	}
}