'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  function rowNum(char) {
    let row;
    switch(char) {
      case 'A':
        row = 1;
        break;
      case 'B':
        row = 2;
        break;
      case 'C':
        row = 3;
        break;
      case 'D':
        row = 4;
        break;
      case 'E':
        row = 5;
        break;
      case 'F':
        row = 6;
        break;
      case 'G':
        row = 7;
        break;
      case 'H':
        row = 8;
        break;
      case 'I':
        row = 9;
        break;
      default:
        row = 0;
    }
    return row;
  }

  app.route('/api/check')
    .post((req, res) => {

      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        res.json({error: 'Required field(s) missing'});
      }

      let puzzle = req.body.puzzle;
      let row = rowNum(req.body.coordinate[0]);
      let col = req.body.coordinate[1];
      let val = req.body.value;

      if ((row < 1 || row > 9) || (col < 1 || col > 9)) {
        res.json({error: 'Invalid coordinate'});
      } 

      let reg = /\.|[1-9]/;

      if (!reg.test(val)) {
        res.json({error: 'Invalid value'});

      } else if (puzzle.length != 81) {
        res.json({error: 'Expected puzzle to be 81 characters long'});

      } else if (!solver.validate(puzzle)) {
        res.json({error: 'Invalid characters in puzzle'});

      } else if ( solver.validate(puzzle) &&   
          solver.checkRowPlacement(puzzle, row, col, val) &&
          solver.checkColPlacement(puzzle, row, col, val) && 
          solver.checkRegionPlacement(puzzle, row, col, val) ) {
            res.json({valid: true});

      } else {
        let conflictArr = [];
        if (!solver.checkRowPlacement(puzzle, row, col, val)) {
          conflictArr.push('row');
        }
        if (!solver.checkColPlacement(puzzle, row, col, val)) {
          conflictArr.push('column');
        }
        if (!solver.checkRegionPlacement(puzzle, row, col, val)) {
          conflictArr.push('region');
        }
        res.json({valid: false, conflict: conflictArr});
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {

      if (!req.body.puzzle) {
        res.json({error: 'Required field missing'});
      }
      
      let puzzle = req.body.puzzle;
      console.log(puzzle.length);

      if (puzzle.length != 81) {
        res.json({error: 'Expected puzzle to be 81 characters long'});

      } else if (!solver.validate(puzzle)) {
        res.json({error: 'Invalid characters in puzzle'});

      } else if (!solver.solve(puzzle)) {
        res.json({error: 'Puzzle cannot be solved'});
        
      } else {
        res.json({solution: solver.solve(puzzle)});
      }

    });
};
