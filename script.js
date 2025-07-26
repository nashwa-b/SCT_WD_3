const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
let cells = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let mode = "human"; // "human" or "computer"

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Create the grid
function createBoard() {
    board.innerHTML = "";
    cells.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index;
        cell.addEventListener("click", handleClick);
        cell.textContent = cells[index];
        board.appendChild(cell);
    });
}

function setMode(selectedMode) {
    mode = selectedMode;
    resetGame();
    // Visually highlight selected mode
    document.getElementById('humanBtn').classList.toggle('active', mode === 'human');
    document.getElementById('computerBtn').classList.toggle('active', mode === 'computer');
}

function handleClick(e) {
    const index = e.target.dataset.index;

    if (cells[index] !== "" || gameOver) return;

    cells[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWinner()) {
        highlightWinner();
        statusText.textContent = `${currentPlayer} wins! 🎉`;
        statusText.className = currentPlayer === "X" ? "x-turn" : "o-turn";
        gameOver = true;
        return;
    }

    if (cells.every(cell => cell !== "")) {
        statusText.textContent = "It's a draw!";
        statusText.className = "";
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
    statusText.className = currentPlayer === "X" ? "x-turn" : "o-turn";

    // Computer plays as O if mode is computer
    if (mode === "computer" && currentPlayer === "O" && !gameOver) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    const emptyIndices = cells
        .map((cell, idx) => cell === "" ? idx : null)
        .filter(idx => idx !== null);

    if (emptyIndices.length === 0 || gameOver) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    cells[randomIndex] = "O";
    document.querySelectorAll('.cell')[randomIndex].textContent = "O";

    if (checkWinner()) {
        highlightWinner();
        statusText.textContent = `O wins! 🎉`;
        statusText.className = "o-turn";
        gameOver = true;
        return;
    }

    if (cells.every(cell => cell !== "")) {
        statusText.textContent = "It's a draw!";
        statusText.className = "";
        gameOver = true;
        return;
    }

    currentPlayer = "X";
    statusText.textContent = "X's turn";
    statusText.className = "x-turn";
}

// Highlight winning cells
function highlightWinner() {
    const winnerCombo = winningCombinations.find(combination =>
        combination.every(index => cells[index] === currentPlayer)
    );
    if (winnerCombo) {
        winnerCombo.forEach(idx => {
            document.querySelectorAll('.cell')[idx].classList.add('winning-cell');
        });
    }
}

function checkWinner() {
    return winningCombinations.some(combination =>
        combination.every(index => cells[index] === currentPlayer)
    );
}

function resetGame() {
    cells = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;
    statusText.textContent = "X's turn";
    statusText.className = "x-turn";
    createBoard();
    // Remove highlights
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('winning-cell');
    });
}

// Initialize
createBoard();
statusText.textContent = "X's turn";
statusText.className = "x-turn";
// Set default
