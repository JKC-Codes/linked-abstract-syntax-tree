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
}