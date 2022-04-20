function addClass(square, state) {
    if (state === activeColor) {
        square.classList.remove(inactiveColor);
        square.classList.add(activeColor);
    } else {
        square.classList.remove(activeColor);
        square.classList.add(inactiveColor);
    }
}

function isRight(direction) {
    return direction === 'right';
}

function show(elem) {
    elem.style.display = 'block';
}

function hide(elem) {
    elem.style.display = 'none';
}

function isFirstSquareActive(index, line) {
    return index === 0 && line.classList.contains(activeColor);
}

function isLastSquareActive(index, line) {
    return (index === line.length - 1) && line[index].classList.contains(activeColor);
}

function isSquareActive(square) {
    square.classList.contains(activeColor);
}

function inactiveLeftSquare(index, line) {
    if (index > 0) {
        line[index - 1].classList.remove(activeColor);
        line[index - 1].classList.add(inactiveColor);
    }
}

function inactiveRightSquare(index, line) {
    if (index < line.length - 1) {
        line[index + 1].classList.remove(activeColor);
        line[index + 1].classList.add(inactiveColor);
    }
}

function isNotClicked(currentLine) {
    return currentLine.filter(square => square?.classList.contains(activeColor)).length === 0;
}

function isInvalidSquare(currentLine, previousLine, index) {
    return currentLine[index]?.classList.contains(activeColor)
        && previousLine[index]?.classList.contains(inactiveColor);
}

function turnOffDisplay() {
    Array(10).fill().forEach((_, index) => {
        const line = [...document.getElementsByClassName(`line_${index + 1}`)]
        line.forEach(square => addClass(square, inactiveColor))
    })
}

function getClauses(direction, line) {
    let startClause;
    let stopClause;

    if (isRight(direction)) {
        startClause = 0;
        stopClause = 'startClause < line.length - lineSize + 1';
    } else {
        startClause = line.length - 1;
        stopClause = 'startClause >= lineSize - 1';
    }
    return { startClause, stopClause };
}

function getConditionActive(direction, startClause, line) {
    return isRight(direction) ?
        isFirstSquareActive(startClause, line[startClause]) :
        isLastSquareActive(startClause, line);
}

function inactiveSquare(direction, startClause, line, lineSize) {
    if (isRight(direction)) {
        inactiveLeftSquare(startClause, line);
        drawSquares[lineSize](startClause, line, 'right');
    } else {
        inactiveRightSquare(startClause, line);
        drawSquares[lineSize](startClause, line, 'left');
    }
}

function getCurrentLine(line) {
    return Array.from(line)
        .map(elem => elem.classList.contains(activeColor) ? elem : null);
}

function removeInvalidSquares(currentLine) {
    const previousLine = lines[`line_${levelNumber - 1}`];
    currentLine.forEach((square, index) => {
        if (isInvalidSquare(currentLine, previousLine, index)) {
            currentLineSize = currentLineSize - 1;
            addClass(square, inactiveColor);
        }
    })
}

function startNextLevel() {
    levelNumber = levelNumber + 1;
    startCurrentLevel();
}

function startCurrentLevel() {
    if (levelNumber <= 10 && stopLine === false) {
        startLevel();
    } else {
        showMessageEndGame(true);
    }
}

function isAllSquaresInactive(currentLine) {
    return currentLine.filter(square => square?.classList.contains(activeColor)).length === 0;
}

function showMessageEndGame(won) {
    resetGameOptions();
    messageEndgame.textContent = won ? 'YOU WON !!!' : 'GAME OVER';
    messageEndgame.style.color = won ? "#0f0" : '#f00';
    show(messageEndgame);
    show(startButton);
    hide(pressButton);
    turnOffDisplay();
}

function resetGameOptions() {
    stopLine = true;
    levelNumber = 0;
    currentLineSize = 3;
}