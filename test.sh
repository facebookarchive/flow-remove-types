#!/bin/sh

# Test expected output
DIFF=$(./flow-remove-types test/source.js | diff test/expected.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected output with --pretty flag
DIFF=$(./flow-remove-types --pretty test/source.js | diff test/expected-pretty.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected source maps with --pretty --sourcemaps
DIFF=$(./flow-remove-types --pretty --sourcemaps test/source.js | diff test/expected-pretty.js.map -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test node require hook
RES=$(node -e 'require("./register");require("./test/test-node-module.js")');
if [ "$RES" != 42 ]; then echo 'Node require hook failed'; exit 1; fi;

# Test flow-node
FLOW_NODE=$(./flow-node ./test/test-node-module.js);
if [ "$FLOW_NODE" != 42 ]; then echo 'flow-node failed'; exit 1; fi;
