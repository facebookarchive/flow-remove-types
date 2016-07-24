var assert = require('assert');
var fs = require('fs');
var flowRemoveTypes = require('../');

var source = fs.readFileSync(__dirname + '/source.js', 'utf8');
var actual = flowRemoveTypes(source);

if (process.argv[2] === '--update') {
  fs.writeFileSync(__dirname + '/expected.js', actual);
} else {
  var expected = fs.readFileSync(__dirname + '/expected.js', 'utf8');
  assert.equal(actual, expected);
}
