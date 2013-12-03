module.exports = function(nodeToInsert, parentIdentifier, callback) {
  var self = this;

  this.breadthFirst(this.tree, parentIdentifier, function(err, node) {
    if (err) {
      callback(new Error(err));
    }

    node[self.options.children].push(nodeToInsert);

    return callback(null, node);
  }); 
}