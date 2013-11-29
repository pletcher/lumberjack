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
            "children": {
              "a": {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "more",
                  "things"
                ],
                "id": 2
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
          }
        });
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

    describe('search', function() {
      it('returns an error if query is malformed', function(done) {
        l.search(l.tree.root, 3, function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });

      it('finds the right node', function(done) {
        l.search(l.tree.root, { id: 1 }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.eql({
            "some": "property",
            "another": [
              "array",
              "of",
              "things"
            ],
            "id": 1,
            "children": {
              "a": {
                "some": "property",
                "another": [
                  "array",
                  "of",
                  "more",
                  "things"
                ],
                "id": 2
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
          });
          done();
        });
      });

      it('allows options overrides', function(done) {
        l.search(l.tree.root, { id: 2 }, { depthFirst: true }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.eql({
            "some": "property",
            "another": [
              "array",
              "of",
              "more",
              "things"
            ],
            "id": 2
          });
          done();
        });
      });

      it('returns undefined if no node found', function(done) {
        l.search(l.tree.root, { id: 4 }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.be.undefined;
          done();
        });
      });
    });

    describe('bfs', function() {
      it('returns an error if query is malformed', function(done) {
        l.bfs(l.tree.root, 3, function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });
    });

    describe('dfs', function() {
      it('returns an error if query is malformed', function(done) {
        l.dfs(l.tree.root, 'adfadf', function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });
    });

    describe('recursiveDfs', function() {
      it('returns an error if query is malformed', function(done) {
        l.recursiveDfs(l.tree.root, 3, function(err, node) {
          expect(err).to.eql(new Error('Query must be of the form { key: value[, key2: value2, etc.] }'));
          done();
        });
      });

      it('finds the right node', function(done) {
        l.recursiveDfs(l.tree.root, { id: 3 }, function(err, node) {
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
      it('allow overrides', function(done) {
        expect(l.options.children).to.equal('kids');
        done();
      });
    });

    describe('bfs', function() {
      it('finds the right node with custom children', function(done) {
        l.bfs(l.tree.root, { id: 3 }, function(err, node) {
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

    describe('dfs', function() {
      it('finds the right node with custom children', function(done) {
        l.dfs(l.tree.root, { id: 3 }, function(err, node) {
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
  });
});
