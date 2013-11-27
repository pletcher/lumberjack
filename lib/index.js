var Queue = require('./queue');

var Lumberjack = function(opts) {
  this.options = {
    children: opts && opts.children || 'children'
  };
};

Lumberjack.prototype = {
  setTree: function(tree) {
    this.tree = tree;
  },

  bfs: function(current, query, callback) {
    var queue = new Queue();
    var set = [];

    queue.enqueue(current);

    while (!queue.isEmpty()) {
      var current = queue.dequeue();
      var keys = Object.keys(query);

      for (var i = 0, l = keys.length; i < l; i++) {
        if (current[keys[i]] === query[keys[i]]) {
          return callback(null, current);
        }
      }

      var children = current[this.options.children];

      for (var child in children) {
        if (set.indexOf(children[child]) === -1) {
          set.push(children[child]);
          queue.enqueue(children[child]);
        }
      }
    }

    return callback(null);
  },

  dfs: function(current, query, callback) {
    var keys = Object.keys(query);

    for (var i = 0, l = keys.length; i < l; i++) {
      if (current[keys[i]] === query[keys[i]]) {
        return callback(null, current);
      }
    }

    if (current[this.options.children] != undefined) {
      var children = current[this.options.children];
      for (var child in children) {
        this.dfs(children[child], query, callback);
      }
    }
  }
};

module.exports = Lumberjack;
