function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}



function printMat(mat, selector) {
    var strHTML = '<table class="board"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            strHTML += `<td oncontextmenu="cellMarked(this)" class="cell" data-i=${i} data-j=${j} onclick="cellClicked(this) 
        "><div class="inner-cell" "></div></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


function getRandomIntIn(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function countMinesAround(mat, rowIdx, colIdx) {
    // console.log('rowIdx', rowIdx)
    // console.log('colIdx', colIdx)
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j];
            // console.log('cell', cell)
            if (cell.isMine === true) count++
        }
    }
    // console.log('count', count)
    return count
}



//   function findEmptyCells(board) {
//     var emptyCells = [];
//     for (var i = 1; i <= board.length - 2; i++) {
//       var currRow = board[i];
//       for (var j = 1; j <= currRow.length - 2; j++) {
//         var currCell = currRow[j];
//         if (currCell === FOOD || currCell === EMPTY) emptyCells.push({ i: i, j: j });
//       }
//     }
//     return emptyCells
//   }