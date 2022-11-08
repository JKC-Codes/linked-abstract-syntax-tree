import symbols from '../../symbols.js';


export default {
	lookUpACustomElementDefinition
}


// https://html.spec.whatwg.org/multipage/custom-elements.html#look-up-a-custom-element-definition
export function lookUpACustomElementDefinition(document, namespace, localName, is) {
	if(namespace !== 'http://www.w3.org/1999/xhtml') {
		return null;
	}

	// Skipping: If document's browsing context is null, return null.

	let registry = document[symbols.window][symbols.customElementRegistry];

	if(registry.has(localName)) {
		const customElementDefinition = registry.get(localName);

		if(customElementDefinition.localName === localName) {
			return customElementDefinition;
		}
	}

	if(registry.has(is)) {
		const customElementDefinition = registry.get(is);

		if(customElementDefinition.localName === localName) {
			return customElementDefinition;
		}
	}

	return null;
}