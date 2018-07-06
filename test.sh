#!/bin/bash

# Test expected output
echo "Test: flow-remove-types test/source.js"
DIFF=$(./flow-remove-types test/source.js | diff test/expected.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected output with --pretty flag
echo "Test: flow-remove-types --pretty test/source.js"
DIFF=$(./flow-remove-types --pretty test/source.js | diff test/expected-pretty.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected source maps with --pretty --sourcemaps --out-dir
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

# Test expected source maps with --copy-source --pretty --sourcemaps --out-dir
echo "Test: flow-remove-types --copy-source --pretty --sourcemaps test/source.js -d test/expected-with-maps"
TEST_DIR=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)
DIR=$(mktemp -d)
cp -r test $DIR
pushd $DIR > /dev/null
$TEST_DIR/flow-remove-types --copy-source --pretty --sourcemaps test/source.js -d test/expected-with-maps;
popd > /dev/null
DIFF_SOURCE=$(diff test/expected-with-maps/test/source.js $DIR/test/expected-with-maps/test/source.js);
DIFF_MAP=$(diff test/expected-with-maps/test/source.js.map $DIR/test/expected-with-maps/test/source.js.map);
DIFF_FLOW=$(diff test/source.js $DIR/test/expected-with-maps/test/source.js.flow);
echo $DIR
rm -rf $DIR
if [ -n "$DIFF_SOURCE" ]; then echo "$DIFF_SOURCE"; exit 1; fi;
if [ -n "$DIFF_MAP" ]; then echo "$DIFF_MAP"; exit 1; fi;
if [ -n "$DIFF_FLOW" ]; then echo "$DIFF_FLOW"; exit 1; fi;

# Test expected source maps with --pretty --sourcemaps inline
echo "Test: flow-remove-types --pretty --sourcemaps inline test/source.js"
DIFF=$(./flow-remove-types --pretty --sourcemaps inline test/source.js | diff test/expected-pretty-inlinemap.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected output with --comment option
echo "Test: flow-remove-types --comment test/source.js"
DIFF=$(./flow-remove-types --comment test/source.js | diff test/expected-comments.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected output with --comment option
echo "Test: flow-remove-types --comment test/source-nested-comments.js"
DIFF=$(./flow-remove-types --comment test/source-nested-comments.js | diff test/expected-nested-comments.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test expected output with @flow outside of comments
echo "Test: flow-remove-types test/without-flow.js"
DIFF=$(./flow-remove-types test/without-flow.js | diff test/without-flow.js -);
if [ -n "$DIFF" ]; then echo "$DIFF"; exit 1; fi;

# Test node require hook
echo "Test: node require hook"
RES=$(node -e 'require("./register");require("./test/test-node-module.js")');
if [ "$RES" != 42 ]; then echo 'Node require hook failed'; exit 1; fi;

# Test flow-node
echo "Test: flow-node"
FLOW_NODE=$(./flow-node ./test/test-node-module.js);
if [ "$FLOW_NODE" != 42 ]; then echo 'flow-node failed'; exit 1; fi;

# Test flow-node with options
echo "Test: flow-node with options"
FLOW_NODE_OPTS=$(./flow-node --code-comments -p 'process.argv.length');
if [ "$FLOW_NODE_OPTS" != 4 ]; then echo 'flow-node with options failed'; exit 1; fi;
