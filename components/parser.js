import * as htmlparser2 from 'htmlparser2';


import Document from './dom-specification/nodes/document.js';
import Window from './html-specification/window.js';

import symbols from './symbols.js';


import Element from './dom-specification/nodes/element.js'; //TEMP


const window = new Window();
const customElements = window[symbols.customElementRegistry];

export {customElements, parse};

export default function parse(HTMLString = '', options) {
	if(typeof HTMLString !== 'string') {
		throw new Error(`Linked Abstract Syntax Tree can only parse strings. Received ${typeof HTMLString}: ${JSON.stringify(HTMLString)}`);
	}

	const document = new Document();
	document[symbols.window] = window;
	document[symbols.DOMImplementation][symbols.window] = window;
	window[symbols.associatedDocument] = document;
	let previousNode = document;
	const parser = new htmlparser2.Parser({
		onopentagname: handleOpenTagName,
		onattribute: handleAttribute,
		ontext: handleText,
		onclosetag: handleCloseTag,
		onprocessinginstruction: handleProcessingInstruction,
		oncomment: handleComment,
		onerror: handleError
	}, Object.assign({
		decodeEntities: false,
		lowerCaseAttributeNames: false,
		lowerCaseTags: false
	}, options));

	parser.write(HTMLString);
	parser.end();

	return document;


	function handleOpenTagName(name) {
		console.log('open tag', {name});
		const node = new Element();
		node[symbols.localName] = name;
		node[symbols.originalTag] = name;
		previousNode.appendChild(node);
		previousNode = node;
	}

	function handleAttribute(name, value, quotes) {
		console.log('attribute', {name}, {value}, {quotes});
		const attributesMap = previousNode[symbols.attributes];
		const lowerCaseName = name.toLowerCase();

		if(!attributesMap.has(lowerCaseName)) {
			attributesMap.set(lowerCaseName, {
				name: name,
				value: `${value}`,
				quotes: quotes
			});
		}
	}

	function handleText(text) {
		console.log('text', {text});
	}

	function handleCloseTag(name, isImplied) {
		console.log('close tag', {name}, {isImplied});
		previousNode[symbols.hasImpliedCloseTag] = isImplied;
		previousNode = previousNode[symbols.parent];
	}

	function handleProcessingInstruction(name, data) {
		console.log('processing instruction', {name}, {data});
	}

	function handleComment(data) {
		console.log('comment', {data});
	}

	function handleError(error) {
		throw new Error(`Linked Abstract Syntax Tree encountered an error when parsing an HTML string: ${error}`);
	}
}