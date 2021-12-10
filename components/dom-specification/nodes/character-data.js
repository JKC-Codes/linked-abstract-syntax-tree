// https://dom.spec.whatwg.org/#interface-characterdata

import Node from './node.js';

import childNode from './child-node.js';
import nonDocumentTypeChildNode from './non-document-type-child-node.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class CharacterData extends Node {
	constructor() {
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

	get nextElementSibling() {
		return nonDocumentTypeChildNode.nextElementSibling();
	}
	set nextElementSibling(value) {
		return errors.readOnly('nextElementSibling', value);
	}

	get previousElementSibling() {
		return nonDocumentTypeChildNode.previousElementSibling();
	}
	set previousElementSibling(value) {
		return errors.readOnly('previousElementSibling', value);
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
}