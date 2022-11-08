import { getElementClass } from '../../elements.js';
import { lookUpACustomElementDefinition } from '../../html-specification/algorithms/element.js';
import { validateAndExtract } from './namespace.js';

import symbols from '../../symbols.js';


export default {
	createAnElement,
	createAnElementNS,
	getHTMLUppercasedQualifiedName,
	getQualifiedName,
	locateNamespacePrefix
}


// https://dom.spec.whatwg.org/#concept-create-element
export function createAnElement(document, localName, namespace, prefix = null, is = null, synchronousCustomElements = false) {
	const definition = lookUpACustomElementDefinition(document, namespace, localName, is);
	let result = null;

	if(definition !== null) {
		result = new definition();
	}
	else {
		result = new getElementClass(localName, namespace);
	}

	result[symbols.namespace] = namespace;
	result[symbols.namespacePrefix] = prefix;
	result[symbols.nodeDocument] = document;
	result[symbols.localName] = localName;
	result[symbols.is] = is;

	return result;
}

// https://dom.spec.whatwg.org/#internal-createelementns-steps
export function createAnElementNS(document, namespaceInput, qualifiedName, options) {
	let [namespace, prefix, localName] = validateAndExtract(namespaceInput, qualifiedName);
	let is = null;

	if(typeof options === 'object' && 'is' in options) {
		is = options.is;
	}

	return createAnElement(document, localName, namespace, prefix, is, true);
}

// https://dom.spec.whatwg.org/#element-html-uppercased-qualified-name
export function getHTMLUppercasedQualifiedName(element) {
	const isHTMLNamespace = element[symbols.namespace] === 'http://www.w3.org/1999/xhtml';
	const hasHTMLNodeDocument = element[symbols.nodeDocument][symbols.type] !== 'xml';
	let qualifiedName = getQualifiedName(element);

	if(isHTMLNamespace && hasHTMLNodeDocument) {
		qualifiedName = qualifiedName.toUpperCase();
	}

	return qualifiedName;
}

// https://dom.spec.whatwg.org/#concept-element-qualified-name
export function getQualifiedName(element) {
	if(element[symbols.namespacePrefix] === null) {
		return element[symbols.localName];
	}
	else {
		return element[symbols.namespacePrefix] + ':' + element[symbols.localName];
	}
}

// https://dom.spec.whatwg.org/#locate-a-namespace-prefix
export function locateNamespacePrefix(element, namespace) {
	let currentElement = element;

	while(true) {
		const result = getNamespacePrefix(currentElement, namespace);

		if(result === undefined) {
			const parentElement = getParentElement(currentElement);

			if(parentElement === null) {
				return null;
			}
			else {
				currentElement = parentElement;
			}
		}
		else {
			return result;
		}
	}

	function getNamespacePrefix(currentElement, namespace) {
		if(currentElement[symbols.namespace] === namespace && currentElement[symbols.namespacePrefix] !== null) {
			return currentElement[symbols.namespacePrefix];
		}
		else {
			for(const attribute of currentElement[symbols.attributes].values()) {
				if(attribute[symbols.namespacePrefix] === 'xmlns' && attribute[symbols.value] === namespace) {
					return attribute[symbols.localName];
				}
			}
		}
	}
}