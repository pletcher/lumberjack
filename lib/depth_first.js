var _ = require('underscore');

module.exports = function(current, query, seen, callback) {
  if (callback === undefined) {
    callback = arguments[2];
    seen = [];
  }

  if (query instanceof Array || !_.isObject(query)) {
    return callback(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
  }

  seen.push(current);

  if (this.find(current, query)) {
    return this.options.rememberPath ? callback(null, current, seen) :
      callback(null, current);
  }

  if (current[this.options.children] != undefined) {
    var children = current[this.options.children];

    for (var child in children) {
      this.depthFirst(children[child], query, seen, callback);
    }
  }
};
