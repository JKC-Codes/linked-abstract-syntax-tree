import { walkDescendants } from '../../dom-specification/algorithms/tree.js';

import symbols from '../../symbols.js';


export default {
	getDocumentBaseURL
}


// https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url
export function getDocumentBaseURL(document) {
	for(const descendant of walkDescendants(document)) {
		if(
			descendant[symbols.interfaces].has('Element') &&
			descendant[symbols.localName] === 'base' &&
			descendant[symbols.attributes].has('href')
		) {
			return descendant[symbols.frozenBaseURL];
		}
	}

	return document[symbols.URL];
}