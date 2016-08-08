flow-remove-types
=================

[![npm](https://img.shields.io/npm/v/flow-remove-types.svg?maxAge=86400)](https://www.npmjs.com/package/flow-remove-types)
[![Build Status](https://img.shields.io/travis/leebyron/flow-remove-types.svg?style=flat&label=travis&branch=master)](https://travis-ci.org/leebyron/flow-remove-types)

Turn your JavaScript with [Flow](https://flowtype.org/) type annotations into
standard JavaScript in an instant with no configuration and minimal setup.

[Flow](https://flowtype.org/) provides static type checking to JavaScript which
can both help find and detect bugs long before code is deployed and can make
code easier to read and more self-documenting. The Flow tool itself only reads
and analyzes code. Running code with Flow type annotations requires first
removing the annotations which are non-standard JavaScript. Typically this is
done via adding a plugin to your [Babel](https://babeljs.io/) configuration,
however Babel may be overkill if you're only targetting modern versions of
Node.js or just not using the modern ES2015 features that may not be in
every browser.

`flow-remove-types` is a faster, simpler, zero-configuration alternative with
minimal dependencies for super-fast `npm install` time.


## Get Started!

Use the command line:

```
npm install --global flow-remove-types
```

```
flow-remove-types --help
flow-remove-types input.js > output.js
```

Or the JavaScript API:

```
npm install flow-remove-types
```

```js
var flowRemoveTypes = require('flow-remove-types');
var fs = require('fs');

var input = fs.readFileSync('input.js', 'utf8');
var output = flowRemoveTypes(input);
fs.writeFileSync('output.js', output);
```


## Use in Build Systems:

**Rollup**: [`rollup-plugin-flow`](https://github.com/leebyron/rollup-plugin-flow)

**Browserify:** [`unflowify`](https://github.com/leebyron/unflowify)


## Use `flow-node`

Wherever you use `node` you can substitute `flow-node` and have a super fast
flow-types aware evaluator or REPL.

```
$ flow-node
> var x: number = 42
undefined
> x
42
```


## Use the require hook

Using the require hook allows you to automatically compile files on the fly when
requiring in node:

```js
require('flow-remove-types/register')
require('./some-module-with-flow-type-syntax')
```


## Dead-Simple Transforms

When `flow-remove-types` removes Flow types, it replaces them with whitespace.
This ensures that the transformed output has exactly the same number of lines
and characters and that all character offsets remain the same. This removes the
need for sourcemaps, maintains legible output, and ensures that it is super easy
to include `flow-remove-types` at any point in your existing build tools.

Built atop the excellent [`babylon`](https://github.com/babel/babylon) parser,
`flow-remove-types` shares the same parse rules as the source of truth as
Flow Babel plugins. It also passes through other common non-standard syntax such
as [JSX](https://facebook.github.io/jsx/) and experimental ECMAScript proposals.

**Before:**

```js
import SomeClass from 'some-module'
import type { SomeInterface } from 'some-module'

export class MyClass<T> extends SomeClass implements SomeInterface {

  value: T

  constructor(value: T) {
    this.value = value
  }

  get(): T {
    return this.value
  }

}

```

**After:**

```js
import SomeClass from 'some-module'


export class MyClass    extends SomeClass                          {



  constructor(value   ) {
    this.value = value
  }

  get()    {
    return this.value
  }

}
```


## Performance

### Install:

Installing via `npm` from an empty project:

**flow-remove-types:**

```
time npm install flow-remove-types

real  0m3.193s
user  0m1.643s
sys   0m0.775s
```

**Babel:**

```
time npm install babel-cli babel-plugin-transform-flow-strip-types

real  0m23.200s
user  0m10.395s
sys   0m4.238s
```

### Transform:

Transforming a directory of 20 files of 100 lines each:

**flow-remove-types:**

```
time flow-remove-types src/ --out-dir dest/

real  0m0.431s
user  0m0.436s
sys   0m0.068s
```

**Babel:**

```
time babel src/ --out-dir dest/

real  0m1.074s
user  0m1.092s
sys   0m0.149s
```
