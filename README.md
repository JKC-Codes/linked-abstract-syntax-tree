# Linked Abstract Syntax Tree
# Markup Manipulator
Manipulates HTML strings using standard DOM methods.
Creates and reads HTML abstract syntax trees.
Modify HTML and XML strings using standard DOM methods.


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
import LAST from 'linked-abstract-syntax-tree';

const document = LAST.parse('<p>foo</p>');
const paragraph = document.createElement('p');
paragraph.textContent = 'bar';
document.append(paragraph);

console.log(LAST.stringify(document)); // '<p>foo</p><p>bar</p>'
```


## Configuration

### contentType
- Default: 'text/html'
- Accepts: content type

How to render the document.

### decodeEntities
- Default: true
- Accepts: Boolean

Special HTML characters will be replaced.

### errorHandling
- Default: 'throw'
- Accepts: 'throw', 'warn' or 'ignore'

How to handle assigning to read-only properties or accessing unsupported properties.


## Modifications
Linked Abstract Syntax Tree makes the following modifications when parsing HTML:
- Whitespace inside of tags is removed e.g. '<p     class="foo"</p>' becomes '<p class="foo"</p>'
- Closing tags will always match the opening tag e.g. '<Div>foo</dIV>' becomes '<Div>foo</Div>'
- Duplicate attribute names will be removed and their values discarded e.g. <p class="foo" class="bar"></p> becomes <p class="foo"></p>
- There can be multiple elements as a child of a document. The document's documentElement will be the first child element
- <html>, <head> and <body> elements will not be added if missing
- Documents will always be in no-quirks mode


## Scope
The following are partially supported:
- Custom elements don't support custom element reactions/lifecycle callbacks
- Custom elements will always be upgraded
- HTML collections will be replaced by a static array
- Named node maps will be replaced by a static array
- Node lists will be replaced by a static array

The following are unsupported:
- Events
- Node iterators
- Observers
- Ranges
- Shadow DOM


## Alternatives
- domhandler
- cheerio
- linkedom
- node-html-parser
- JSDOM
- PostHTML


## Licence
[MPL-2.0](https://choosealicense.com/licenses/mpl-2.0/)