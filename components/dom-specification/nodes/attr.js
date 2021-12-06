// https://dom.spec.whatwg.org/#attr

import Node from './node.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class Attr extends Node {
	constructor() {
		super();
		Object.defineProperties(this, {
			[symbols.namespace]: {writable: true,	value: null},
			[symbols.namespacePrefix]: {writable: true,	value: null},
			[symbols.localName]: {writable: true,	value: 'TODO'},
			[symbols.value]: {writable: true,	value: null},
			[symbols.element]: {writable: true,	value: 'TODO'},

			[symbols.qualifiedName]: {get: function() {
				return 'TODO: https://dom.spec.whatwg.org/#concept-attribute-qualified-name'
			}}
		});
	}


	static #interfaces = new Set(['Node', 'Element']);
	get [symbols.interfaces]() {
		return this.constructor.#interfaces;
	}

	get nodeType() {
		return this.constructor.ELEMENT_NODE;
	}
	set nodeType(value) {
		return errors.readOnly('nodeType', value);
	}
}