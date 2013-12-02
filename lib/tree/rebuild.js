module.exports = function(current, rootIdentifier) {
  if (rootIdentifier && this.find(current, rootIdentifier)) {
    this.removeTree();
    this.setTree(current);
  }

  var children = current[this.options.children];

  if (children && children.length) {
    for (var i = 0; i < children.length; i++) {
      current[this.options.children][i] = this.getNode(children[i]);
      this.rebuild(current[this.options.children][i]);
    }
  }
};
