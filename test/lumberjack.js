var chai = require('chai'),
    expect = chai.expect,
    Tree = require('../index').Tree;
    Lumberjack = require('../index').Lumberjack;

describe('Lumberjack', function() {
  var l, t1, t2;
  beforeEach(function() {
    l = Lumberjack();
    t1 = Tree(require('./compare.json'));
    t2 = Tree(require('./test.json'));
  });

  afterEach(function() {
    l = t1 = t2 = null;
  });

  it('creates a new instance even when called without new', function() {
    var l = Lumberjack();
    expect(l).to.be.instanceof(Lumberjack);
  });

  describe('removals', function() {
    it('compares two trees and determines removals w/r/t the first tree', function() {
      var removals = l.removals(t1, t2);
      expect(removals.count).to.equal(1);
      expect(removals.removed).to.eql({ 
        '4-2': { 
          some: 'property',
          id: 4,
          parent: 2,
          children: [] 
        }
      });
    });
  });

  describe('additions', function() {
    it('compares two trees and determines additions w/r/t the first tree', function() {
      var additions = l.additions(t1, t2);
      expect(additions.count).to.equal(1);
      expect(additions.added).to.eql({ 
        '3-1': { 
          some: 'property',
          another: [
          'array',
          'of',
          'even',
          'more',
          'things'
          ],
          id: 3,
          parent: 1,
          children: [] 
        }
      });
    });
  });

  describe('compare', function() {
    it('compares two trees and rebuilds the first tree with additions and removals marked', function(done) {
      l.compare(t1, t2, { id: 1 }, function(err, tree) {
        if (err) {
          return console.log(err);
        }

        expect(tree).to.eql({ 
          some: 'property',
          another: [ 'array', 'of', 'things' ],
          id: 1,
          children: [ 
            { 
              some: 'property',
              another: ['array', 'of', 'more', 'things'],
              id: 2,
              children: [ { some: 'property', id: 4, parent: 2, removed: true, children: [] }],
              parent: 1 
            },
           { 
            some: 'property',
             another: ['array', 'of', 'even', 'more', 'things'],
             id: 3,
             children: [],
             parent: 1,
             added: true 
           } 
          ]
        });
        t1.removeTree();
        done();
      });
    });
  });
});
