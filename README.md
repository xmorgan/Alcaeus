# heracles [![Build Status](https://travis-ci.org/wikibus/heracles.svg?branch=master)](https://travis-ci.org/wikibus/heracles)

## [Hydra Core](http://www.hydra-cg.com/spec/latest/core/) library for JavaScript

Heracles is a Promise-based library for consuming Hydra APIs

## Browser support

[![Sauce Test Status](https://saucelabs.com/browser-matrix/heracles-tcode.svg)](https://saucelabs.com/u/heracles-tcode)

You will need polyfills for older browsers:

|                     | Chrome | Firefox | IExplore | Safari | Opera |
| -------------       |--------|---------|----------|--------|-------|
| [window.fetch][p1]  | <42    | <39     | :x:      | :x:    | <29   |
| [Object.assign][p2] | <45    | <34     | :x:      | <9     | <32   |
| [WeakMap][p3]       | <36    | <6      | <11      | <7.1   | <23   |

## Installation

``` bash
jspm install npm:wikibus/heracles
```

It should also be possible to install from NPM directly, but jspm makes it much easier to then use in ES6 code.

## Usage

Assuming JSPM installation

``` js
import {Hydra} from 'wikibus/heracles';

Hydra.loadResource('http://example.com/resource')
  .then(res => {
    // contains supported classes, operations, etc.
    var apiDocs = res.apiDocumentation;
    
    // same as res['@id']
    var id = res.id; 
  });
```

### More examples

* [Introduction to heracles](http://t-code.pl/blog/2016/04/introducing-heracles/)
* [Working with jsonld.js](http://t-code.pl/blog/2016/04/heracles-compacting-resources/)

## License

MIT

[p1]: https://github.com/github/fetch
[p2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
[p3]: https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
