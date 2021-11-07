class SudokuSolver {

  validate(puzzleString) {
    let reg = /\.|[1-9]/;
    if (puzzleString.length != 81) {
      //console.log(`wrong length: ${puzzleString.length}`);
      return false;
    }
    let filter = puzzleString.split('').filter(elem => {
      if (!reg.test(elem)) {
        //console.log(`"${elem}" is not valid`);
        return true;
      }
    });
    if (filter.length) return false;
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let index = ( row - 1 ) * 9 + ( (column - 1) % 9 );

    if (puzzleString[index] /* == '.' */) {
     if (puzzleString[index] != '.') {
        puzzleString = puzzleString.split('');
        puzzleString[index] = '.';
        puzzleString = puzzleString.join('');
      }  
      
      for (let i = 9 * (row - 1); i < row * 9; i++) {
        if (value == puzzleString[i]) {
          //console.log(`there is already value ${value} on row ${row}`);
          return false;
        }
      }
      //console.log(`value ${value} seems fine on row ${row}`);
      return true;
    } 
    // else {
    //   console.log('cannot override existing value');
    //   return false;
    // }
  }

  checkColPlacement(puzzleString, row, column, value) {
    let index = ( row - 1 ) * 9 + ( (column - 1) % 9 );

    if (puzzleString[index] /* == '.' */) {
      if (puzzleString[index] != '.') {
        puzzleString = puzzleString.split('');
        puzzleString[index] = '.';
        puzzleString = puzzleString.join('');
      }  

      for (let i = column % 9 - 1 ; i <= 81; i += 9) {
        if (value == puzzleString[i]) {
          //console.log(`there is already value ${value} on column ${column}`);
          return false;          
        }
      }
      //console.log(`value ${value} seems fine on column ${column}`);
      return true;
    } 
    // else {
    //   console.log('cannot override existing value');
    //   return false;      
    // }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let index = ( row - 1 ) * 9 + ( (column - 1) % 9 );

    if (puzzleString[index] /* == '.' */) {
      if (puzzleString[index] != '.') {
        puzzleString = puzzleString.split('');
        puzzleString[index] = '.';
        puzzleString = puzzleString.join('');
      }  

      let startRow = Math.floor((row - 1) / 3) * 3 + 1;
      let startCol = Math.floor((column - 1) / 3) * 3 + 1;
      let startIndex = ( startRow - 1 ) * 9 + ( (startCol - 1) % 9 );

      for (let i = startIndex; i <= startIndex + 2; i++) {
        if (puzzleString[i] == value && i != index) {
          //console.log(`there is already value ${value} on the regions starting at (row ${startRow}, column ${startCol})`);
          return false;
        }
        if (puzzleString[i + 9] == value && i + 9 != index) {
          //console.log(`there is already value ${value} on the regions starting at (row ${startRow}, column ${startCol})`);
          return false;
        }
        if (puzzleString[i + 18] == value && i + 18 != index) {
          //console.log(`there is already value ${value} on the region starting at (row ${startRow}, column ${startCol})`);
          return false;
        }
      }
      //console.log(`value ${value} seems fine on the region starting at (row ${startRow}, column ${startCol})`);
      return true;
    } 
    // else {
    //   console.log('cannot override existing value');
    //   return false; 
    // }

  }

  solve(puzzleString) {
    let items = Object.create(null);
    let counts = 0;

    if (!this.validate(puzzleString)) return false;

    do {
      for (let i = 0; i < 81; i++) {
        items[i] = [];
      }

      for (let index = 0; index < 81; index++) {
        let row = Math.floor(index / 9) + 1;
        let col = index % 9 + 1;

        if (puzzleString[index] == '.') {

          for (let val = 1; val <= 9; val++) {

            if ( this.validate(puzzleString) && 
                this.checkRowPlacement(puzzleString, row, col, val) &&
                this.checkColPlacement(puzzleString, row, col, val) &&
                this.checkRegionPlacement(puzzleString, row, col, val) ) {

                  items[index].push(val); 
                  //returnString += String(val);
                  // break;
            }
          }
          if (items[index].length == 1) {
            //console.log(`value ${items[index][0]} appended to result`);
            puzzleString = puzzleString.split('');
            puzzleString[index] = items[index][0];
            puzzleString = puzzleString.join('');
          }
        } 
      }

    counts += 1;
    if (counts > 10) {
      console.log('no solution found');
      return false;
    }

    } while(/\./.test(puzzleString));

     return puzzleString;
  }

}

module.exports = SudokuSolver;

