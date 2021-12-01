export default {
	readOnly: function(property, value) {
		throw new TypeError(`Cannot set value "${value}" of read only property ${property}.`);
	},
	unsupported: function(property) {
		throw new TypeError(`Linked Abstract Syntax Tree does not support the ${property} property.`);
	}
}