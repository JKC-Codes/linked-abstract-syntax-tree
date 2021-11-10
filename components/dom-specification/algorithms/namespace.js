import { qName } from '../../regex.js';


export default {
	validate,
	validateAndExtract
}


// https://dom.spec.whatwg.org/#validate
export function validate(qualifiedName) {
	if(!qName.test(qualifiedName)) {
		throw new Error(`DOMException: InvalidCharacterError. QualifiedName '${qualifiedName}' is not formatted correctly.`);
	}
}

// https://dom.spec.whatwg.org/#validate-and-extract
export function validateAndExtract(namespace, qualifiedName) {
	validate(qualifiedName);

	if(namespace === '') {
		namespace = null;
	}

	let prefix = null;
	let localName = qualifiedName;

	if(qualifiedName.includes(':')) {
		[prefix, localName] = qualifiedName.split(':');
	}

	if(prefix !== null && namespace === null) {
		throw new Error(`DOMException: NamespaceError. Cannot have a prefix without a namespace (${qualifiedName}).`);
	}

	if(prefix === 'xml' && namespace !== 'http://www.w3.org/XML/1998/namespace') {
		throw new Error(`DOMException: NamespaceError. Can only use the 'xml' prefix in the XML namespace (${qualifiedName}).`);
	}

	if((qualifiedName === 'xmlns' || prefix === 'xmlns') && namespace !== 'http://www.w3.org/2000/xmlns/') {
		throw new Error(`DOMException: NamespaceError. Can only use the 'xmlns' prefix in the XMLNS namespace (${qualifiedName}).`);
	}

	if(namespace === 'http://www.w3.org/2000/xmlns/' && qualifiedName !== 'xmlns' && prefix !== 'xmlns') {
		throw new Error(`DOMException: NamespaceError. Can not use a non-xmlns prefix in the XMLNS namespace (${qualifiedName}).`);
	}

	return [namespace, prefix, localName];
}