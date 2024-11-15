const PLAYER_X_CLASS = 'x';
const PLAYER_O_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const boardElement = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton');
const spanX = document.querySelector('.score-X');
const spanO = document.querySelector('.score-O');
const winningStreakElement = document.getElementById('winningStreak');

let isPlayer_O_Turn = false;
let scorePlayerX = 0;
let scorePlayerO = 0;
let winningStreak = 0;
let lastWinner = null;

const checkWin = (currentClass) =>
  WINNING_COMBINATIONS.some((combination) =>
    combination.every((index) => cellElements[index].classList.contains(currentClass))
  );

const isDraw = () =>
  [...cellElements].every((cell) =>
    cell.classList.contains(PLAYER_X_CLASS) || cell.classList.contains(PLAYER_O_CLASS)
  );

const endGame = (draw) => {
  if (draw) {
    winningMessageTextElement.innerText = "It's a draw!";
    resetWinningStreak();
  } else {
    const winner = isPlayer_O_Turn ? 'O' : 'X';
    updateWinningStreak(winner);
    if (winner === 'X') {
      scorePlayerX++;
    } else {
      scorePlayerO++;
    }
    updateScores();
    winningMessageTextElement.innerText = `Player with ${winner}'s wins!`;
    if (winningStreak > 1) {
      winningMessageTextElement.innerText += ` 🔥 Winning Streak: ${winningStreak} games!`;
    }
  }
  winningMessageElement.classList.add('show');
};

const updateScores = () => {
  spanX.innerText = scorePlayerX;
  spanO.innerText = scorePlayerO;
};

const updateWinningStreak = (winner) => {
  if (winner === lastWinner) {
    winningStreak++;
  } else {
    winningStreak = 1;
  }
  lastWinner = winner;
};

const resetWinningStreak = () => {
  winningStreak = 0;
  lastWinner = null;
};

const setBoardHoverClass = () => {
  boardElement.classList.remove(PLAYER_X_CLASS, PLAYER_O_CLASS);
  boardElement.classList.add(isPlayer_O_Turn ? PLAYER_O_CLASS : PLAYER_X_CLASS);
};

const placeMark = (cell, currentClass) => {
  cell.classList.add(currentClass);
  cell.innerText = currentClass === PLAYER_X_CLASS ? 'X' : 'O';
};

const swapTurns = () => (isPlayer_O_Turn = !isPlayer_O_Turn);

const handleCellClick = (e) => {
  const cell = e.target;
  const currentClass = isPlayer_O_Turn ? PLAYER_O_CLASS : PLAYER_X_CLASS;
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
};

const startGame = () => {
  isPlayer_O_Turn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(PLAYER_X_CLASS);
    cell.classList.remove(PLAYER_O_CLASS);
    cell.innerText = '';
    cell.removeEventListener('click', handleCellClick);
    cell.addEventListener('click', handleCellClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
  updateScores();
};

restartButton.addEventListener('click', startGame);
startGame();
