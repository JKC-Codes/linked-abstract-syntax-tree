// https://dom.spec.whatwg.org/#interface-treewalker

import NodeFilter from './node-filter.js';

import { filter, traverseChildren, traverseSiblings } from '../algorithms/traversal.js';

import symbols from '../../symbols.js';


export default class TreeWalker {
	constructor(root, whatToShow = NodeFilter.SHOW_ALL, filter = null) {
		this[symbols.current] = root;
		this[symbols.filter] = filter;
		this[symbols.isActive] = false;
		this[symbols.root] = root;
		this[symbols.whatToShow] = whatToShow;
	}


	get currentNode() {
		return this[symbols.current];
	}
	set currentNode(value) {
		return this[symbols.current] = value;
	}

	get filter() {
		return this[symbols.filter];
	}
	set filter(value) {
		return errors.readOnly('filter', value);
	}

	get firstChild() {
		return function() {
			return traverseChildren(this, 'first');
		}
	}
	set firstChild(value) {
		return errors.readOnly('firstChild', value);
	}

	get lastChild() {
		return function() {
			return traverseChildren(this, 'last');
		}
	}
	set lastChild(value) {
		return errors.readOnly('lastChild', value);
	}

	get nextNode() {
		return function() {
			let node = this[symbols.current];
			let result = NodeFilter.FILTER_ACCEPT;

			while(true) {
				while(result !== NodeFilter.FILTER_REJECT && node[symbols.firstChild] !== null) {
					node = node[symbols.firstChild];
					result = filter(node, this);

					if(result === NodeFilter.FILTER_ACCEPT) {
						this[symbols.current] = node;
						return node;
					}
				}

				let sibling = null;
				let temporary = node;

				while(temporary !== null) {
					if(temporary === this[symbols.root]) {
						return null;
					}

					sibling = temporary[symbols.nextSibling];

					if(sibling !== null) {
						node = sibling;
						break;
					}

					temporary = temporary[symbols.parent];
				}

				result = filter(node, this);

				if(result === NodeFilter.FILTER_ACCEPT) {
					this[symbols.current] = node;
					return node;
				}
			}
		}
	}
	set nextNode(value) {
		return errors.readOnly('nextNode', value);
	}

	get nextSibling() {
		return function() {
			return traverseSiblings(this, 'next');
		}
	}
	set nextSibling(value) {
		return errors.readOnly('nextSibling', value);
	}

	get parentNode() {
		return function() {
			let node = this[symbols.current];

			while(node !== null && node !== this[symbols.root]) {
				node = node[symbols.parent];
				if((node !== null) && (filter(node, this) === NodeFilter.FILTER_ACCEPT)) {
					this[symbols.current] = node;
					return node;
				}
			}

			return null;
		}
	}
	set parentNode(value) {
		return errors.readOnly('parentNode', value);
	}

	get previousNode() {
		return function() {
			let node = this[symbols.current];

			while(node !== this[symbols.root]) {
				let sibling = node[symbols.previousSibling];

				while(sibling !== null) {
					node = sibling;
					let result = filter(node, this);

					while(result !== NodeFilter.FILTER_REJECT && node[symbols.lastChild] !== null) {
						node = node[symbols.lastChild];
						result = filter(node, this);
					}

					if(result === NodeFilter.FILTER_ACCEPT) {
						this[symbols.current] = node;
						return node;
					}

					sibling = node[symbols.previousSibling];
				}

				if(node === this[symbols.root] || node[symbols.parent] === null) {
					return null;
				}

				node = node[symbols.parent];

				if(filter(node, this) === NodeFilter.FILTER_ACCEPT) {
					this[symbols.current] = node;
					return node;
				}
			}

			return null;
		}
	}
	set previousNode(value) {
		return errors.readOnly('previousNode', value);
	}

	get previousSibling() {
		return function() {
			return traverseSiblings(this, 'previous');
		}
	}
	set previousSibling(value) {
		return errors.readOnly('previousSibling', value);
	}

	get root() {
		return this[symbols.root];
	}
	set root(value) {
		return errors.readOnly('root', value);
	}

	get whatToShow() {
		return this[symbols.whatToShow];
	}
	set whatToShow(value) {
		return errors.readOnly('whatToShow', value);
	}
}