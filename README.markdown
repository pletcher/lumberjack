Lumberjack
===

### A library for working with trees.

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
lumberjack.breadthFirst(lumberjack.tree.root, { id: 3 }, function(err, node) {
  console.log(node); // { name: 'Mary', id: 3 }
});
```

or depth-first:
```javascript
// depth-first search
lumberjack.depthFirst(lumberjack.tree.root, { id: 4 }, function(err, node) {
  console.log(node); // { name: 'Tricia', id: 4 }
});
```

You can flatten the tree:
```javascript
// flatten
lumberjack.flatten(lumberjack.tree.root);
console.log(lumberjack.flattenedTree); // { '1': 
                                       //    { name: 'Jake',
                                       //      id: 1,
                                       //      children: [ 2, 4 ] },
                                       //   '2': 
                                       //    { name: 'Todd',
                                       //      id: 2,
                                       //      children: [ 3 ] },
                                       //   '3': { name: 'Mary', id: 3, children: [] },
                                       //   '4': { name: 'Tricia', id: 4, children: [] } }
```

And you can rebuild it:
```javascript
// rebuild
lumberjack.rebuild(lumberjack.flattenedTree['1'], { id: 1 });
console.log(lumberjack.tree); // { name: 'Jake',
                              //   id: 1,
                              //   children: 
                              //   [ { name: 'Todd',
                              //       id: 2,
                              //       children: [ { name: 'Mary', id: 3, children: [] } ] },
                              //     { name: 'Tricia', id: 4, children: [] } ] }
```

#### Options
- children (String; default: 'children'): The name of subnodes in your tree
    - The value of this property can be an object with your own custom indeces or a JavaScript Array; Lumberjack doesn't care

- identifier (String; default: 'id'): The key that uniquely identifies each node in your tree

- rememberPath (Boolean; default: false): Instructs the Lumberjack instance to return its traversal path for your search. If true, provider your callback with a third parameter:

    ```javascript
    var lumberjack = new Lumberjack({ rememberPath: true });

    lumberjack.breadthFirst(tree.root, { id: 3 }, function(err, node, path) {
      console.log(path); // [ { name: 'Jake', id: 1, children: { b: [Object], d: [Object] } },
                         //   { name: 'Todd', id: 2, children: { c: [Object] } },
                         //   { name: 'Tricia', id: 4 },
                         //   { name: 'Mary', id: 3 } ]
    });

    lumberjack.depthFirst(tree.root, { id: 3 }, function(err, node, path) {
      console.log(path); // [ { name: 'Jake', id: 1, children: { b: [Object], d: [Object] } },
                         //   { name: 'Todd', id: 2, children: { c: [Object] } },
                         //   { name: 'Mary', id: 3 } ]
    })
    ```


Additional functionality, including graph comparison, is planned.

Tests
---

```
cd [lumberjack_root_directory]
make test
```
