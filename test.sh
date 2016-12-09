#!/bin/sh

# Test expected output
echo "Test: flow-remove-types test/source.js"
DIFF=$(./flow-remove-types test/source.js | diff test/expected.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected output with --pretty flag
echo "Test: flow-remove-types --pretty test/source.js"
DIFF=$(./flow-remove-types --pretty test/source.js | diff test/expected-pretty.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected source maps with --pretty --sourcemaps
echo "Test: flow-remove-types --pretty --sourcemaps test/source.js -d test/expected-with-maps"
TEST_DIR=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)
DIR=$(mktemp -d)
cp -r test $DIR
pushd $DIR > /dev/null
$TEST_DIR/flow-remove-types --pretty --sourcemaps test/source.js -d test/expected-with-maps;
popd > /dev/null
DIFF_SOURCE=$(diff test/expected-with-maps/test/source.js $DIR/test/expected-with-maps/test/source.js);
DIFF_MAP=$(diff test/expected-with-maps/test/source.js.map $DIR/test/expected-with-maps/test/source.js.map);
rm -rf $DIR
if [ -n "$DIFF_SOURCE" ]; then echo "$DIFF_SOURCE"; exit 1; fi;
if [ -n "$DIFF_MAP" ]; then echo "$DIFF_MAP"; exit 1; fi;

# Test expected source maps with --pretty --sourcemaps inline
echo "Test: flow-remove-types --pretty --sourcemaps inline test/source.js"
DIFF=$(./flow-remove-types --pretty --sourcemaps inline test/source.js | diff test/expected-pretty-inlinemap.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test node require hook
echo "Test: node require hook"
RES=$(node -e 'require("./register");require("./test/test-node-module.js")');
if [ "$RES" != 42 ]; then echo 'Node require hook failed'; exit 1; fi;

# Test flow-node
echo "Test: flow-node"
FLOW_NODE=$(./flow-node ./test/test-node-module.js);
if [ "$FLOW_NODE" != 42 ]; then echo 'flow-node failed'; exit 1; fi;
