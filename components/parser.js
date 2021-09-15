import htmlparser2 from 'htmlparser2';

import Document from './dom-specification/nodes/document.js';
import symbols from './symbols.js';

export default function parse(HTMLString = '', options) {
	console.log('parser called on ' + HTMLString);
	if(typeof HTMLString !== 'string') {
		throw new Error(`Linked Abstract Syntax Tree can only parse strings. Received ${typeof HTMLString}: ${JSON.stringify(HTMLString)}`);
	}

	const document = new Document();
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
		// TODO handle foreign elements
		const node = document.createElement(name);
		node[symbols.LAST].originalTag = name;
		previousNode.appendChild(node);
		previousNode = node;
	}

	function handleAttribute(name, value, quotes) {
		console.log('attribute', {name}, {value}, {quotes});
		const attributesMap = previousNode[symbols.LAST].properties.attributes;
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
		previousNode[symbols.LAST].hasImpliedCloseTag = isImplied;
		previousNode = previousNode.parentNode;
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