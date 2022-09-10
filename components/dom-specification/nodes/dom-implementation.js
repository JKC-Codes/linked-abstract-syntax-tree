// https://dom.spec.whatwg.org/#domimplementation

import Document from './document.js';
import DocumentType from './document-type.js';
import Text from './text.js';

import { createAnElement, createAnElementNS } from '../algorithms/element.js';
import { append } from '../algorithms/mutation.js';
import { validate } from '../algorithms/namespace.js';

import errors from '../../errors.js';
import symbols from '../../symbols.js';


export default class DOMImplementation {
	constructor() {
		Object.defineProperties(this, {
			[symbols.nodeDocument]: {writable: true, value: undefined},
			[symbols.window]: {writable: true, value: undefined}
		});
	}


	get createDocument() {
		return function(namespace, qualifiedName, doctype) {
			const document = new Document();
			document[symbols.window] = this[symbols.window];
			document[symbols.DOMImplementation][symbols.window] = this[symbols.window];

			let element = null;

			if(qualifiedName !== '') {
				element = createAnElementNS(document, namespace, qualifiedName, {});
			}

			if(doctype !== null) {
				append(doctype, document);
			}

			if(element !== null) {
				append(element, document);
			}

			document[symbols.origin] = this[symbols.nodeDocument][symbols.origin];

			let contentType;

			switch(namespace) {
				case 'http://www.w3.org/1999/xhtml':
					contentType = 'application/xhtml+xml';
					break;
				case 'http://www.w3.org/2000/svg':
					contentType = 'image/svg+xml';
					break;
				default: contentType = 'application/xml';
			}

			document[symbols.contentType] = contentType;

			return document;
		}
	}
	set createDocument(value) {
		return errors.readOnly('createDocument', value);
	}

	get createHTMLDocument() {
		return function(title) {
			const doc = new Document();
			doc[symbols.window] = this[symbols.window];
			doc[symbols.DOMImplementation][symbols.window] = this[symbols.window];
			doc[symbols.contentType] = 'text/html';
			doc[symbols.type] = 'html';

			const docType = new DocumentType();
			const html = createAnElement(doc, 'html', 'http://www.w3.org/1999/xhtml');
			const head = createAnElement(doc, 'head', 'http://www.w3.org/1999/xhtml');

			docType[symbols.name] = 'html';
			docType[symbols.nodeDocument] = doc;

			append(docType, doc);
			append(html, doc);
			append(head, html);

			if(title !== undefined) {
				const titleNode = createAnElement(doc, 'title', 'http://www.w3.org/1999/xhtml');
				const textNode = new Text();

				textNode[symbols.data] = title;
				textNode[symbols.nodeDocument] = doc;

				append(textNode, titleNode);
				append(titleNode, head);
			}

			const body = createAnElement(doc, 'body', 'http://www.w3.org/1999/xhtml');

			append(body, html);

			doc[symbols.origin] = this[symbols.nodeDocument][symbols.origin];

			return doc;
		};
	}
	set createHTMLDocument(value) {
		return errors.readOnly('createHTMLDocument', value);
	}

	get createDocumentType() {
		return function(qualifiedName, publicId, systemId) {
			validate(qualifiedName);

			const doctype = new DocumentType()

			doctype[symbols.name] = qualifiedName;
			doctype[symbols.publicID] = publicId;
			doctype[symbols.systemID] = systemId;
			doctype[symbols.nodeDocument] = this[symbols.nodeDocument];

			return doctype;
		};
	}
	set createDocumentType(value) {
		return errors.readOnly('createDocumentType', value);
	}

	get hasFeature() {
		return true;
	}
	set hasFeature(value) {
		return errors.readOnly('hasFeature', value);
	}
}