var flowRemoveTypes = require('./index');

// Supported options:
//
//   - all: Transform all files, not just those with a @flow comment.
//   - includes: A Regexp to determine which files should be transformed.
//   - excludes: A Regexp to determine which files should not be transformed,
//               defaults to ignoring /node_modules/, set to null to excludes nothing.
var options;
module.exports = function setOptions(newOptions) {
  options = newOptions;
}

// Swizzle Module#_compile on each applicable module instance.
// NOTE: if using alongside Babel or another require-hook which simply
// over-writes the require.extensions and does not continue execution, then
// this require hook must come after it. Encourage those module authors to call
// the prior loader in their require hooks.
var jsLoader = require.extensions['.js'];
var exts = [ '.js', '.jsx', '.flow', '.es6' ];
exts.forEach(function (ext) {
  var superLoader = require.extensions[ext] || jsLoader;
  require.extensions[ext] = function (module, filename) {
    if (shouldTransform(filename, options)) {
      var super_compile = module._compile;
      module._compile = function _compile(code, filename) {
        super_compile.call(this, flowRemoveTypes(code, options).toString(), filename);
      };
    }
    superLoader(module, filename);
  };
});

function shouldTransform(filename, options) {
  var includes = options && options.includes;
  var excludes = options && 'excludes' in options ? options.excludes : /\/node_modules\//;
  return (!includes || include.test(filename)) && !(excludes && excludes.test(filename));
}
