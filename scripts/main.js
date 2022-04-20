const display = document.querySelector('.display');
const messageEndgame = document.querySelector('.message');
const startButton = document.querySelector('.start_button');
const pressButton = document.querySelector('.press_button');
pressButton.addEventListener('click', (e) => stopLine = true);

let stopLine = false;
let levelNumber = 1;
let currentLineSize = 3;
const activeColor = 'active';
const inactiveColor = 'inactive';
const speedLevel = [240, 210, 180, 150, 120, 90, 80, 70, 60, 50];
const selectLineSize = {
    level1: 3,
    level2: 3,
    level3: 3,
    level4: 2,
    level5: 2,
    level6: 1,
    level7: 1,
    level8: 1,
    level9: 1,
    level10: 1,
};

const lines = Array(10).fill().map((_, index) => {
    return { [`line_${index + 1}`]: document.getElementsByClassName(`line_${index + 1}`) }
}).reduce((obj, item) => Object.assign(obj, item));

const drawSquares = {
    3: (index, line, direction) => {
        addClass(line[index], activeColor)
        if (isRight(direction)) {
            addClass(line[index + 1], activeColor)
            addClass(line[index + 2], activeColor)
        } else {
            addClass(line[index - 1], activeColor)
            addClass(line[index - 2], activeColor)
        }
    },
    2: (index, line, direction) => {
        addClass(line[index], activeColor)
        if (isRight(direction)) {
            addClass(line[index + 1], activeColor)
        } else {
            addClass(line[index - 1], activeColor)
        }
    },
    1: (index, line) => {
        addClass(line[index], activeColor)
    }
};

function startLevel() {
    hide(messageEndgame);
    hide(startButton);
    show(pressButton);
    const validatedLevel = levelNumber > 0 ? levelNumber : 1;
    const selectedLevel = selectLineSize[`level${validatedLevel}`];
    const lineSize = currentLineSize <= selectedLevel ? currentLineSize : selectedLevel;
    runLevel(lines[`line_${validatedLevel}`], speedLevel[validatedLevel - 1], lineSize);
}

async function runLevel(line, speed, lineSize) {
    while (stopLine === false) {
        await moveSquare(line, speed, lineSize, 'right');
        await moveSquare(line, speed, lineSize, 'left');
    }

    stopLine = false;
    if (levelNumber > 1) {
        const currentLine = getCurrentLine(line);

        if (isNotClicked(currentLine)) {
            startCurrentLevel();
            return;
        }

        removeInvalidSquares(currentLine)

        if (isAllSquaresInactive(currentLine)) {
            showMessageEndGame(false);
            return;
        }
    }

    startNextLevel();
}

async function moveSquare(line, speed, lineSize, direction) {
    let incrementClause = 'isRight(direction) ? startClause++ : startClause--';

    let { startClause, stopClause } = getClauses(direction, line, lineSize);

    for (startClause; eval(stopClause); eval(incrementClause)) {
        const conditionActive = getConditionActive(direction, startClause, line);

        if (conditionActive) { continue; }

        await new Promise(r => setTimeout(r, speed));

        if (stopLine) { break; }

        isSquareActive(line[startClause]) ?
            addClass(line[startClause], inactiveColor) :
            inactiveSquare(direction, startClause, line, lineSize);
    }
}

(function drawDisplay() {
    Array(10).fill().forEach((_, index) => {
        Array(7).fill().forEach(_ => {
            const line = document.createElement('div');
            line.classList = `square inactive line_${index + 1}`;
            display.prepend(line)
        })
    })

})();