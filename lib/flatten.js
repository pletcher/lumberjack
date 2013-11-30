var _ = require('underscore');

module.exports = function(current) {
  function _children(children) {
    if (children === undefined) return [];

    var ret = [];

    _.each(children, function(child) {
      ret.push(child['id']);
    });

    return ret;
  }

  if (!this.flattenedTree) {
    this.flattenedTree = {};
  }

  var flat = this.flattenedTree;
  var children = current[this.options.children];

  flat[current[this.options.identifier]] = _.omit(current, this.options.children);
  flat[current[this.options.identifier]][this.options.children] = _children(children);

  if (children != undefined) {
    var self = this;
    _.each(children, function(child) {
      self.flatten(child);
    });
  }
};
