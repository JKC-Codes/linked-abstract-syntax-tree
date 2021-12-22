// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement

import Element from '../dom-specification/nodes/interfaces/element.js';

import symbols from '../symbols.js';


export default class HTMLElement extends Element {
	constructor(ownerDocument, tagName) {
		super(ownerDocument, tagName);
	}

	static [symbols.interfaces] = new Set(['Node', 'Element', 'HTMLElement']);

	blur() {}
	// other methods
}