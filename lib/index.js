var fifo = require('fifo'),
    _ = require('underscore');

var Lumberjack = function(opts) {
  if (!(this instanceof Lumberjack)) return new Lumberjack();

  this.options = {
    children: opts && opts.children || 'children'
  };
};

Lumberjack.prototype = {
  setTree: function(tree) {
    this.tree = tree;
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

  search: function(current, query, options, callback) {
    if (!callback) {
      callback = arguments[2];
      options = {
        depthFirst: false
      };
    }

    if (query instanceof Array || !_.isObject(query)) {
      return callback(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
    }

    var seen = [],
        list, add, remove;

    if (options.depthFirst) {
      list = [];
      add = 'push';
      remove = 'pop';
    } else {
      list = new fifo();
      add = 'unshift';
      remove = 'shift';
    }

    list[add](current);

    while (list.length || (list.getLength && list.getLength())) {
      current = list[remove]();

      if (this.find(current, query)) {
        return callback(null, current);
      }

      var children = current[this.options.children];

      for (var child in children) {
        if (seen.indexOf(children[child]) === -1) {
          seen.push(children[child]);
          list[add](children[child]);
        }
      }
    }

    return callback(null);
  },

  bfs: function(current, query, callback) {
    if (query instanceof Array || !_.isObject(query)) {
      return callback(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
    }

    return this.search(current, query, { depthFirst: false }, callback);
  },

  dfs: function(current, query, callback) {
    if (query instanceof Array || !_.isObject(query)) {
      return callback(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
    }

    return this.search(current, query, { depthFirst: true }, callback);
  },

  recursiveDfs: function(current, query, callback) {
    if (query instanceof Array || !_.isObject(query)) {
      return callback(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
    }

    if (this.find(current, query)) {
      return callback(null, current);
    }

    if (current[this.options.children] != undefined) {
      var children = current[this.options.children];

      for (var child in children) {
        this.recursiveDfs(children[child], query, callback);
      }
    }
  }
};

module.exports = Lumberjack;
