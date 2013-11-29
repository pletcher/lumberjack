Lumberjack
===

### A library for working with trees (and maybe eventually tries).

API
---

#### General Usage

Suppose you have a tree:
```javascript
var tree = {
  root: {
    name: 'Jake',
    id: 1,
    children: { // by default, Lumberjack looks for a 'children' property;
                // you can override this in the options hash
      b: {
        name: 'Todd',
        id: 2,
        children: {
          c: { 
            name: 'Mary',
            id: 3
          }
        }
      },
      d: {
        name: 'Tricia',
        id: 4
      }
    }
  }
};
```

And suppose you need to find something in that tree:
```javascript
var lumberjack = new Lumberjack(/*options*/);

lumberjack.setTree(tree);
```

You can search breadth-first:
```javascript
// breadth-first search
lumberjack.breadthFirst(tree.root, { id: 3 }, function(err, node) {
  console.log(node); // { name: 'Mary', id: 3 }
});
```

or depth-first:
```javascript
// depth-first search
lumberjack.depthFirst(tree.root, { id: 4 }, function(err, node) {
  console.log(node); // { name: 'Tricia', id: 4 }
});
```

#### Options
children (String; default: 'children'): The name of subnodes in your tree
rememberPath (Boolean; default: false): Instructs the Lumberjack instance to return its traversal path for your search. If true, provider your callback with a third parameter:
```javascript
var lumberjack = new Lumberjack({ rememberPath: true });

lumberjack.breadthFirst(tree.root, { id: 3 }, function(err, node, path) {
  console.log(path); // [ { name: 'Jake', id: 1, children: { b: [Object], d: [Object] } },
                          { name: 'Todd', id: 2, children: { c: [Object] } },
                          { name: 'Tricia', id: 4 },
                          { name: 'Mary', id: 3 } ]
});

lumberjack.depthFirst(tree.root, { id: 3 }, function(err, node, path) {
  console.log(path); // [ { name: 'Jake', id: 1, children: { b: [Object], d: [Object] } },
                          { name: 'Todd', id: 2, children: { c: [Object] } },
                          { name: 'Mary', id: 3 } ]
})
```

Additional functionality, including graph comparison, is planned.

Tests
---

```
cd [lumberjack_root_directory]
make test
```
