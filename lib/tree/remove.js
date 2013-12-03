module.exports = function(nodeIdentifier, callback) {
  var self = this;

  this.breadthFirst(this.tree, nodeIdentifier, { rememberPath: true }, function(err, node, path) {
    if (err) {
      return callback(err);
    }

    for (var i = 0, l = path.length; i < l; i++) {
      var children = path[i][self.options.children];
      for (var j = 0, l = children.length; j < l; i++) {
        return (function(x) {
          if (self.find(children[x], nodeIdentifier)) {
            children.splice(x, 1);
            return callback(null, node);
          }
        })(j);
      }
    }
  });
}