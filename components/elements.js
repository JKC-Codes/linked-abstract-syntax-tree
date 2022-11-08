import HTMLElement from './html-specification/html-element.js';


export default {
	getElementClass,
	elementsHTMLVoid,
	elementHTMLTemplate,
	elementsHTMLRawText,
	elementsHTMLEscapableRawText,
	elementsHTMLForeign,
	elementsHTMLNormal,
	elementsHTML
};

export function getElementClass(element, namespace) {
	if(element === 'title' && namespace === 'http://www.w3.org/2000/svg') {
		element = 'title-svg';
	}

	if(elementsHTML.has(element)) {
		return elementsHTML.get(element);
	}

	return HTMLUnknownElement;
}

export var elementsHTMLVoid = new Map([
	['area', HTMLAreaElement],
	['base', HTMLBaseElement],
	['br', HTMLBRElement],
	['col', HTMLTableColElement],
	['embed', HTMLEmbedElement],
	['hr', HTMLHRElement],
	['img', HTMLImageElement],
	['input', HTMLInputElement],
	['keygen', HTMLUnknownElement],
	['link', HTMLLinkElement],
	['menuitem', HTMLElement],
	['meta', HTMLMetaElement],
	['param', HTMLElement],
	['source', HTMLSourceElement],
	['track', HTMLTrackElement],
	['wbr', HTMLElement]
]);

export var elementHTMLTemplate = new Map([
	['template', HTMLTemplateElement]
]);

export var elementsHTMLRawText = new Map([
	['script', HTMLScriptElement],
	['style', HTMLStyleElement]
]);

export var elementsHTMLEscapableRawText = new Map([
	['textarea', HTMLTextAreaElement],
	['title', HTMLTitleElement],
]);

export var elementsHTMLForeign = new Map([
	['annotation-xml', Element],
	['foreignObject', SVGSVGElement],
	['math', Element],
	['merror', Element],
	['mi', Element],
	['mn', Element],
	['mo', Element],
	['ms', Element],
	['mtext', Element],
	['svg', SVGSVGElement],
	['title-svg', SVGSVGElement],
]);

export var elementsHTMLNormal = new Map([
	['a', HTMLAnchorElement],
	['abbr', HTMLElement],
	['acronym', HTMLElement],
	['address', HTMLElement],
	['applet', HTMLUnknownElement],
	['article', HTMLElement],
	['aside', HTMLElement],
	['audio', HTMLAudioElement],
	['b', HTMLElement],
	['basefont', HTMLElement],
	['bdi', HTMLElement],
	['bdo', HTMLElement],
	['bgsound', HTMLUnknownElement],
	['big', HTMLElement],
	['blink', HTMLUnknownElement],
	['blockquote', HTMLQuoteElement],
	['body', HTMLBodyElement],
	['button', HTMLButtonElement],
	['canvas', HTMLCanvasElement],
	['caption', HTMLTableCaptionElement],
	['center', HTMLElement],
	['cite', HTMLElement],
	['code', HTMLElement],
	['colgroup', HTMLTableColElement],
	['content', HTMLElement],
	['data', HTMLDataElement],
	['datalist', HTMLDataListElement],
	['dd', HTMLElement],
	['del', HTMLModElement],
	['details', HTMLDetailsElement],
	['dfn', HTMLElement],
	['dialog', HTMLDialogElement],
	['dir', HTMLElement],
	['div', HTMLDivElement],
	['dl', HTMLDListElement],
	['dt', HTMLElement],
	['em', HTMLElement],
	['fieldset', HTMLFieldSetElement],
	['figcaption', HTMLElement],
	['figure', HTMLElement],
	['font', HTMLElement],
	['footer', HTMLElement],
	['form', HTMLFormElement],
	['frame', HTMLElement],
	['frameset', HTMLElement],
	['h1', HTMLHeadingElement],
	['h2', HTMLHeadingElement],
	['h3', HTMLHeadingElement],
	['h4', HTMLHeadingElement],
	['h5', HTMLHeadingElement],
	['h6', HTMLHeadingElement],
	['head', HTMLHeadElement],
	['header', HTMLElement],
	['hgroup', HTMLElement],
	['html', HTMLHtmlElement],
	['i', HTMLElement],
	['iframe', HTMLIFrameElement],
	['ins', HTMLModElement],
	['isindex', HTMLUnknownElement],
	['kbd', HTMLElement],
	['label', HTMLLabelElement],
	['legend', HTMLLegendElement],
	['li', HTMLLIElement],
	['listing', HTMLPreElement],
	['main', HTMLElement],
	['map', HTMLMapElement],
	['mark', HTMLElement],
	['marquee', HTMLElement],
	['menu', HTMLMenuElement],
	['meter', HTMLMeterElement],
	['multicol', HTMLUnknownElement],
	['nav', HTMLElement],
	['nextid', HTMLUnknownElement],
	['nobr', HTMLElement],
	['noembed', HTMLElement],
	['noframes', HTMLElement],
	['noscript', HTMLElement],
	['object', HTMLObjectElement],
	['ol', HTMLOListElement],
	['optgroup', HTMLOptGroupElement],
	['option', HTMLOptionElement],
	['output', HTMLOutputElement],
	['p', HTMLParagraphElement],
	['picture', HTMLPictureElement],
	['plaintext', HTMLElement],
	['portal', HTMLElement],
	['pre', HTMLPreElement],
	['progress', HTMLProgressElement],
	['q', HTMLQuoteElement],
	['rb', HTMLElement],
	['rp', HTMLElement],
	['rt', HTMLElement],
	['rtc', HTMLElement],
	['ruby', HTMLElement],
	['s', HTMLElement],
	['samp', HTMLElement],
	['section', HTMLElement],
	['select', HTMLSelectElement],
	['shadow', HTMLElement],
	['slot', HTMLSlotElement],
	['small', HTMLElement],
	['spacer', HTMLUnknownElement],
	['span', HTMLSpanElement],
	['strike', HTMLElement],
	['strong', HTMLElement],
	['sub', HTMLElement],
	['summary', HTMLElement],
	['sup', HTMLElement],
	['table', HTMLTableElement],
	['tbody', HTMLTableSectionElement],
	['td', HTMLTableCellElement],
	['tfoot', HTMLTableSectionElement],
	['th', HTMLTableCellElement],
	['thead', HTMLTableSectionElement],
	['time', HTMLTimeElement],
	['tr', HTMLTableRowElement],
	['tt', HTMLElement],
	['u', HTMLElement],
	['ul', HTMLUListElement],
	['var', HTMLElement],
	['video', HTMLVideoElement],
	['xmp', HTMLPreElement]
]);

export var elementsHTML = new Map([
	...elementsHTMLVoid,
	...elementHTMLTemplate,
	...elementsHTMLRawText,
	...elementsHTMLEscapableRawText,
	...elementsHTMLForeign,
	...elementsHTMLNormal,
	...elementsHTML
]);