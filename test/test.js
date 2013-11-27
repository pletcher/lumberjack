var chai = require('chai'),
    expect = chai.expect,
    Lumberjack = require('../index');

describe('Lumberjack', function() {
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

    describe('bfs', function() {
      it('finds the right node', function(done) {
        l.bfs(l.tree.root, { 'id': 3 }, function(err, node) {
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

      it('returns undefined if node is not found', function(done) {
        l.bfs(l.tree.root, { 'id': 4 }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.be.undefined;
          done();
        });
      });

      it('returns undefined with bad query', function(done) {
        l.bfs(l.tree.root, { 'non-': 'existent' }, function(err, node) {
          expect(err).to.not.exist;
          expect(node).to.be.undefined;
          done();
        });
      });
    });

    describe('dfs', function() {
      it('finds the right node', function(done) {
        l.dfs(l.tree.root, { 'id': 3 }, function(err, node) {
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
        l.bfs(l.tree.root, { 'id': 3 }, function(err, node) {
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
        l.dfs(l.tree.root, { 'id': 3 }, function(err, node) {
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
