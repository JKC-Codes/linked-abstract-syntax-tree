export default {
	name,
	qName
}


// https://www.w3.org/TR/REC-xml/#sec-common-syn
const NameStartChar = String.raw`(?::|[A-Z]|_|[a-z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\u{10000}-\u{EFFFF}])`;
const NameChar = String.raw`(?:${NameStartChar}|-|\.|[0-9]|\xB7|[\u0300-\u036F]|[\u203F-\u2040])`;
const Name = String.raw`(?:${NameStartChar}${NameChar}*)`;

// https://www.w3.org/TR/xml-names/#ns-decl
const NCName = String.raw`(?:${NameStartChar}(?<!:)${NameChar}*)`;

// https://www.w3.org/TR/xml-names/#ns-qualnames
const LocalPart = String.raw`(?:${NCName})`;
const Prefix = String.raw`(?:${NCName})`;
const UnprefixedName = String.raw`(?:${LocalPart})`;
const PrefixedName = String.raw`(?:${Prefix}:${LocalPart})`;
const QName = String.raw`(?:${PrefixedName}|${UnprefixedName})`;

export var name = new RegExp(String.raw`^${Name}$`, 'u');
export var qName = new RegExp(String.raw`^${QName}$`, 'u');