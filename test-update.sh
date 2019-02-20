#!/bin/sh

# Generate expected output
./flow-remove-types test/source.js > test/expected.js;

# Generate expected output with --pretty flag
./flow-remove-types --pretty test/source.js > test/expected-pretty.js;

# Test expected source maps with --pretty --sourcemaps
./flow-remove-types --pretty --sourcemaps test/source.js -d test/expected-with-maps;

# Test expected source maps with --pretty --sourcemaps inline
./flow-remove-types --pretty --sourcemaps inline test/source.js > test/expected-pretty-inlinemap.js;

# Test expected source maps with --pretty --sourcemaps inline, from stdin
./flow-remove-types --pretty --sourcemaps inline < test/source.js > test/expected-pretty-inlinemap-stdin.js;
