const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('solve the puzzle - POST /api/solve', function() {

    test('solve a puzzle with a valid puzzle string', function(done) {
      let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let solution =  '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: puzzle})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.solution, solution);
          done();
        });
    });

    test('solve a puzzle with a missing puzzle string', function(done) {
      let puzzle = '';
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: puzzle})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });   
  
    test('solve a puzzle with invalid characters', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9....x.1945....4.37.4.3..6..';
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: puzzle})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    }); 

    test('solve a puzzle with incorrect length', function(done) {
      let puzzle = '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: puzzle})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    }); 

    test('solve a puzzle that cannot be solved', function(done) {
      let puzzle = '999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: puzzle})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    }); 

  });

  suite('check for valid elements - POST /api/check', function() {

    test('check a puzzle placement with all fields', function(done) {
      let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let coord = 'A1';
      let val = 7;  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });
  
    test('check a puzzle placement with a single conflict', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'A1';
      let val = 2;  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 1);
          assert.isFalse(res.body.valid);
          done();
        });
    });

    test('check a puzzle placement with 2 conflicts', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'A1';
      let val = 1;  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 2);
          assert.isFalse(res.body.valid);
          done();
        });
    });

    test('check a puzzle placement with all 3 conflicts', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'A1';
      let val = 5;  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 3);
          assert.isFalse(res.body.valid);
          done();
        });
    });

    test('check a puzzle placement with missing required fields', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'A1';
      let val;  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('check a puzzle placement with invalid characters', function(done) {
      let puzzle = '.x9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'A1';
      let val = '7';  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('check a puzzle placement with incorrect length', function(done) {
      let puzzle = '.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'A1';
      let val = '7';  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('check a puzzle placement with invalid placement coordinate', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'x1';
      let val = '7';  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('check a puzzle placement with invalid placement value', function(done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let coord = 'A1';
      let val = 'x';  
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzle, coordinate: coord, value: val})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });

  });

});

