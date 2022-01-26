'use strict'

const MINE = '💣'
const FLOOR = '⬜'
const FLAG = '🚩'

var gBoard;
var gLevel;
var gIsVictory = true;
var gMinesLoc = [];

// לא לשכוח להוסיף טיימר!
// להוסיף כפתור ריסטרט (החלטתי פשוט לא לעשות את זה עדיין)

function initGame() {
    gBoard = buildBoard(4, 2);
    printMat(gBoard, '.board-container');
}


function buildBoard(size = 4, mines = 2) {
    var board = [];
    gLevel = {
        size: size,
        mines: mines
    }
    // console.log(gLevel)
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                location: { i: i, j: j },
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    console.table(board)

    addRandomMines(board, mines)
    setMinesNegsCount(board);
    printMat(board, '.board-container');

    return board;
}


// function expandShown(board, elCell, i, j) {

//     for (var i = i - 1; i <= i + 1; i++) {
//         if (i < 0 || i > board.length - 1) continue
//         for (var j = j - 1; j <= j + 1; j++) {
//             if (j < 0 || j > board[0].length - 1) continue
//             if (i === i && j === j) continue
//             var cell = board[i][j];
//             // console.log('cell', cell)

//             if (!cell.isMine) {
//                 cell.isShown = true;
//                 if (board[i][j].minesAroundCount !== 0) elCell.innerText = board[i][j].minesAroundCount;
//                 else elCell.innerText = '';
//             }
//         }
//     }

// }


function cellClicked(elCell) {
    console.log(elCell)

    if (!gIsVictory) return

    var i = elCell.dataset.i;
    var j = elCell.dataset.j;

    if (gBoard[i][j].isMarked) return

    gBoard[i][j].isShown = true;
    // console.log(gBoard[i][j])

    var innerCell = elCell.querySelector('.inner-cell')

    if (gBoard[i][j].isMine) {
        innerCell.innerText = MINE
        gIsVictory = false;
        gameOver(gIsVictory)
    }
    else innerCell.innerText = gBoard[i][j].minesAroundCount

    // else if (innerCell.innerText === '') expandShown(gBoard, elCell, i, j)

    checkGameOver(elCell)

}

function checkGameOver() {
    var count = 0;
    var sumEmptyCells = (gBoard.length ** 2) - gLevel.mines;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown && !gBoard[i][j].isMine) count++
        }
    }
    if (count === sumEmptyCells) gameOver(gIsVictory)
}


function gameOver(isVictory) {

    if (isVictory) {
        console.log('victory')
        for (var i = 0; i < gMinesLoc.length; i++) {
            var locI = gMinesLoc[i].i;
            var locJ = gMinesLoc[i].j;

            gMinesLoc[i].isMarked = true;

            var elCell = document.querySelector([`[data-i="${locI}"][data-j="${locJ}"]`])
            elCell.innerText = FLAG;
        }
    }
    else {
        console.log('you lost')
        for (var i = 0; i < gMinesLoc.length; i++) {
            var locI = gMinesLoc[i].i;
            var locJ = gMinesLoc[i].j;

            gMinesLoc[i].isShown = true;

            var elCell = document.querySelector([`[data-i="${locI}"][data-j="${locJ}"]`])
            elCell.innerText = MINE;
        }

    }
}


function cellMarked(elCell) {
    // console.log(elCell)
    if (!gIsVictory) return
    var i = elCell.dataset.i;
    var j = elCell.dataset.j;
    var flaggedCell = elCell.querySelector('.inner-cell')

    if (gBoard[i][j].isMine) gameOver(!gIsVictory);

    if (gBoard[i][j].isShown) return

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        flaggedCell.innerText = '';
    }
    else {
        gBoard[i][j].isMarked = true;
        flaggedCell.innerText = FLAG
    }
}


function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var minesCount = countMinesAround(board, i, j);
            board[i][j].minesAroundCount = minesCount;
        }
    }
}

function addRandomMines(board, mines) {
    var minesNum = mines

    for (var i = 0; i < minesNum; i++) {
        var randI = getRandomIntIn(0, board.length - 1);
        var randJ = getRandomIntIn(0, board.length - 1);

        board[randI][randJ].isMine = true;

        gMinesLoc.push({ i: randI, j: randJ })
    }
    console.log(gMinesLoc)
}