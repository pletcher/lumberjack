var fifo = require('fifo'),
    _ = require('underscore');

module.exports = function(current, query, options, callback) {
  if (!callback) {
    callback = arguments[2];
  }
  
  if (query instanceof Array || !_.isObject(query)) {
    return callback(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
  }

  if (options) {
    var rememberPath = options.rememberPath || this.options.rememberPath || false;
  }

  var seen = [],
      list = new fifo();

  list.unshift(current);
  seen.push(current);

  while (list.length) {
    current = list.shift();

    if (this.find(current, query)) {
      return rememberPath ? callback(null, current, seen) :
        callback(null, current);
    }

    var children = current[this.options.children];

    for (var child in children) {
      if (seen.indexOf(children[child]) === -1) {
        list.unshift(children[child]);
        seen.push(children[child]);
      }
    }
  }

  return rememberPath ? callback(null, undefined, seen) :
    callback(null);
};
