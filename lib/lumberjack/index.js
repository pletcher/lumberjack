var Lumberjack = function(opts) {
  if (!(this instanceof Lumberjack)) return new Lumberjack();
};

Lumberjack.prototype = {
  compare: require('./compare')
};

module.exports = Lumberjack;
