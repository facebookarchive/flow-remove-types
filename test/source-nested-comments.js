/* @flow */

// Regular import
import {
  Something,
  //a1
  type /*a2*/ SomeType, //a3
  typeof /*a4*/ SomeOtherThing /*a5*/
} from 'some-module';

// Import types
import /*b1*/ type /*b2*/ { /*b3*/ SomeType /*b4*/ } /*b5*/ from /*b6*/ 'some-module' /*b7*/; //b8

// Import types
import /*c1*/ type /*c2*/ {
  /*c3*/ SomeOtherType, //c4
  /*c5*/ SomeOtherOtherType //c6
} /*c7*/ from /*c8*/ 'some-module' /*c9*/; //c10

// Typed function
async function test(x: Type, y /*.*/ ? /*.*/ , z /*.*/ ? /*.*/ : /*.*/ number = 123): string {
  // Typed expression
  return await (x: /*d1*/ any);
}

// Interface
interface Foo {
  prop: any; //e1
  /*e2*/
  method(): /*e3*/ mixed; //e4
}

// Exported interface
export interface IThing {
  exported: true;
}

// Interface extends
interface SillyFoo extends Foo {
  silly: string;
}

// Implements interface
class Bar extends Other implements /*.*/ Foo, ISomething {
  // Class Property with default value
  answer: number = 42; //f1

  // Class Property
  prop: any;

  method(): mixed {
    return;
  }
}

// Class expression implements interface
var SomeClass = class Baz implements Foo {
  prop: any;

  method(): mixed {
    return;
  }
};

// Parametric class
class Wrapper<T> {
  get(): T {
    return this.value;
  }

  map<M>(): Wrapper<M> {
    // do something
  }
}

// Extends Parametric class
class StringWrapper extends Wrapper<string> {
  // ...
}

// Declare class
declare /*g1*/ class /*g2*/ Baz /*g3*/ {
  method() /*g4*/ : /*g5*/ mixed;
}

// Declare funtion
declare function someFunc(): void;

// Declare interface
declare interface ISomething {
  answer: number;
}

// Declare module
declare module 'fs' {
  declare function readThing(path: string): string;
}

// Declare type alias
declare type Location = {
  lat: number,
  lon: number
};

// Declare variable
declare var SOME_CONST: string;

// Type alias
type T = string;

// Export type
export type { T };

// Regular export
export { Wrapper };

// Exported type alias
export type ONE = { one: number };

// Object with types within
var someObj = {
  objMethod(): void {
    // do nothing.
  }
}

// Example from README
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

// Test async/await functions
async function asyncFunction<T>(input: T): Promise<T> {
  return await t;
}

// Test read-only data
export type TestReadOnly = {|
  +readOnly: $ReadOnlyArray<>
|};

// Test covariant type variant class with constaint and default.
export class TestClassWithDefault<+T: TestReadOnly = TestReadOnly> {

  constructor() {}
}
