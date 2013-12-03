module.exports = function(current, rootIdentifier) {
  if (rootIdentifier && this.find(current, rootIdentifier)) {
    this.removeTree();
    this.setTree(current);
  }

  var children = current[this.options.children];

  if (children) {
    for (var child in children) {
      current[this.options.children][child] = this.getNode(children[child]);
      this.rebuild(current[this.options.children][child]);
    }
  }
};
