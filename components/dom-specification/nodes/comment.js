// https://dom.spec.whatwg.org/#interface-comment

import CharacterData from './character-data.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class Comment extends CharacterData {
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