// https://dom.spec.whatwg.org/#interface-nodefilter

export default class NodeFilter {
	// constants for acceptNode()
	static get FILTER_ACCEPT() { return 1; }
	static get FILTER_REJECT() { return 2; }
	static get FILTER_SKIP() { return 3; }

	// constants for whatToShow
	static get SHOW_ALL() { return -1; }
	static get SHOW_ELEMENT() { return 1; }
	static get SHOW_ATTRIBUTE() { return 2; }
	static get SHOW_TEXT() { return 4; }
	static get SHOW_CDATA_SECTION() { return 8; }
	static get SHOW_PROCESSING_INSTRUCTION() { return 64; }
	static get SHOW_COMMENT() { return 128; }
	static get SHOW_DOCUMENT() { return 256; }
	static get SHOW_DOCUMENT_TYPE() { return 512; }
	static get SHOW_DOCUMENT_FRAGMENT() { return 1024; }

	static get acceptNode() {
		return function(callback) {
			return callback(node);
		}
	}
}