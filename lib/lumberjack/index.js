var Lumberjack = function(opts) {
  if (!(this instanceof Lumberjack)) return new Lumberjack();
};

Lumberjack.prototype = {
  additions: require('./additions'),

  removals: require('./removals'),
  
  compare: require('./compare')
};

module.exports = Lumberjack;
