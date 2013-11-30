module.exports = function(identifier, flattenedTree) {
  var flat = flattenedTree || this.flattenedTree;

  if (!flat) {
    throw new Error('You must supply an object of nodes to rebuild.');
  }

  if (flat.hasOwnProperty(identifier)) {
    return flat[identifier];
  }

  return false;
};
