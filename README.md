# Linked Abstract Syntax Tree
Creates and reads HTML abstract syntax trees.


- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Licence](#licence)


## Installation

```shell
npm install linked-abstract-syntax-tree
```


## Usage

```js
import { default as htmlparser2 } from "htmlparser2";

const parser = new htmlparser2.Parser (
	{
		onopentag(name, attributes) {
			console.log('open tag', {name},{attributes});
		},
		// onopentagname(name) {
		// 	console.log('open tag name', {name});
		// },
		// onattribute(name, value, quote) {
		// 	console.log('attribute', {name}, {value}, {quote});
		// },
		ontext(text) {
			console.log('text', {text});
		},
		onclosetag(name) {
			console.log('close tag', {name});
		},
		onprocessinginstruction(name, data) {
			console.log('processing instruction', {name}, {data});
		},
		oncomment(data) {
			console.log('comment', {data});
		},
		// oncommentend() {
		// 	console.log('comment end');
		// },
		// oncdatastart() {
		// 	console.log('c data start');
		// },
		// oncdataend() {
		// 	console.log('c data end');
		// },
		onerror(error) {
			console.log({error});
		},
		// onreset() {
		// 	console.log('reset');
		// },
		// onend() {
		// 	console.log('end');
		// }
	},
	{
		decodeEntities: false,
		lowerCaseAttributeNames: false,
		lowerCaseTags: false
	}
);

parser.write(`<!DOCTYPE html><pre onclick='console.log();'><coDe cLass="html CSS" id='spaces start' data-spaces=\`end\`>&lt;p>Testing&lt;/p></codE></pre><img src="foo" alt='test'><script>var test = 'this is a test'; function foo(bar) {let baz = bar;return '<p>baz</p>';}foo(test);</script><custom-element><strong>inside</strong> a custom element</custom-element><script>var test = '</script>';</script><!-- end of <p>test</p> string -->`);
parser.end();
```


## Configuration
```js
import { default as htmlparser2 } from "htmlparser2";
```


### decodeEntities
- Default: false
- Accepts: Boolean

Special HTML characters will be replaced.


## Licence
[MPL-2.0](https://choosealicense.com/licenses/mpl-2.0/)