var babylon = require('babylon');

/**
 * Given a string JavaScript source which contains Flow types, return a string
 * which has removed those types.
 */
module.exports = function flowRemoveTypes(source) {
  // If there's no @flow or @noflow flag, then expect no annotation.
  var pragmaStart = source.indexOf('@flow');
  var pragmaEnd = pragmaStart + 5;
  if (pragmaStart === -1) {
    pragmaStart = source.indexOf('@noflow');
    pragmaEnd = pragmaStart + 7;
    if (pragmaStart === -1) {
      return source;
    }
  }

  var removedNodes = [ { start: pragmaStart, end: pragmaEnd } ];

  // Babylon is one of the sources of truth for Flow syntax. This parse
  // configuration is intended to be as permissive as possible.
  var ast = babylon.parse(source, {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    sourceType: 'module',
    plugins: [ '*', 'jsx', 'flow' ],
  });

  visit(ast, removedNodes, removeFlowVisitor);

  var result = '';
  var lastPos = 0;

  // Step through the removed nodes, building up the resulting string.
  for (var i = 0; i < removedNodes.length; i++) {
    var node = removedNodes[i];
    result += source.slice(lastPos, node.start);
    var toReplace = source.slice(node.start, node.end);
    lastPos = node.end;
    if (!node.loc || node.loc.start.line === node.loc.end.line) {
      result += space(toReplace.length);
    } else {
      var toReplaceLines = toReplace.split(LINE_RX);
      result += space(toReplaceLines[0].length);
      for (var j = 1; j < toReplaceLines.length; j += 2) {
        result += toReplaceLines[j] + space(toReplaceLines[j + 1].length);
      }
    }
  }

  return result += source.slice(lastPos);
}

var LINE_RX = /(\r\n?|\n|\u2028|\u2029)/;

// A collection of methods for each AST type names which contain Flow types to
// be removed.
var removeFlowVisitor = {
  DeclareClass: removeNode,
  DeclareFunction: removeNode,
  DeclareInterface:removeNode,
  DeclareModule: removeNode,
  DeclareTypeAlias: removeNode,
  DeclareVariable: removeNode,
  InterfaceDeclaration: removeNode,
  TypeAlias: removeNode,
  TypeAnnotation: removeNode,
  TypeParameterDeclaration: removeNode,
  TypeParameterInstantiation: removeNode,

  ClassDeclaration: removeImplementedInterfaces,
  ClassExpression: removeImplementedInterfaces,

  Identifier(removedNodes, node, ast) {
    if (node.optional) {
      // Find the optional token.
      var idx = findTokenIndex(ast.tokens, node.start);
      do {
        idx++;
      } while (ast.tokens[idx].type.label !== '?');
      removeNode(removedNodes, ast.tokens[idx]);
    }
  },

  ClassProperty(removedNodes, node) {
    if (!node.value) {
      return removeNode(removedNodes, node)
    }
  },

  ExportNamedDeclaration(removedNodes, node) {
    if (node.exportKind === 'type') {
      return removeNode(removedNodes, node);
    }
  },

  ImportDeclaration(removedNodes, node) {
    if (node.importKind === 'type') {
      return removeNode(removedNodes, node);
    }
  }
};

// If this class declaration or expression implements interfaces, remove
// the associated tokens.
function removeImplementedInterfaces(removedNodes, node, ast) {
  if (node.implements && node.implements.length > 0) {
    var first = node.implements[0];
    var last = node.implements[node.implements.length - 1];
    var idx = findTokenIndex(ast.tokens, first.start);
    do {
      idx--;
    } while (ast.tokens[idx].value !== 'implements');

    var lastIdx = findTokenIndex(ast.tokens, last.start);
    do {
      if (ast.tokens[idx].type !== 'CommentBlock' &&
          ast.tokens[idx].type !== 'CommentLine') {
        removeNode(removedNodes, ast.tokens[idx]);
      }
    } while (idx++ !== lastIdx);
  }
}

// Append node to the list of removed nodes, ensuring the order of the nodes
// in the list.
function removeNode(removedNodes, node) {
  var length = removedNodes.length;
  var index = length;
  while (index > 0 && removedNodes[index - 1].end > node.start) {
    index--;
  }
  if (index === length) {
    removedNodes.push(node);
  } else {
    removedNodes.splice(index, 0, node);
  }
  return false;
}

// Given the AST output of babylon parse, walk through in a depth-first order,
// calling methods on the given visitor, providing context as the first argument.
function visit(ast, context, visitor) {
  var stack;
  var parent;
  var keys = [];
  var index = -1;

  do {
    index++;
    if (stack && index === keys.length) {
      parent = stack.parent;
      keys = stack.keys;
      index = stack.index;
      stack = stack.prev;
    } else {
      var node = parent ? parent[keys[index]] : ast.program;
      if (node && typeof node === 'object') {
        if (node.type) {
          var visitFn = visitor[node.type];
          if (visitFn && visitFn(context, node, ast) === false) {
            continue;
          }
        }
        stack = { parent: parent, keys: keys, index: index, prev: stack };
        parent = node;
        keys = Object.keys(node);
        index = -1;
      }
    }
  } while (stack);
}

// Given an array of sorted tokens, find the index of the token which contains
// the given offset. Uses binary search for O(log N) performance.
function findTokenIndex(tokens, offset) {
  var min = 0;
  var max = tokens.length - 1;

  while (min <= max) {
    var ptr = (min + max) / 2 | 0;
    var token = tokens[ptr];
    if (token.end <= offset) {
      min = ptr + 1;
    } else if (token.start > offset) {
      max = ptr - 1;
    } else {
      return ptr;
    }
  }
}

// Produce a string full of space characters of a given size.
function space(size) {
  var sp = ' '
  var result = '';

  for (;;) {
    if ((size & 1) === 1) {
      result += sp;
    }
    size >>>= 1;
    if (size === 0) {
      break;
    }
    sp += sp;
  }
  return result;
}
