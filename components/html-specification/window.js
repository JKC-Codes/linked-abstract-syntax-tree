// https://html.spec.whatwg.org/multipage/window-object.html#the-window-object

import CustomElementRegistry from './custom-element-registry.js';

import errors from '../errors.js';
import symbols from '../symbols.js';


export default class Window {
	constructor() {
		Object.defineProperties(this, {
			[symbols.associatedDocument]: {writable: true,	value: undefined},
			[symbols.customElementRegistry]: {writable: true,	value: new CustomElementRegistry()},
		});
	}


	get customElements() {
		return this[symbols.customElementRegistry];
	}
	set customElements(value) {
		return errors.readOnly('customElements', value);
	}

	get document() {
		return this[symbols.associatedDocument];
	}
	set document(value) {
		return errors.readOnly('document', value);
	}
}