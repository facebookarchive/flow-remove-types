#!/bin/sh

rm -rf npm-alias
mkdir npm-alias
cp * npm-alias/ 2> /dev/null
node -p "p=require('./package.json');p.name='flow-node';delete p.scripts;JSON.stringify(p, null, 2)" > npm-alias/package.json
cd npm-alias
npm publish
rm -rf npm-alias
