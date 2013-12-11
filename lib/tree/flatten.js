var _ = require('underscore');

module.exports = function(current, parent) {
  function _children(children, identifier) {
    if (children === undefined) return [];

    var ret = [];

    _.each(children, function(child) {
      ret.push(child[identifier]);
    });

    return ret;
  }

  if (!this.flattened) {
    this.flattened = {};
  }

  var flat = this.flattened;
  var childrenIdentifier = this.options.children;
  var children = current[childrenIdentifier];
  var identifier = this.options.identifier;

  if (parent) {
    current.parent = parent;
  }

  if (flat.hasOwnProperty(current[identifier])) {
    current.cycle = true;
  }

  flat[current[identifier]] = _.omit(current, childrenIdentifier);
  flat[current[identifier]][childrenIdentifier] = _children(children, identifier);

  if (children != undefined) {
    var self = this;
    _.each(children, function(child) {
      self.flatten(child, current[identifier]);
    });
  }
};
