// https://dom.spec.whatwg.org/#interface-processinginstruction

import CharacterData from './character-data.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class ProcessingInstruction extends CharacterData {
	constructor() {
	}


	get foo() {
		return function() {
		};
	}
	set foo(value) {
		return errors.readOnly('foo', value);
	}
}