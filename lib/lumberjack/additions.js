module.exports = function(tree1, tree2) {
  if (!tree1.hasOwnProperty('tree') || !tree2.hasOwnProperty('tree')) {
    throw new Error('Lumberjack.additions expects two instances of Tree.');
  }

  if (!tree1.flattened) tree1.flatten(tree1.tree);
  if (!tree2.flattened) tree2.flatten(tree2.tree);

  var additions = { count: 0, added: {} };

  for (var property in tree2.flattened) {
    if (!tree1.flattened.hasOwnProperty(property)) {
      var parent = tree2.flattened[property].parent;
      var key = parent ? property + '-' + parent : property;

      additions.added[key] = tree2.flattened[property];
      additions.count++;
    } 
  }

  return additions;
};
