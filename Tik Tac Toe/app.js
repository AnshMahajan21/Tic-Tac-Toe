// declared variables
let boxes = document.querySelectorAll(".box")
let resetbtn = document.querySelector("#resetbtn")
let newgamebtn = document.querySelector("#newgamebtn")
let winmsg = document.querySelector(".winmsg")
let msg = document.querySelector("#msg")
let turnO = true
let count = 0
winner = false
let gameMode = 'human'; // 'human' or 'ai'
let gameStats = {
    humanWins: 0,
    aiWins: 0,
    draws: 0,
    gamesPlayed: 0
};

//Winning Conditions 
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

document.getElementById('human-mode').addEventListener('click', () => {
    setGameMode('human');
});

document.getElementById('ai-mode').addEventListener('click', () => {
    setGameMode('ai');
});

const setGameMode = (mode) => {
    gameMode = mode;
    
    // Update button appearance
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode + '-mode').classList.add('active');
    
    // Reset stats and start new game
    gameStats = { humanWins: 0, aiWins: 0, draws: 0, gamesPlayed: 0 };
    resetgame();
}

const checkWinnerForAI = (board) => {
    for (let pattern of winpatterns) {
        let val1 = board[pattern[0]];
        let val2 = board[pattern[1]];
        let val3 = board[pattern[2]];
        
        if (val1 !== '' && val1 === val2 && val2 === val3) {
            return val1;
        }
    }
    return null;
};

const isBoardFull = (board) => {
    return board.every(cell => cell !== '');
};

const minimax = (board, depth, isMaximizing) => {
    const result = checkWinnerForAI(board);
    
    // AI is X, Human is O in AI mode
    if (result === 'O') return -10 + depth; 
    if (result === 'X') return 10 - depth;  
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

const getBestMove = () => {
    let board = Array.from(boxes).map(box => box.innerText);
    let bestScore = -Infinity;
    let bestMove = 0;
    
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
    if (gameMode === 'ai' && turnO && !winner) { 
        setTimeout(() => {
            const bestMove = getBestMove();
            const aiBox = boxes[bestMove];
            
            aiBox.innerText = "X";
            aiBox.classList.add("turnx");
            aiBox.disabled = true;
            turnO = false; 
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
        indicator.textContent = turnO ? "Your Turn Player 1" : "Your Turn Player 2";
    } else {
        indicator.textContent = turnO ? "AI is thinking..." : "Your Turn Player 1";
    }
}

const showGameInfo = () => {
    const gameInfo = document.getElementById('game-info');
    
    if (gameMode === 'human') {
        let startingPlayer = turnO ? 'Player 1 starts' : 'Player 2 starts';
        gameInfo.innerHTML = `<p>Game ${gameStats.gamesPlayed} - ${startingPlayer}</p>`;
    } else {
        // In AI mode: show who starts and current score
        let startingPlayer = turnO ? 'AI starts (2)' : 'You start (1)';
        gameInfo.innerHTML = `
            <p>Game ${gameStats.gamesPlayed} - ${startingPlayer}</p>
            <p>Score - You (1): ${gameStats.humanWins} | AI (2): ${gameStats.aiWins} | Draws: ${gameStats.draws}</p>
        `;
    }
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (gameMode === 'ai' && turnO) return;
        
        if (gameMode === 'human') {
            if (turnO) {
                box.innerText = "O"
                box.classList.remove("turnx")
                box.classList.add("turno")
                turnO = false
            } else {
                box.innerText = "X"
                box.classList.remove("turno")
                box.classList.add("turnx")
                turnO = true
            }
        } else {
            box.innerText = "O"
            box.classList.remove("turnx")
            box.classList.add("turno")
            turnO = true
        }
        
        box.disabled = true
        count++
        
        updateTurnIndicator();
        checkwinner();
        
        if (count === 9 && !winner) {
            drawgame()
        }
        
        if (gameMode === 'ai' && !winner && count < 9) {
            makeAIMove();
        }
    })
});

const resetgame = () => {
    gameStats.gamesPlayed++;
    
    // Alternate starting player every game
    if (gameMode === 'human') {
        turnO = gameStats.gamesPlayed % 2 === 1;
    } else if (gameMode === 'ai') {
        // In AI mode: decide who starts
        const aiStartsFirst = gameStats.gamesPlayed % 2 === 1;
        turnO = aiStartsFirst; // true = AI's turn, false = Human's turn
        
        // If AI should start first, make AI move after a delay
        if (aiStartsFirst) {
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
    if (gameMode === 'ai') {
        if (winner === 'O') gameStats.humanWins++;
        else gameStats.aiWins++;
    }
    
    let message = '';
    if (gameMode === 'ai') {
        message = winner === 'O' ? 'Congratulations! You won!' : 'AI wins this time!';
    } else {
        message = `Congratulations, Winner is ${winner}`;
    }
    
    msg.innerText = message;
    winmsg.classList.remove("hide")
    disableboxes()
}

const drawgame = () => {
    if (gameMode === 'ai') gameStats.draws++;
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

// Initialize the display
window.addEventListener("DOMContentLoaded", function() {
    showGameInfo();
    updateTurnIndicator();
});
