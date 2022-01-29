var gTimer = new Timer();
var gLives = '';
var gHintCount;
var gCurrI;
var gCurrJ;
var gSafeClickCount;

function startTime() {
    gTimer.start({ precision: 'secondTenths' });
    gTimer.addEventListener('secondTenthsUpdated', function (e) {
        $('.control-panel .timer').html(gTimer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']));
    });
}

function stopTime() {
    gTimer.stop();
}

function gGameHintTrue() {
    if (gHintCount === 0) return
    gGame.hint = true;
    gHintCount--
    var elHints = document.querySelector('.control-panel .hint span');
    elHints.innerText = gHintCount;
}


function hideCells() {
    for (var i = gCurrI - 1; i <= gCurrI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = gCurrJ - 1; j <= gCurrJ + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === gCurrI && j === gCurrJ) continue
            var cell = gBoard[i][j];
            if (cell.isMine || cell.isMarked || cell.isRevealed) continue
            if (cell.isShown) cell.isShown = false;
            else continue
            
            var cellAround = document.querySelector([`[data-i="${i}"][data-j="${j}"]`])
            var innerCell = cellAround.querySelector('.inner-cell')
            innerCell.innerText = '';
            cellAround.style.backgroundColor = '#dadde2';
        }
    }
    var elCell = document.querySelector([`[data-i="${gCurrI}"][data-j="${gCurrJ}"]`])
    elCell.style.backgroundColor = '#dadde2';
    gGame.hint = false;
}


function safeClick() {
    if (gSafeClickCount === 0) return

    var safeCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            cell = gBoard[i][j];
            if (cell.isShown || cell.isMine) continue
            safeCells.push(cell);
        }
    }
    var randCellIdx = getRandomIntIn(0, safeCells.length - 1);
    var randSafeCell = safeCells[randCellIdx];

    var locI = randSafeCell.location.i;
    var locJ = randSafeCell.location.j;

    var elCell = document.querySelector(`.board-container [data-i="${locI}"][data-j="${locJ}"] `);
    elCell.style.backgroundColor = '#ff000085';

    setTimeout(() => {
        elCell.style.backgroundColor = '';
    }, 3000)

    gSafeClickCount--
    var elSafe = document.querySelector('.control-panel .safe-click span');
    elSafe.innerText = gSafeClickCount
}
