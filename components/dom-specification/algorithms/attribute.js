import symbols from '../../symbols.js';


export default {
	attributeAppend,
	change,
	setAnExistingAttributeValue,
}


// https://dom.spec.whatwg.org/#concept-element-attributes-append
export function attributeAppend(attribute, element) {
	element[symbols.attributes].set(attribute[symbols.localName], attribute);
	attribute[symbols.element] = element;
}

// https://dom.spec.whatwg.org/#concept-element-attributes-change
export function change(attribute, value) {
	attribute[symbols.value] = value;
}

// https://dom.spec.whatwg.org/#set-an-existing-attribute-value
export function setAnExistingAttributeValue(attribute, value) {
	attribute[symbols.value] = value;
}