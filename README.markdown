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
lumberjack.bfs(tree.root, { id: 3 }, function(err, node) {
  console.log(node); // { name: 'Mary', id: 3 }
});
```

or depth-first:
```javascript
// depth-first search
lumberjack.dfs(tree.root, { id: 4 }, function(err, node) {
  console.log(node); // { name: 'Tricia', id: 4 }
});
```
Additional functionality, including graph comparison, is planned.

Tests
---

```
cd [lumberjack_root_directory]
make test
```
