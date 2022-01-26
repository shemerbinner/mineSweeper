'use strict'

const MINE = '💣'
const FLOOR = '⬜'
const FLAG = '🚩'

var gBoard;
var gLevel = {
    size: 4,
    mines: 2
};
var gIsVictory = true;
var gMinesLoc = [];



function initGame() {
    gBoard = buildBoard();
    printMat(gBoard, '.board-container');

}

function buildBoard() {
    var SIZE = gLevel.size;
    var board = [];

    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
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

    addRandomMines(board)
    setMinesNegsCount(board);

    return board;
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
            elCell.style.visibility = 'visible';
        }

    }
}


function cellMarked(elCell) {
    // console.log(elCell)

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

    checkGameOver(elCell)

}


function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var minesCount = countMinesAround(board, i, j);
            board[i][j].minesAroundCount = minesCount;
        }
    }


}

function addRandomMines(board) {
    var minesNum = gLevel.mines

    for (var i = 0; i < minesNum; i++) {
        var randI = getRandomIntIn(0, board.length - 1);
        var randJ = getRandomIntIn(0, board.length - 1);

        board[randI][randJ].isMine = true;

        gMinesLoc.push({ i: randI, j: randJ })
    }
    console.log(gMinesLoc)
}