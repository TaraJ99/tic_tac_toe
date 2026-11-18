const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const scoreXText = document.getElementById('scoreX');
const scoreOText = document.getElementById('scoreO');
const scoreDrawText = document.getElementById('scoreDraw');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let scores = { X: 0, O: 0, draw: 0 };

const winningConditions = [
  new Array(0, 1, 2),
  new Array(3, 4, 5),
  new Array(6, 7, 8),
  new Array(0, 3, 6),
  new Array(1, 4, 7),
  new Array(2, 5, 8),
  new Array(0, 4, 8),
  new Array(2, 4, 6)
];

function handleCellClick(event) {
  const cellIndex = parseInt(event.target.getAttribute('data-index'));

  if (board[cellIndex] !== "" || !isGameActive || currentPlayer === "O") {
    return;
  }

  makeMove(cellIndex, "X");
  
  if (isGameActive) {
    statusText.textContent = "Computer is thinking...";
    setTimeout(computerMove, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  checkResult();
}

function computerMove() {
  if (!isGameActive) return;

  // 1. Try to win, or 2. Block player X
  let moveIndex = findBestMove("O") ?? findBestMove("X");

  // 3. Otherwise pick a random open square
  if (moveIndex === null) {
    const emptyIndices = board
      .map((val, idx) => (val === "" ? idx : null))
      .filter(val => val !== null);
    moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  makeMove(moveIndex, "O");
}

function findBestMove(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    const values = [board[a], board[b], board[c]];
    
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return condition[values.indexOf("")];
    }
  }
  return null;
}

function checkResult() {
  let winningCombo = null;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winningCombo = condition;
      break;
    }
  }

  if (winningCombo) {
    winningCombo.forEach(index => cells[index].classList.add('winner'));
    scores[currentPlayer]++;
    updateScoreboard();
    statusText.textContent = currentPlayer === "X" ? "You win!" : "Computer wins!";
    isGameActive = false;
    return;
  }

  if (!board.includes("")) {
    scores.draw++;
    updateScoreboard();
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = currentPlayer === "X" ? "Your turn (X)" : "Computer's turn (O)";
}

function updateScoreboard() {
  scoreXText.textContent = scores.X;
  scoreOText.textContent = scores.O;
  scoreDrawText.textContent = scores.draw;
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Your turn (X)";
  
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('winner');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
