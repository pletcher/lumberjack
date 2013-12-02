module.exports = function(tree1, tree2, rootIdentifier, callback) {
  var additions = this.additions(tree1, tree2);
  var numberOfAdditions = additions.count;
  additions = additions.added;

  var removals = this.removals(tree1, tree2);
  var numberOfRemovals = removals.count;
  removals = removals.removed;

  var identifier = tree1.options.id;

  if (!tree1.flattened) tree1.flatten(tree1.tree);

  for (var addition in additions) {
    var split = addition.split('-')
    var parent = split[1];
    var query = {};
    query[tree1.options.identifier] = parent;

    tree1.breadthFirst(tree1.tree, query, function(err, node) {
      if (err) {
        return callback(err);
      }

      additions[addition].added = true;
      node[tree1.options.children].push(additions[addition]);

      --numberOfAdditions;

      if (numberOfAdditions === 0) {
        for (var removal in removals) {
          var split = removal.split('-')
          var id = split[0];
          var parent = split[1];
          var query = {};
          query[tree1.options.identifier] = id;

          tree1.breadthFirst(tree1.tree, query, function(err, node) {
            if (err) {
              return callback(err);
            }

            node.removed = true;

            --numberOfRemovals;

            if (numberOfRemovals === 0) {
              return callback(null, tree1.tree);
            }
          });
        }
      }
    });
  }
};
