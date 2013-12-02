module.exports = function(tree1, tree2) {
  if (!tree1.hasOwnProperty('tree') || !tree2.hasOwnProperty('tree')) {
    throw new Error('Lumberjack.removals expects two instances of Tree with trees attached.');
  }

  if (!tree1.flattened) tree1.flatten(tree1.tree);
  if (!tree2.flattened) tree2.flatten(tree2.tree);

  var removals = { count: 0, removed: {} };

  for (var property in tree1.flattened) {
    if (!tree2.flattened.hasOwnProperty(property)) {
      var parent = tree1.flattened[property].parent;
      var key = parent ? property + '-' + parent : property;

      removals.removed[key] = tree1.flattened[property];
      removals.count++;
    } 
  }

  return removals;
};
