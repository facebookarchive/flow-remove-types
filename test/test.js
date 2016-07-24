var assert = require('assert');
var fs = require('fs');
var flowRemoveTypes = require('../');

var source = fs.readFileSync(__dirname + '/source.js', 'utf8');
var actual = flowRemoveTypes(source);

var expected = fs.readFileSync(__dirname + '/expected.js', 'utf8');
assert.equal(actual, expected);
