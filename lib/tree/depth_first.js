var _ = require('underscore');

module.exports = function(current, query, depth, seen, callback) {
  if (!callback) {
    callback = arguments[3];
    seen = [];
  }

  if (depth === undefined) {
    callback = arguments[2];
    depth = Infinity;
  }

  if (query instanceof Array || !_.isObject(query)) {
    return callback(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
  }

  seen.push(current);

  if (this.find(current, query)) {
    return this.options.rememberPath ? callback(null, current, seen) :
      callback(null, current);
  }

  if (current[this.options.children] && depth >= 0) {
    var children = current[this.options.children];

    for (var child in children) {
      this.depthFirst(children[child], query, depth - 1, seen, callback);
    }
  } else if (depth < 0) {
    return this.options.rememberPath ? callback(null, undefined, seen) :
      callback(null, undefined);
  }
};
