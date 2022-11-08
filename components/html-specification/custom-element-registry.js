// https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-api

import { getElementClass } from '../elements.js';
import regex from '../regex.js';

import errors from '../errors.js';
import symbols from '../symbols.js';


export default class CustomElementRegistry {
	#customElementDefinitions = new Map(
		/*
			name: {
				name,
				localName,
				constructor
			}
		*/
	);

	static get define() {
		return function(name, constructor, options) {
			if(typeof constructor !== 'function') {
				throw new TypeError(`A custom element definition must be a class. Recieved ${typeof constructor}`);
			}

			if(!regex.potentialCustomElementName.test(name)) {
				throw new Error(`DOMException: SyntaxError. ${name} is not a valid custom element name`);
			}

			for(const definition of this.#customElementDefinitions.keys()) {
				if(definition.name === name) {
					throw new Error(`DOMException: NotSupportedError. There is already a custom element registered with the name: ${name}`);
				}

				if(definition.constructor === constructor) {
					throw new Error(`DOMException: NotSupportedError. There is already a custom element registered with the same class`);
				}
			}

			let localName = name;
			let classExtends = options.extends || null;

			if(classExtends !== null) {
				if(regex.potentialCustomElementName.test(classExtends)) {
					throw new Error(`DOMException: NotSupportedError. Can not extend a custom element`);
				}

				if(getElementClass(classExtends, 'http://www.w3.org/1999/xhtml')[symbols.interfaces].has('HTMLUnknownElement')) {
					throw new Error(`DOMException: NotSupportedError. Can not extend an unknown element`);
				}

				localName = classExtends;
			}

			this.#customElementDefinitions.set(name, {name, localName, constructor});
		}
	}
	static set define(value) {
		return errors.readOnly('define', value);
	}

	static get get() {
		return function(name) {
			if(this.#customElementDefinitions.has(name)) {
				return this.#customElementDefinitions.get(name).constructor;
			}
			else {
				return undefined;
			}
		}
	}
	static set get(value) {
		return errors.readOnly('get', value);
	}

	static get upgrade() {
		return errors.unsupported('upgrade');
	}
	static set upgrade(value) {
		return errors.readOnly('upgrade', value);
	}

	static get whenDefined() {
		return errors.unsupported('whenDefined');
	}
	static set whenDefined(value) {
		return errors.readOnly('whenDefined', value);
	}
}