// https://dom.spec.whatwg.org/#documenttype

import Node from './node.js';

import childNode from './child-node.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class DocumentType extends Node {
	constructor() {
		Object.defineProperties(this, {
			[symbols.name]: {writable: true, value: undefined},
			[symbols.publicID]: {writable: true, value: ''},
			[symbols.systemID]: {writable: true, value: ''},
		});
	}


	static #interfaces = new Set(['EventTarget', 'Node', 'DocumentType']);
	get [symbols.interfaces]() {
		return this.constructor.#interfaces;
	}

	get nodeName() {
		return this[symbols.name];
	}
	set nodeName(value) {
		return errors.readOnly('nodeName', value);
	}

	get nodeType() {
		return this.constructor.DOCUMENT_TYPE_NODE;
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

	get textContent() {
		return null;
	}
	set textContent(value) {
		// Do nothing
	}


	get after() {
		return function(...nodes) {
			return childNode.after(nodes);
		}
	}
	set after(value) {
		return errors.readOnly('after', value);
	}

	get before() {
		return function(...nodes) {
			return childNode.before(nodes);
		}
	}
	set before(value) {
		return errors.readOnly('before', value);
	}

	get name() {
		return this[symbols.name];
	}
	set name(value) {
		return errors.readOnly('name', value);
	}

	get publicId() {
		return this[symbols.publicID];
	}
	set publicId(value) {
		return errors.readOnly('publicId', value);
	}

	get remove() {
		return function() {
			return childNode.remove();
		}
	}
	set remove(value) {
		return errors.readOnly('remove', value);
	}

	get replaceWith() {
		return function(...nodes) {
			return childNode.replaceWith(nodes);
		}
	}
	set replaceWith(value) {
		return errors.readOnly('replaceWith', value);
	}

	get systemId() {
		return this[symbols.systemID];
	}
	set systemId(value) {
		return errors.readOnly('systemId', value);
	}
}