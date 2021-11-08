import symbols from '../../symbols.js';


export default {
	createAnElement, // TODO
	createAnElementNS, // TODO
	getHTMLUppercasedQualifiedName,
	getQualifiedName,
	locateNamespacePrefix
}


// https://dom.spec.whatwg.org/#concept-create-element
export function createAnElement() {
	// TODO
}

// https://dom.spec.whatwg.org/#internal-createelementns-steps
export function createAnElementNS() {
	// TODO
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