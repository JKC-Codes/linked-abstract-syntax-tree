import { attributeAppend } from './attribute.js';
import { createAnElement, getQualifiedName } from './element.js';
import { append, replaceAll } from './mutation.js';
import { walkChildren, walkDescendants, walkInclusiveDescendants } from './tree.js';

import symbols from '../../symbols.js';


export default {
	clone,
	convertNodesIntoANode,
	getElementsWithClassNames,
	getElementsWithNamespace,
	getElementsWithQualifiedName,
	getEquality,
	getLength,
	locateNamespace,
	stringReplaceAll
}


// https://dom.spec.whatwg.org/#concept-node-clone
export function clone(node, cloneChildren = false) {
	if(document === undefined) {
		document = node[symbols.nodeDocument];
	}

	function getClone(node, document, cloneChildren) {
		let copy;

		if(node[symbols.interfaces].has('Element')) {
			copy = createAnElement(
				document,
				node[symbols.localName],
				node[symbols.namespace],
				node[symbols.namespacePrefix],
				node[symbols.isValue],
				false
			);
			copy[symbols.hasImpliedCloseTag] = node[symbols.hasImpliedCloseTag];

			for(const attributeNode of node[symbols.attributes].values()) {
				attributeAppend(getClone(attributeNode), copy);
			}
		}
		else {
			copy = new node.constructor();

			if(node[symbols.interfaces].has('Document')) {
				// copy[symbols.encoding] = node[symbols.encoding];
				copy[symbols.contentType] = node[symbols.contentType];
				copy[symbols.URL] = node[symbols.URL];
				copy[symbols.origin] = node[symbols.origin];
				copy[symbols.type] = node[symbols.type];
				// copy[symbols.mode] = node[symbols.mode];
			}
			else if(node[symbols.interfaces].has('DocumentType')) {
				copy[symbols.name] = node[symbols.name];
				copy[symbols.publicID] = node[symbols.publicID];
				copy[symbols.systemID] = node[symbols.systemID];
			}
			else if(node[symbols.interfaces].has('Attr')) {
				copy[symbols.namespace] = node[symbols.namespace];
				copy[symbols.namespacePrefix] = node[symbols.namespacePrefix];
				copy[symbols.localName] = node[symbols.localName];
				copy[symbols.value] = node[symbols.value];
				copy[symbols.quotes] = node[symbols.quotes];
			}
			else if(node[symbols.interfaces].has('Text') || node[symbols.interfaces].has('Comment')) {
				copy[symbols.data] = node[symbols.data];
			}
			else if(node[symbols.interfaces].has('ProcessingInstruction')) {
				copy[symbols.target] = node[symbols.target];
				copy[symbols.data] = node[symbols.data];
			}
		}

		if(copy[symbols.interfaces].has('Document')) {
			copy[symbols.nodeDocument] = copy;
			document = copy;
		}
		else {
			copy[symbols.nodeDocument] = document;
		}

		const cloningSteps = node[symbols.cloningSteps];
		if(cloningSteps !== undefined) {
			cloningSteps(copy, node, document, cloneChildren);
		}

		return copy;
	}

	const rootCopy = getClone(node, document, cloneChildren);

	if(cloneChildren === true) {
		const childrenIterator = walkDescendants(node);
		let descendant = childrenIterator.next();
		let cloneParent = rootCopy;

		while(descendant.done === false) {
			append(getClone(descendant.value), cloneParent);

			let lastDescendant = descendant.value;
			descendant = childrenIterator.next();

			if(descendant.done === true) {
				break;
			}
			else if(lastDescendant[symbols.nextSibling] === descendant.value) {
				continue;
			}
			else if(lastDescendant[symbols.firstChild] === descendant.value) {
				cloneParent = cloneParent[symbols.lastChild];
			}
			else {
				do {
					cloneParent = cloneParent[symbols.parent];
					lastDescendant = lastDescendant[symbols.parent];
				}
				while(lastDescendant[symbols.nextSibling] !== descendant.value);
			}
		}
	}

	return rootCopy;
}

// https://dom.spec.whatwg.org/#converting-nodes-into-a-node
export async function convertNodesIntoANode(nodes, document) {
	let DocumentFragment;
	let Text;
	let node = null;

	for(let i = 0, l = nodes.length; i < l; i++) {
		if(typeof nodes[i] === 'string') {
			if(Text === undefined) {
				Text = await import('../nodes/text.js');
			}

			const text = new Text();
			text[symbols.data] = nodes[i];
			text[symbols.nodeDocument] = document;
			nodes[i] = text;
		}
	}

	if(nodes.length === 1) {
		node = nodes[0];
	}
	else {
		if(DocumentFragment === undefined) {
			DocumentFragment = await import('../nodes/document-fragment.js');
		}

		node = new DocumentFragment();
		node[symbols.nodeDocument] = document;

		for(const currentNode of nodes) {
			append(currentNode, node);
		}
	}

	return node;
}

// https://dom.spec.whatwg.org/#concept-getelementsbyclassname
export function getElementsWithClassNames(classNames, root) {
	const classes = new Set(classNames.split(/\s+/));

	if(classes.size === 0) {
		return [];
	}
	else {
		const HTMLCollection = [];

		for(const descendant of walkDescendants(root)) {
			const isElement = descendant[symbols.interfaces].has('Element');

			if(isElement) {
				const classList = new Set(descendant[symbols.attributes].get('class').split(/\s+/));

				if(classes.size === classList.size) {
					let classesMatch = true;

					for(const className of classes) {
						if(!classList.has(className)) {
							classesMatch = false;
							break;
						}
					}

					if(classesMatch === true) {
						HTMLCollection.push(descendant);
					}
				}
			}
		}

		return HTMLCollection;
	}
}

// https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
export function getElementsWithNamespace(namespace, localName, root) {
	const HTMLCollection = [];

	if(namespace === '') {
		namespace = null;
	}

	if(namespace === '*' && localName === '*') {
		for(const descendant of walkDescendants(root)) {
			if(descendant[symbols.interfaces].has('Element')) {
				HTMLCollection.push(descendant);
			}
		}
	}
	else if(namespace === '*') {
		for(const descendant of walkDescendants(root)) {
			const isElement = descendant[symbols.interfaces].has('Element');

			if(isElement && descendant[symbols.localName] === localName) {
				HTMLCollection.push(descendant);
			}
		}
	}
	else if(localName === '*') {
		for(const descendant of walkDescendants(root)) {
			const isElement = descendant[symbols.interfaces].has('Element');

			if(isElement && descendant[symbols.namespace] === namespace) {
				HTMLCollection.push(descendant);
			}
		}
	}
	else {
		for(const descendant of walkDescendants(root)) {
			const isElement = descendant[symbols.interfaces].has('Element');

			if(
				isElement &&
				descendant[symbols.namespace] === namespace &&
				descendant[symbols.localName] === localName
			) {
				HTMLCollection.push(descendant);
			}
		}
	}

	return HTMLCollection;
}

// https://dom.spec.whatwg.org/#concept-getelementsbytagname
export function getElementsWithQualifiedName(qualifiedName, root) {
	const HTMLCollection = [];

	if(qualifiedName === '*') {
		for(const descendant of walkDescendants(root)) {
			if(descendant[symbols.interfaces].has('Element')) {
				HTMLCollection.push(descendant);
			}
		}
	}
	else if(root[symbols.nodeDocument][symbols.type] !== 'xml') {
		for(const descendant of walkDescendants(root)) {
			if(descendant[symbols.interfaces].has('Element')) {
				const isHTMLNamespace = descendant[symbols.namespace] === 'http://www.w3.org/1999/xhtml';

				if(isHTMLNamespace) {
					qualifiedName = qualifiedName.toLowerCase();
				}

				if(getQualifiedName(descendant) === qualifiedName) {
					HTMLCollection.push(descendant);
				}
			}
		}
	}
	else {
		for(const descendant of walkDescendants(root)) {
			const isElement = descendant[symbols.interfaces].has('Element');

			if(isElement && getQualifiedName(descendant) === qualifiedName) {
				HTMLCollection.push(descendant);
			}
		}
	}

	return HTMLCollection;
}

// https://dom.spec.whatwg.org/#concept-node-equals
export function getEquality(node_A, node_B) {
	if(node_A === node_B) {
		return true;
	}

	function equals(nodeA, nodeB) {
		const interfaceProperties = {
			DocumentType: [symbols.name, symbols.publicID, symbols.systemID],
			Element: [symbols.namespace, symbols.namespacePrefix, symbols.localName],
			Attr: [symbols.namespace, symbols.localName, symbols.value],
			ProcessingInstruction: [symbols.target, symbols.data],
			Text: [symbols.data],
			Comment: [symbols.data]
		};

		function haveDifferentProperties(interfaceName) {
			if(interfaceProperties[interfaceName] !== undefined) {
				for(const property of interfaceProperties[interfaceName]) {
					if(nodeA[property] !== nodeB[property]) {
						return true;
					}
				}

				if(nodeA[symbols.interfaces].has('Element') && nodeA[symbols.attributes].size !== nodeB[symbols.attributes].size) {
					return true;
				}
			}

			return false;
		}

		for(const interfaceName of nodeA[symbols.interfaces]) {
			if(!nodeB[symbols.interfaces].has(interfaceName) || haveDifferentProperties(interfaceName)) {
				return false;
			}
		}

		if(nodeA[symbols.interfaces].has('Element')) {
			for(const [attributeName, attributeNode] of nodeA[symbols.attributes]) {
				if(!nodeB[symbols.attributes].has(attributeName)) {
					return false;
				}
				else {
					for(const property of interfaceProperties['Attr']) {
						if(attributeNode[property] !== nodeB[symbols.attributes][attributeName][property]) {
							return false;
						}
					}
				}
			}
		}

		const nodeAIterator = walkChildren(nodeA);
		const nodeBIterator = walkChildren(nodeB);
		let nodeAIsDone = nodeAIterator.next().done;
		let nodeBIsDone = nodeBIterator.next().done;

		while(nodeAIsDone === false && nodeBIsDone === false) {
			nodeAIsDone = nodeAIterator.next().done;
			nodeBIsDone = nodeBIterator.next().done;
		}

		if(nodeAIsDone !== nodeBIsDone) {
			return false;
		}
	}

	const nodeAIterator = walkInclusiveDescendants(node_A);
	const nodeBIterator = walkInclusiveDescendants(node_B);
	let currentNodeA = nodeAIterator.next();
	let currentNodeB = nodeBIterator.next();

	while(true) {
		if(currentNodeA.done !== currentNodeB.done) {
			return false;
		}
		else if(currentNodeA.done === true) {
			break;
		}
		else if(equals(currentNodeA.value(), currentNodeB.value()) === false) {
			return false;
		}
		else {
			currentNodeA = nodeAIterator.next();
			currentNodeB = nodeBIterator.next();
		}
	}

	return true;
}

// https://dom.spec.whatwg.org/#concept-node-length
export function getLength(node) {
	const interfaces = node[symbols.interfaces];

	if(interfaces.has('DocumentType') || interfaces.has('Attr')) {
		return 0;
	}
	else if(interfaces.has('CharacterData')) {
		return node.data.length;
	}
	else {
		let childrenCount = 0;

		while(walkChildren(node).next().done !== true) {
			childrenCount++;
		}

		return childrenCount;
	}
}

// https://dom.spec.whatwg.org/#locate-a-namespace
export function locateNamespace(node, prefix) {
	const interfaces = node[symbols.interfaces];

	if(interfaces.has('Element')) {
		return locateElementNamespace(node, prefix);
	}
	else if(interfaces.has('Document')) {
		const documentElement = getDocumentElement(node);

		if(documentElement === null) {
			return null;
		}
		else {
			return locateElementNamespace(documentElement, prefix);
		}
	}
	else if(interfaces.has('DocumentType') || interfaces.has('DocumentFragment')) {
		return null;
	}
	else if(interfaces.has('Attr')) {
		if(node[symbols.element] === null) {
			return null;
		}
		else {
			return locateElementNamespace(node[symbols.element], prefix);
		}
	}
	else {
		const parentElement = getParentElement(node);

		if(parentElement === null) {
			return null;
		}
		else {
			return locateElementNamespace(parentElement, prefix);
		}
	}

	function locateElementNamespace(node, prefix) {
		let currentNode = node;

		while(true) {
			const result = locateParentElementNamespace(currentNode, prefix);

			if(result === undefined) {
				const parentElement = getParentElement(currentNode);

				if(parentElement === null) {
					return null;
				}
				else {
					currentNode = parentElement;
				}
			}
			else {
				return result;
			}
		}
	}

	function locateParentElementNamespace(currentNode, prefix) {
		if(currentNode[symbols.namespace] !== null && currentNode[symbols.namespacePrefix] === prefix) {
			return currentNode[symbols.namespace];
		}
		else {
			for(const attribute of currentNode[symbols.attributes].values()) {
				if(attribute[symbols.namespace] === 'http://www.w3.org/2000/xmlns/' &&
					((
						attribute[symbols.namespacePrefix] === 'xmlns' &&
						attribute[symbols.localName] === prefix
					) ||
					(
						prefix === null &&
						attribute[symbols.namespacePrefix] === null &&
						attribute[symbols.localName] === 'xmlns'
					))
				) {
					return attribute[symbols.value] !== '' ? attribute[symbols.value] : null;
				}
			}
		}
	}
}

// https://dom.spec.whatwg.org/#string-replace-all
export async function stringReplaceAll(string, parent) {
	let node = null;

	if(string !== '') {
		const Text = await import('../nodes/text.js');
		node = new Text();
		node[symbols.data] = string;
		node[symbols.nodeDocument] = parent[symbols.nodeDocument];
	}

	replaceAll(node, parent);
}