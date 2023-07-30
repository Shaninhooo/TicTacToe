// HTML elements
const gridCells = document.querySelectorAll('.grid');
const overlay = document.getElementById('overlay');
const gameEnding = document.getElementById('gameEnding');
const form = document.getElementById('addPlayerForm');
const playX = document.getElementById('X');
const playO = document.getElementById('O');
const AIchooseSide = document.querySelector('.chooseSideAI');
const startAIGame = document.getElementById('playAI');
const startHumanGame = document.getElementById('playHuman');

// Starting the game

startAIGame.addEventListener('click', () => {
    startHumanGame.disabled = true;
    AIchooseSide.classList.add('active');
})

startHumanGame.addEventListener('click', () => {
    form.classList.add('active');
    startAIGame.disabled = true;
    Gameplay().pvpGame();
})

const players = (name, sign) => {
    const getSign = () => sign;
    const getName = () => name;
    return { getName, getSign };
};

const addPlayers = () => {
    const player1Name = document.getElementById('playerOneName').value;
    const player2Name = document.getElementById('playerTwoName').value;
    const cover = document.getElementById('cover');
    const playerOne = players(player1Name, 'X');
    const playerTwo = players(player2Name, 'O');
    const getPlayerOne = () => playerOne
    const getPlayerTwo = () => playerTwo
    const deactivateCover = (e) => {
        e.preventDefault();
        if (cover) {
            cover.classList.add('deactive');
        }
    }
    return { getPlayerOne, getPlayerTwo, deactivateCover }
}

form.addEventListener('submit', function (e) {
    addPlayers().deactivateCover(e);
    console.log(addPlayers().getPlayerOne().getName());
});
// Gameplay


const generateGrid = () => {
    let gameGrid = new Array(9).fill(null);
    const getWholeGrid = () => gameGrid;
    const getGrid = (i) => gameGrid[i];

    const removeAllSigns = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    const emptyGrid = () => {
        for (i = 0; i < gameGrid.length; i++) {
            removeAllSigns(gridCells[i]);
            removeAllSigns(gameEnding);
        }
        gameGrid = new Array(9).fill(null);
    }

    const addSign = (index, player) => {
        if (gameGrid[index] === null) {
            const inputtedSign = document.createElement('p');
            inputtedSign.textContent = player.getSign();
            gridCells[index].appendChild(inputtedSign);
            gameGrid[index] = player.getSign();
            console.log(player.getSign());
        } else {
            console.log('Sign already added');
        }
    }
    return { getGrid, addSign, getWholeGrid, emptyGrid, removeAllSigns };
}

const gameEnder = () => {

    const checkRow = (board, player) => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = i * 3; j < 3 + i * 3; j++) {
                row.push(board[j]);
            }
            if (row.every(field => field == player)) {
                return true
            }
        }
        return false;
    }

    const checkColumn = (board, player) => {
        for (let i = 0; i < 3; i++) {
            let column = [];
            for (let j = i; j < i + 6 + 1; j = j + 3) {
                column.push(board[j]);
            }
            if (column.every(field => field == player)) {
                return true
            }
        }
        return false;
    }

    const checkDiagonal = (board, player) => {
        diagonal1 = [board[0], board[4], board[8]];
        diagonal2 = [board[2], board[4], board[6]];
        if (diagonal1.every(field => field == player) ||
            diagonal2.every(field => field == player)) {
            return true
        }
        return false;
    }

    const checkResult = (board, player) => {
        if (checkRow(board, player) || checkColumn(board, player) || checkDiagonal(board, player)) {
            return true
        }
        return false
    }
    return { checkRow, checkColumn, checkDiagonal, checkResult };
}


let player;

const Gameplay = () => {
    let round = 0;
    const playerOne = () => addPlayers().getPlayerOne()
    const playerTwo = () => addPlayers().getPlayerTwo()

    const getRound = () => round;
    const grid = generateGrid();
    const check = gameEnder();

    const closeAll = () => {
        grid.emptyGrid();
        overlay.classList.remove('active')
        round = 0;
        document.getElementById('X').disabled = false
        document.getElementById('O').disabled = false
    }

    const onClick = (index) => {
        if (round % 2 === 0) {
            grid.addSign(index, addPlayers().getPlayerOne())
        } else {
            grid.addSign(index, addPlayers().getPlayerTwo())
        }
        round++;
    }

    const winnerAnnouncement = (grid, X, O) => {
        const winnerName = document.createElement('p');
        if (gameEnder().checkResult(grid, 'X')) {
            winnerName.textContent = `${X.getName()} Wins`
        } else if (gameEnder().checkResult(grid, 'O')) {
            winnerName.textContent = `${O.getName()} Wins`
        }
        gameEnding.appendChild(winnerName);
    }

    const drawAnnouncement = () => {
        const winnerName = document.createElement('p');
        winnerName.textContent = `Its a Draw`
        gameEnding.appendChild(winnerName);
    }

    const checkForWin = (grid, X, O) => {
        console.log('active')
        if (grid.every(field => field !== null)) {
            console.log('draw')
            drawAnnouncement();
            overlay.classList.add('active');
        } else if ((check.checkResult(grid, 'O')) || (check.checkResult(grid, 'X'))) {
            winnerAnnouncement(grid, X, O);
            overlay.classList.add('active');
        }
    }
    const pvpGame = () => {
        gridCells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                console.log('why am i started')
                onClick(index);
                console.log(grid.getWholeGrid())
                checkForWin(grid.getWholeGrid(), playerOne(), playerTwo());
            });
        });
    }

    overlay.addEventListener('click', () => {
        closeAll();
    });
    return { getRound, onClick, checkForWin, winnerAnnouncement, drawAnnouncement, closeAll, pvpGame };
}


//Minimax Ai Part Of Code


playX.addEventListener('click', function (e) {
    addPlayers().deactivateCover(e);
    aiGameplay('X', 'O')
    document.getElementById('X').disabled = true
    document.getElementById('O').disabled = true
});

playO.addEventListener('click', function (e) {
    addPlayers().deactivateCover(e);
    aiGameplay('O', 'X');
    document.getElementById('O').disabled = true
    document.getElementById('X').disabled = true
});



const aiGameplay = (user, opponent) => {

    const User = players('Player', user);
    const Opponent = players('AI', opponent);
    const player = () => User.getSign()
    const AI = () => Opponent.getSign()
    const grid = generateGrid();
    const board = grid.getWholeGrid();

    const getScore = () => {
        if (gameEnder().checkResult(board, AI())) {
            return 10
        } else if (gameEnder().checkResult(board, player())) {
            return -10
        } else if (board.every(field => field !== null)) {
            return 0
        }
    }
    const minimax = (isMaximising, depth) => {
        if (board.every(field => field !== null) || gameEnder().checkResult(board, AI()) || gameEnder().checkResult(board, player())) {
            return getScore()
        } else {
            let bestScore
            if (isMaximising) {
                bestScore = -Infinity
                for (let i = 0; i < board.length; i++) {
                    if (board[i] == null) {
                        board[i] = AI()
                        let score = minimax(false, depth + 1)
                        board[i] = null
                        if (score > bestScore) {
                            bestScore = score
                        }
                    }
                }
            } else {
                bestScore = Infinity
                for (let i = 0; i < board.length; i++) {
                    if (board[i] == null) {
                        board[i] = player()
                        let score = minimax(true, depth + 1)
                        board[i] = null
                        if (score < bestScore) {
                            bestScore = score
                        }
                    }
                }
            }
            return bestScore
        }
    }
    const getAImove = () => {
        let bestScore = -Infinity
        let move
        for (let i = 0; i < board.length; i++) {
            if (board[i] == null) {
                board[i] = AI()
                let score = minimax(false, 0)
                board[i] = null
                if (score > bestScore) {
                    bestScore = score
                    move = i
                }
            }
        }
        return move
    }

    

    if (user == 'O') {
        grid.addSign(getAImove(), Opponent)
        gridCells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (grid.getGrid(index) == null) {
                    grid.addSign(index, User);
                    grid.addSign(getAImove(), Opponent)
                    Gameplay().checkForWin(board, Opponent, User)
                }
            });
        });
    } else {
        gridCells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (grid.getGrid(index) == null) {
                    grid.addSign(index, User);
                    grid.addSign(getAImove(), Opponent)
                    Gameplay().checkForWin(board, User, Opponent)
                }
            });
        });
    }

    overlay.addEventListener('click', () => {
        Gameplay().closeAll();
    });
    return { getScore, minimax, getAImove }
}