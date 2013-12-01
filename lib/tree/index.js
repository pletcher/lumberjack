var _ = require('underscore');

var Tree = function(tree, opts) {
  if (!tree) throw new Error('You must instantiate with a tree');
  if (!(this instanceof Tree)) return new Tree(tree, opts);

  this.options = {
    flat: opts && opts.flat || false,
    children: opts && opts.children || 'children',
    identifier: opts && opts.identifier || 'id',
    rememberPath: opts && opts.rememberPath || false
  };

  if (this.options.flat) {
    var keys = _.keys(tree);
    this.flattened = tree;
    this.tree = this.rebuild(this.flattened[keys[0]], keys[0]);
  } else {
    this.tree = tree;
  }
};

Tree.prototype = {
  setTree: function(tree) {
    if (!tree) throw new Error('setTree must be called with a tree');

    this.tree = tree;
  },

  removeTree: function() {
    this.tree = null;
  },

  removeFlattenedTree: function() {
    this.flattened = null;
  },

  find: require('./find'),

  getNode: require('./get_node'),

  breadthFirst: require('./breadth_first'),

  depthFirst: require('./depth_first'),

  flatten: require('./flatten'),

  rebuild: require('./rebuild')
};

module.exports = Tree;