module.exports = function(identifier, flattened) {
  var flat = flattened || this.flattened;

  if (!flat) {
    throw new Error('You must supply an object of nodes to rebuild.');
  }

  if (typeof identifer === 'string' && identifier.indexOf('-') !== -1) {
    identifier = identifier.split('-')[0];
  }

  if (flat.hasOwnProperty(identifier)) {
    return flat[identifier];
  }

  return false;
};
