var chai = require('chai'),
    expect = chai.expect,
    Tree = require('../index').tree,
    Lumberjack = require('../index').lumberjack;

describe('Tree', function() {
  it('creates a new instance even when called without new', function(done) {
    var t = Tree(require('./test.json'));
    expect(t).to.be.defined;
    done();
  });

  describe('default', function() {
    var t;
    
    beforeEach(function() {
      t = new Tree(require('./test.json'));
    });

    afterEach(function() {
      t = null;
    });

    describe('options', function() {
      it('initialize with defaults', function(done) {
        expect(t.options.flat).to.be.false;
        expect(t.options.children).to.equal('children');
        expect(t.options.identifier).to.equal('id');
        expect(t.options.rememberPath).to.be.false;
        done();
      });
    });

    describe('find', function() {
      it('returns false if no node found', function(done) {
        expect(t.find({ id: 1}, { id: 2 })).to.be.false;
        done();
      });

      it('returns true if a node is found', function(done) {
        expect(t.find({ id: 1}, { id: 1 })).to.be.true;
        done();
      });
    });

    describe('setTree', function() {
      it('sets a tree on the instance', function(done) {
        expect(t.tree).to.eql({ 
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
        t.removeTree();
        expect(t.tree).to.be.null;
        done();
      });
    });

    describe('removeFlattenedTree', function() {
      it('removes a flattened tree from the instance', function(done) {
        t.flattened = { '1': { name: 'bob', children: [2] }, '2': { name: 'bill' } };
        t.removeFlattenedTree();
        expect(t.flattened).to.be.null;
        done();
      });
    });

    describe('breadthFirst', function() {
      it('returns an error if query is malformed', function(done) {
        t.breadthFirst(t.tree.root, 3, function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });

      it('finds the right node', function(done) {
        t.breadthFirst(t.tree.root, { id: 1 }, function(err, node) {
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
        t.breadthFirst(t.tree.root, { id: 2 }, { depthFirst: true }, function(err, node) {
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
        t.breadthFirst(t.tree.root, { id: 2 }, function(err, node, path) {
          expect(err).to.not.exist;
          expect(path).to.not.exist;
          done();
        });
      });

      it('returns undefined if no node found', function(done) {
        t.breadthFirst(t.tree.root, { id: 4 }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.be.undefined;
          done();
        });
      });
    });

    describe('depthFirst', function() {
      it('returns an error if query is malformed', function(done) {
        t.depthFirst(t.tree.root, 'adfadf', 5, function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });
    });

    describe('flatten', function() {
      it('flattens a tree', function(done) {
        t.flatten(t.tree.root);
        expect(t.flattenedTree).to.eql(require('./flat_tree.json'));
        done();
      });
    });

    describe('rebuild', function() {
      it('rebuilds a tree from a flat object', function(done) {
        t.flattenedTree = require('./flat_tree.json');
        t.rebuild(t.getNode("1"), { id: 1 });
        expect(t.tree).to.eql(require('./test.json').root);
        done();
      });
    });
  });

  describe('custom', function() {
    var t;
    
    beforeEach(function() {
      t = new Tree(require('./children_test.json'), { children: 'kids' });
    });

    afterEach(function() {
      t = null;
    });

    describe('options', function() {
      it('children', function(done) {
        expect(t.options.children).to.equal('kids');
        done();
      });

      describe('rememberPath', function() {
        it('returns the traversal path if requested', function(done) {
          var _rememberPath = t.options.rememberPath;
          t.options.rememberPath = true;
          t.breadthFirst(t.tree.root, { id: 3 }, function(err, node, path) {
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
            t.options.rememberPath = _rememberPath;
            done();
          });
        });
      });
    });

    describe('breadthFirst', function() {
      it('finds the right node with custom children', function(done) {
        t.breadthFirst(t.tree.root, { id: 3 }, function(err, node) {
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
        t.depthFirst(t.tree.root, { id: 3 }, 3, function(err, node) {
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
        t.depthFirst(t.tree.root, { id: 3 }, 3, function(err, node) {
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
        t.depthFirst(t.tree.root, { id: 4 }, 1, [], function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.be.undefined;
          done();
        });
      });
    });
  });
});
