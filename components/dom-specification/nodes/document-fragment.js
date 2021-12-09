// https://dom.spec.whatwg.org/#interface-documentfragment

import Node from './node.js';

import nonElementParentNode from './non-element-parent-node.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class DocumentFragment extends Node {
	constructor() {
	}


	get append() {
		return function(...nodes) {
			return parentNode.append(nodes);
		}
	}
	set append(value) {
		return errors.readOnly('append', value);
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

	get getElementById() {
		return function(elementId) {
			return nonElementParentNode.getElementById(elementId);
		}
	}
	set getElementById(value) {
		return errors.readOnly('getElementById', value);
	}

	get prepend() {
		return function(...nodes) {
			return parentNode.prepend(nodes);
		}
	}
	set prepend(value) {
		return errors.readOnly('prepend', value);
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

	get replaceChildren() {
		return function(...nodes) {
			return parentNode.replaceChildren(nodes);
		}
	}
	set replaceChildren(value) {
		return errors.readOnly('replaceChildren', value);
	}
}