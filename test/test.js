var chai = require('chai'),
    expect = chai.expect,
    Lumberjack = require('../index');

describe('Lumberjack', function() {
  it('creates a new instance even when called without new', function(done) {
    var l = Lumberjack();
    expect(l).to.be.an.instanceof(Lumberjack);
    done();
  });

  describe('default', function() {
    var l;
    
    beforeEach(function() {
      l = new Lumberjack();
      l.setTree(require('./test.json'));
    });

    afterEach(function() {
      l = null;
    });

    describe('options', function() {
      it('initialize with defaults', function(done) {
        expect(l.options.children).to.equal('children');
        expect(l.options.rememberPath).to.be.false;
        done();
      });
    });

    describe('setTree', function() {
      it('sets a tree on the instance', function(done) {
        expect(l.tree).to.eql({ 
          "root": {
            "some": "property",
            "another": [
              "array",
              "of",
              "things"
            ],
            "id": 1,
            "children": [
              {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "more",
                  "things"
                ],
                "id": 2,
                "children": []
              },
              {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "even",
                  "more",
                  "things"
                ],
                "id": 3,
                "children": []
              }
            ]
          }
        });
        done();
      });
    });

    describe('removeTree', function() {
      it('removes a tree from the instance', function(done) {
        var _tree = l.tree;
        l.removeTree();
        expect(l.tree).to.be.null;
        done();
      });
    });

    describe('removeFlattenedTree', function() {
      it('removes a flattened tree from the instance', function(done) {
        l.flattenedTree = { '1': { name: 'bob', children: [2] }, '2': { name: 'bill' } };
        l.removeFlattenedTree();
        expect(l.flattenedTree).to.be.null;
        done();
      });
    });

    describe('find', function() {
      it('returns false if no node found', function(done) {
        expect(l.find({ id: 1}, { id: 2 })).to.be.false;
        done();
      });

      it('returns true if a node is found', function(done) {
        expect(l.find({ id: 1}, { id: 1 })).to.be.true;
        done();
      });
    });

    describe('breadthFirst', function() {
      it('returns an error if query is malformed', function(done) {
        l.breadthFirst(l.tree.root, 3, function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });

      it('finds the right node', function(done) {
        l.breadthFirst(l.tree.root, { id: 1 }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.eql({
            "some": "property",
            "another": [
              "array",
              "of",
              "things"
            ],
            "id": 1,
            "children": [
              {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "more",
                  "things"
                ],
                "id": 2,
                "children": []
              },
              {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "even",
                  "more",
                  "things"
                ],
                "id": 3,
                "children": []
              }
            ]
          });
          done();
        });
      });

      it('allows options overrides', function(done) {
        l.breadthFirst(l.tree.root, { id: 2 }, { depthFirst: true }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.eql({
            "some": "property",
            "another": [
              "array",
              "of",
              "more",
              "things"
            ],
            "id": 2,
            "children": []
          });
          done();
        });
      });

      it('does not return the traversal path by default', function(done) {
        l.breadthFirst(l.tree.root, { id: 2 }, function(err, node, path) {
          expect(err).to.not.exist;
          expect(path).to.not.exist;
          done();
        });
      });

      it('returns undefined if no node found', function(done) {
        l.breadthFirst(l.tree.root, { id: 4 }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.be.undefined;
          done();
        });
      });
    });

    describe('depthFirst', function() {
      it('returns an error if query is malformed', function(done) {
        l.depthFirst(l.tree.root, 'adfadf', 5, function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });
    });

    describe('flatten', function() {
      it('flattens a tree', function(done) {
        l.flatten(l.tree.root);
        expect(l.flattenedTree).to.eql(require('./flat_tree.json'));
        done();
      });
    });

    describe('rebuild', function() {
      it('rebuilds a tree from a flat object', function(done) {
        l.flattenedTree = require('./flat_tree.json');
        l.rebuild(l.getNode("1"), { id: 1 });
        expect(l.tree).to.eql(require('./test.json').root);
        done();
      });
    });
  });

  describe('custom', function() {
    var l;
    
    beforeEach(function() {
      l = new Lumberjack({ children: 'kids' });
      l.setTree(require('./children_test.json'));
    });

    afterEach(function() {
      l = null;
    });

    describe('options', function() {
      it('children', function(done) {
        expect(l.options.children).to.equal('kids');
        done();
      });

      describe('rememberPath', function() {
        it('returns the traversal path if requested', function(done) {
          var _rememberPath = l.options.rememberPath;
          l.options.rememberPath = true;
          l.breadthFirst(l.tree.root, { id: 3 }, function(err, node, path) {
            expect(path.length).to.equal(3);
            expect(path).to.eql([
              {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "things"
                ],
                "id": 1,
                "kids": {
                  "a": {
                    "some": "property",
                    "another": [
                      "array",
                      "of",
                      "more",
                      "things"
                    ],
                    "id": 2,
                    "kids": {
                      "c": {
                        "some": "property"
                      }
                    }
                  },
                  "b": {
                    "some": "property",
                    "another": [
                      "array",
                      "of",
                      "even",
                      "more",
                      "things"
                    ],
                    "id": 3
                  }
                }
              },
              {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "more",
                  "things"
                ],
                "id": 2,
                "kids": {
                  "c": {
                    "some": "property"
                  }
                }
              },
              {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "even",
                  "more",
                  "things"
                ],
                "id": 3
              }
            ]);
            l.options.rememberPath = _rememberPath;
            done();
          });
        });
      });
    });

    describe('breadthFirst', function() {
      it('finds the right node with custom children', function(done) {
        l.breadthFirst(l.tree.root, { id: 3 }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.eql({
            "some": "property",
            "another": [
              "array",
              "of",
              "even",
              "more",
              "things"
            ],
            "id": 3
          });
          done();
        });
      });
    });

    describe('depthFirst', function() {
      it('finds the right node with custom children', function(done) {
        l.depthFirst(l.tree.root, { id: 3 }, 3, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.eql({
            "some": "property",
            "another": [
              "array",
              "of",
              "even",
              "more",
              "things"
            ],
            "id": 3
          });
          done();        
        });
      });

      it('works even with undefined depth', function(done) {
        l.depthFirst(l.tree.root, { id: 3 }, 3, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.eql({
            "some": "property",
            "another": [
              "array",
              "of",
              "even",
              "more",
              "things"
            ],
            "id": 3
          });
          done();        
        });
      });

      it('returns undefined if it reaches max depth without finding a node', function(done) {
        l.depthFirst(l.tree.root, { id: 4 }, 1, [], function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.be.undefined;
          done();
        });
      });
    });
  });
});
