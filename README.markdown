Lumberjack
---

### A library for working with trees (and maybe eventually tries).

API
===

#### General Usage

```javascript
var Lumberjack = require('lumberjack');

var tree = {
  root: {
    name: 'Jake',
    id: 1,
    children: { // by default, Lumberjack looks for a 'children' property; you can override this in the options hash
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

var lumberjack = new Lumberjack(/*options*/);

lumberjack.setTree(tree);

// breadth-first search
lumberjack.bfs(tree.root, { id: 3 }, function(err, node) {
  console.log(node); // { name: 'Mary', id: 3 }
});

// depth-first search
lumberjack.dfs(tree.root, { id: 4 }, function(err, node) {
  console.log(node); // { name: 'Tricia', id: 4 }
});
```

#### Testing

```
cd [lumberjack_root_directory]
make test
```
