import parse from './components/parser.js';
import stringify from './components/stringifier.js';

export default {
	parse,
	serialize: stringify,
	stringify
}