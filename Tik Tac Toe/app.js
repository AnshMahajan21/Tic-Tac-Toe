let boxes = document.querySelectorAll(".box")
let resetbtn = document.querySelector("#resetbtn")
let newgamebtn = document.querySelector("#newgamebtn")
let winmsg = document.querySelector(".winmsg")
let msg = document.querySelector("#msg")
let turnO = true
let count = 0
let winner = false
let gameMode = 'human'; 
let aiDifficulty = 'easy';
let gameStats = {
    humanWins: 0,
    aiWins: 0,
    draws: 0,
    gamesPlayed: 0
};

const winpatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

const showMainModes = () => {
    document.getElementById('main-mode-selection').classList.remove('hide');
    document.getElementById('ai-difficulty-selection').classList.add('hide');
}

const showDifficultySelection = () => {
    document.getElementById('main-mode-selection').classList.add('hide');
    document.getElementById('ai-difficulty-selection').classList.remove('hide');
}

document.getElementById('human-mode').addEventListener('click', () => {
    setGameMode('human');
});

document.getElementById('ai-mode').addEventListener('click', () => {
    showDifficultySelection();
});

document.getElementById('ai-easy').addEventListener('click', () => {
    setGameMode('ai-easy');
});

document.getElementById('ai-medium').addEventListener('click', () => {
    setGameMode('ai-medium');
});

document.getElementById('ai-hard').addEventListener('click', () => {
    setGameMode('ai-hard');
});

document.getElementById('back-to-modes').addEventListener('click', () => {
    showMainModes();
    setGameMode('human');
});

const setGameMode = (mode) => {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'human') {
        document.getElementById('human-mode').classList.add('active');
        showMainModes();
    } else if (mode.startsWith('ai-')) {
        aiDifficulty = mode.split('-')[1];
        document.getElementById('ai-mode').classList.add('active');
        document.getElementById(mode).classList.add('active');
    }
    
    gameStats = { humanWins: 0, aiWins: 0, draws: 0, gamesPlayed: 0 };
    resetgame();
}

const checkWinnerForAI = (board) => {
    const patterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of patterns) {
        const [a, b, c] = pattern;
        if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
};

const isBoardFull = (board) => board.every(cell => cell !== '');


const minimax = (board, depth, isMaximizing) => {
    const result = checkWinnerForAI(board);
    if (result === 'X') return 10 - depth;
    if (result === 'O') return depth - 10;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const getEasyMove = () => {
    let board = Array.from(boxes).map(box => box.innerText);
    let availableMoves = [];
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            availableMoves.push(i);
        }
    }
    
    if (Math.random() < 0.3) {
        return getBestMove();
    } else {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
};

const getMediumMove = () => {
    let board = Array.from(boxes).map(box => box.innerText);
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinnerForAI(board) === 'O') {
                return i;
            }
            board[i] = '';
        }
    }
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinnerForAI(board) === 'X') {
                return i;
            }
            board[i] = '';
        }
    }
    
    if (Math.random() < 0.6) {
        return getBestMove();
    } else {
        let availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') availableMoves.push(i);
        }
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
};

const getBestMove = () => {
    let board = Array.from(boxes).map(box => box.innerText);
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
};


const makeAIMove = () => {
    if (gameMode.startsWith('ai-') && !turnO && !winner) {
        setTimeout(() => {
            let aiMove;
            
            switch (aiDifficulty) {
                case 'easy':
                    aiMove = getEasyMove();
                    break;
                case 'medium':
                    aiMove = getMediumMove();
                    break;
                case 'hard':
                    aiMove = getBestMove();
                    break;
                default:
                    aiMove = getBestMove();
            }
            
            const aiBox = boxes[aiMove];
            aiBox.innerText = "X";
            aiBox.classList.add("turnx");
            aiBox.disabled = true;
            turnO = true;
            count++;
            
            updateTurnIndicator();
            checkwinner();
            
            if (count === 9 && !winner) {
                drawgame();
            }
        }, 800);
    }
};

const updateTurnIndicator = () => {
    const indicator = document.getElementById('turn-indicator');
    if (gameMode === 'human') {
        indicator.textContent = turnO ? "Player O's Turn" : "Player X's Turn";
    } else {
        indicator.textContent = turnO ? "Your Turn" : `AI (${aiDifficulty.toUpperCase()}) is thinking...`;
    }
}

const showGameInfo = () => {
    const gameInfo = document.getElementById('game-info');
    let startingPlayer = '';
    
    if (gameMode === 'human') {
        startingPlayer = turnO ? 'Player O starts' : 'Player X starts';
        gameInfo.innerHTML = `<p>Game ${gameStats.gamesPlayed} - ${startingPlayer}</p>`;
    } else {
        startingPlayer = turnO ? 'You start' : `AI (${aiDifficulty.toUpperCase()}) starts`;
        gameInfo.innerHTML = `
            <p>Game ${gameStats.gamesPlayed} - ${startingPlayer}</p>
            <p>Score - You: ${gameStats.humanWins} | AI: ${gameStats.aiWins} | Draws: ${gameStats.draws}</p>
        `;
    }
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (gameMode.startsWith('ai-') && !turnO) return;

        if (gameMode.startsWith('ai-')) {
            box.innerText = "O";
            box.classList.add("turno");
            turnO = false;
        } else {
            if (turnO) {
                box.innerText = "O";
                box.classList.add("turno");
            } else {
                box.innerText = "X";
                box.classList.add("turnx");
            }
            turnO = !turnO;
        }

        box.disabled = true;
        count++;

        updateTurnIndicator();
        checkwinner();

        if (count === 9 && !winner) {
            drawgame();
        }

        if (gameMode.startsWith('ai-') && !winner && count < 9) {
            makeAIMove();
        }
    });
});

const resetgame = () => {
    gameStats.gamesPlayed++;
    
    if (gameMode === 'human') {
        turnO = gameStats.gamesPlayed % 2 === 1;
    } else if (gameMode.startsWith('ai-')) {
        const humanStartsFirst = gameStats.gamesPlayed % 2 === 1;
        turnO = humanStartsFirst;
        
        if (!humanStartsFirst) {
            setTimeout(() => {
                makeAIMove();
            }, 1000);
        }
    }
    
    enableboxes()
    winmsg.classList.add("hide")
    count = 0
    winner = false
    
    showGameInfo();
    updateTurnIndicator();
}

const disableboxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const enableboxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = ""
        box.classList.remove("turnx", "turno");
    }
}

const showwinner = (winner) => {
    if (gameMode.startsWith('ai-')) {
        if (winner === 'X') gameStats.humanWins++;
        else gameStats.aiWins++;
    }
    
    let message = '';
    if (gameMode.startsWith('ai-')) {
        message = winner === 'O' ? 'Congratulations! You won!' : `AI (${aiDifficulty.toUpperCase()}) wins this time!`;
    } else {
        message = `Congratulations, Winner is ${winner}`;
    }
    
    msg.innerText = message;
    winmsg.classList.remove("hide")
    disableboxes()
}

const drawgame = () => {
    if (gameMode.startsWith('ai-')) gameStats.draws++;
    msg.innerText = ("Game was a draw")
    winmsg.classList.remove("hide")
    disableboxes()
}

const checkwinner = () => {
    for (let pattern of winpatterns) {
        let val1 = boxes[pattern[0]].innerText
        let val2 = boxes[pattern[1]].innerText
        let val3 = boxes[pattern[2]].innerText

        if (val1 != "" && val2 != "" && val3 != "") {
            if (val1 === val2 && val2 === val3) {
                console.log("Winner", val1)
                showwinner(val1)
                winner = true
                return (val1)
            }
        }
    }
}

resetbtn.addEventListener("click", resetgame)
newgamebtn.addEventListener("click", resetgame)

window.addEventListener("DOMContentLoaded", function() {
    const audio = document.querySelector("#audio");
    audio.play();
    
    showGameInfo();
    updateTurnIndicator();
});
