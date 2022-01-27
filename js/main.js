'use strict'

const MINE = '💣';
const FLAG = '🚩';

var gBoard;
var gIsVictory = true;
var gMinesLoc = [];
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesCount: 3,
    hint: false
};

function initGame() {
    printMat(buildBoard(gLevel.size, gLevel.mines), '.board-container');
    stopTime();
    gGame.isOn = true;
    gIsVictory = true;
    var elTimer = document.querySelector('.control-panel .timer');
    elTimer.innerHTML = '00:00:00';
    var elLives = document.querySelector('.control-panel .lives span');
    elLives.innerText = gGame.livesCount;
    gGame.livesCount = 3;
    var elRestart = document.querySelector('.control-panel .restart');
    elRestart.innerText = '😀';
    gHintCount = 3;
    var elHints = document.querySelector('.control-panel .hint span');
    elHints.innerText = gHintCount;
    gSafeClickCount = 3;
    var elSafe = document.querySelector('.control-panel .safe-click span');
    elSafe.innerText = gSafeClickCount ;
}


function buildBoard(size = 4, mines = 2) {
    gMinesLoc = [];
    var board = [];
    gLevel.size = size;
    gLevel.mines = mines;

    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                location: { i: i, j: j },
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isRevealed: false
            };
        }
    }

    gBoard = board;
    return board;
}


function cellClicked(elCell) {
    if (!gIsVictory) return;

    if (gGame.isOn) {
        addRandomMines(gBoard, gLevel.mines);
        setMinesNegsCount(gBoard);
        startTime();
        gGame.isOn = false;
    }

    gCurrI = +elCell.dataset.i;
    gCurrJ = +elCell.dataset.j;

    if (gBoard[gCurrI][gCurrJ].isMarked) return;

    gBoard[gCurrI][gCurrJ].isShown = true;

    var innerCell = elCell.querySelector('.inner-cell');

    if (gBoard[gCurrI][gCurrJ].isMine) {
        gGame.livesCount--;
        innerCell.innerText = MINE;
        var elLives = document.querySelector('.control-panel .lives span');
        elLives.innerHTML = gGame.livesCount;

        if (gGame.livesCount === 0 || gGame.livesCount === 1 && gLevel.mines === 2) {
            innerCell.innerText = MINE;
            gIsVictory = false;
            gameOver(gIsVictory);
        }
    }
    else if (gBoard[gCurrI][gCurrJ].minesAroundCount === '') {
        innerCell.innerText = gBoard[gCurrI][gCurrJ].minesAroundCount;
        expandShown(gBoard, gCurrI, gCurrJ);
    }
    else {
        innerCell.innerText = gBoard[gCurrI][gCurrJ].minesAroundCount;
        gBoard[gCurrI][gCurrJ].isRevealed = true;

        if (gGame.hint) setTimeout(() => {
            innerCell.innerText = ''
            gGame.hint = false
            console.log(gGame.hint)
        }, 1000);
    }
    checkGameOver(elCell);
}

function expandShown(board, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j];
            if (cell.isMine) continue
            if (!gGame.hint) cell.isRevealed = true;

            cell.isShown = true;
            var cellAround = document.querySelector([`[data-i="${i}"][data-j="${j}"]`])
            var innerCell = cellAround.querySelector('.inner-cell')
            innerCell.innerText = cell.minesAroundCount;
        }
    }
    if (gGame.hint) setTimeout(hideCells, 2000);
}

function checkGameOver() {
    var sumEmptyCells = (gBoard.length ** 2) - gLevel.mines;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown && !gBoard[i][j].isMine) gGame.shownCount++
        }
    }
    if (gGame.shownCount === sumEmptyCells) gameOver(gIsVictory)
}


function gameOver(isVictory) {

    if (isVictory) {
        console.log('victory')
        stopTime()
        for (var i = 0; i < gMinesLoc.length; i++) {
            var locI = gMinesLoc[i].i;
            var locJ = gMinesLoc[i].j;

            gMinesLoc[i].isMarked = true;

            var elCell = document.querySelector([`[data-i="${locI}"][data-j="${locJ}"]`])
            elCell.innerText = FLAG;
        }
        var elRestart = document.querySelector('.control-panel .restart');
        elRestart.innerText = '😎';
    }
    else {
        console.log('you lost')
        stopTime()
        for (var i = 0; i < gMinesLoc.length; i++) {
            var locI = gMinesLoc[i].i;
            var locJ = gMinesLoc[i].j;

            gMinesLoc[i].isShown = true;

            var elCell = document.querySelector([`[data-i="${locI}"][data-j="${locJ}"]`])
            elCell.innerText = MINE;
        }
        var elRestart = document.querySelector('.control-panel .restart');
        elRestart.innerText = '🤯';
    }
}


function cellMarked(elCell) {

    if (!gIsVictory) return
    if (gGame.isOn) startTime();

    var i = elCell.dataset.i;
    var j = elCell.dataset.j;
    var flaggedCell = elCell.querySelector('.inner-cell')

    if (gBoard[i][j].isShown) return

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        flaggedCell.innerText = '';
        gGame.markedCount--
    }
    else {
        gBoard[i][j].isMarked = true;
        flaggedCell.innerText = FLAG
        gGame.markedCount++
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
    minesNum = 0;
}