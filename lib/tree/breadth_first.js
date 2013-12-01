var fifo = require('fifo'),
    _ = require('underscore');

module.exports = function(current, query, options, callback) {
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
      explored = [],
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
  seen.push(current);

  while (list.length || (list.getLength && list.getLength())) {
    current = list[remove]();

    if (this.find(current, query)) {
      return this.options.rememberPath ? callback(null, current, seen) :
        callback(null, current);
    }

    var children = current[this.options.children];

    for (var child in children) {
      if (seen.indexOf(children[child]) === -1) {
        list[add](children[child]);
        seen.push(children[child]);
      }
    }
  }

  return this.options.rememberPath ? callback(null, undefined, seen) :
    callback(null);
};
