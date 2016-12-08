#!/bin/sh

# Generate expected output
./flow-remove-types test/source.js > test/expected.js;

# Generate expected output with --pretty flag
./flow-remove-types --pretty test/source.js > test/expected-pretty.js;

# Test expected source maps with --pretty --sourcemaps
./flow-remove-types -p -m test/source.js > test/expected-pretty.js.map
