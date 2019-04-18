#!/bin/sh
# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

rm -rf npm-alias
mkdir npm-alias
cp * npm-alias/ 2> /dev/null
node -p "p=require('./package.json');p.name='flow-node';delete p.scripts;JSON.stringify(p, null, 2)" > npm-alias/package.json
cd npm-alias
npm publish
rm -rf npm-alias
