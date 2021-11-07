const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('UnitTests', () => {

  suite('check for valid puzzle string', function() {

    test('handle a puzzle string of 81 chars', function(done) {
      let puzzle1 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let puzzle2 = '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.isTrue(solver.validate(puzzle1));
      assert.isFalse(solver.validate(puzzle2));
      done();
    });

    test('handle a puzzle string with [.1-9] valid chars', function(done) {
      let puzzle1 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let puzzle2 = '.x9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.isTrue(solver.validate(puzzle1));
      assert.isFalse(solver.validate(puzzle2));
      done();
    });

    test('handle an invalid puzzle string not of 81 chars', function(done) {
      let puzzle1 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987';
      let puzzle2 = '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.isFalse(solver.validate(puzzle1));
      assert.isFalse(solver.validate(puzzle2));
      done();
    });

  });

  suite('check for valid placement', function(done) {

    test('handle a valid row placement', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987';
      let val = 7;
      let row = 1;
      let col = 1;
      assert.isTrue(solver.checkRowPlacement(puzzle, row, col, val));
      done();
    });

    test('handle an invalid row placement', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987';
      let val = 5;
      let row = 1;
      let col = 1;
      assert.isFalse(solver.checkRowPlacement(puzzle, row, col, val));
      done();
    });

    test('handle a valid column placement', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987';
      let val = 7;
      let row = 1;
      let col = 1;
      assert.isTrue(solver.checkColPlacement(puzzle, row, col, val));
      done();
    });

    test('handle an invalid column placement', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987';
      let val = 1;
      let row = 1;
      let col = 1;
      assert.isFalse(solver.checkColPlacement(puzzle, row, col, val));
      done();
    });

    test('handle a valid region placement', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987';
      let val = 7;
      let row = 1;
      let col = 1;
      assert.isTrue(solver.checkRegionPlacement(puzzle, row, col, val));
      done();
    });

    test('handle an invalid region placement', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987';
      let val = 2;
      let row = 1;
      let col = 1;
      assert.isFalse(solver.checkRegionPlacement(puzzle, row, col, val));
      done();
    });

  });

  suite('validate the solver', function() {

    test('solver passes a valid string', function(done) {
      let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.isNotFalse(solver.solve(puzzle));
      done();
    });

    test('solver does not pass an invalid string', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..987...';
      assert.isFalse(solver.solve(puzzle));
      done();
    });

    test('solver returns the expected solution for a valid string', function(done) {
      let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
      assert.equal(solver.solve(puzzle), solution);
      done();
    });

  });

});
