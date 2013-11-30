var _ = require('underscore');

var Lumberjack = function(opts) {
  if (!(this instanceof Lumberjack)) return new Lumberjack();

  this.options = {
    children: opts && opts.children || 'children',
    identifier: opts && opts.identifier || 'id',
    rememberPath: opts && opts.rememberPath || false
  };
};

Lumberjack.prototype = {
  setTree: function(tree) {
    this.tree = tree;
  },

  removeTree: function() {
    this.tree = null;
  },

  removeFlattenedTree: function() {
    this.flattenedTree = null;
  },

  find: function(current, query) {
    var keys = _.keys(query);

    for (var i = 0, l = keys.length; i < l; i++) {
      if (current[keys[i]] === query[keys[i]]) {
        return true;
      }
    }

    return false;
  },

  getNode: require('./get_node'),

  breadthFirst: require('./breadth_first'),

  depthFirst: require('./depth_first'),

  flatten: require('./flatten'),

  rebuild: require('./rebuild')
};

module.exports = Lumberjack;
