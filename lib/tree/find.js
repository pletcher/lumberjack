var _ = require('underscore');

module.exports = function(current, query) {
  var keys = _.keys(query);

  for (var i = 0, l = keys.length; i < l; i++) {
    if (current[keys[i]] === query[keys[i]]) {
      return true;
    }
  }

  return false;
};
