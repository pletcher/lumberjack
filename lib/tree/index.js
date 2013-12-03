var _ = require('underscore');

var Tree = function(tree, opts) {
  if (!tree) throw new Error('Tree must be instantiated with a tree');
  if (!(this instanceof Tree)) return new Tree(tree, opts);

  this.options = {
    flat: opts && opts.flat || false,
    children: opts && opts.children || 'children',
    identifier: opts && opts.identifier || 'id',
    rememberPath: opts && opts.rememberPath || false
  };

  if (this.options.flat) {
    var keys = _.keys(tree);
    var identifier = {};
    identifier[this.options.identifier] = keys[0];
    this.flattened = tree;
    this.rebuild(this.flattened[keys[0]], identifier);
  } else {
    this.tree = tree;
  }

  return this;
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

  insert: require('./insert'),

  remove: require('./remove'),

  breadthFirst: require('./breadth_first'),

  depthFirst: require('./depth_first'),

  flatten: require('./flatten'),

  rebuild: require('./rebuild')
};

module.exports = Tree;
