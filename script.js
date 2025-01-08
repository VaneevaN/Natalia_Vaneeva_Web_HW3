//Ссылки на элементы интерфейса
const themeButton = document.getElementById("theme-btn");
const size = document.getElementById("board-size");
const len = document.getElementById("win-len");
const firstPlayer = document.getElementById("first-player");
const createButton = document.getElementById("create-board");
const boardContainer = document.querySelector(".board");
const statusText = document.getElementById("status-text");
const resetButton = document.getElementById("reset-btn");

let currentPlayer = "X"; //Показывает, кто в данный момент ходит
let statusBoard = []; //Игровое поле
let gameActive = true;
let boardSize = 3; //По умолчанию размер поля 3
let winLength = 3; //По умолчанию длина выйгрышкой комбинации - 3

//Перезапуск игры
function newGame() {
  //Очищаем поле
  boardContainer.innerHTML = "";
  statusBoard = Array(boardSize * boardSize).fill("");

  //Создаём поле
  const board = document.createElement("div");
  board.classList.add("board");
  board.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;
  //И заполняем его
  for (let i = 0; i < boardSize * boardSize; ++i) {
    //Создаём ячейку поля - элемент с нужным стилем, индексом и обработчиком событий
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", clickHandlerForCell);
    board.appendChild(cell);
  }
  boardContainer.appendChild(board);

  currentPlayer = firstPlayer.value;
  statusText.textContent = `Ходит ${currentPlayer}`;

  gameActive = true;
}

//Проверка, есть ли выйгрышная комбинация
function checkWinner() {
  let maxStrike = 0;

  for (let i = 0; i < boardSize; ++i) {
    //По горизонтали
    let strike = 0;
    for (let j = 0; j < boardSize; ++j) {
      if (statusBoard[i * boardSize + j] == currentPlayer) {
        strike++;
      } else {
        maxStrike = Math.max(maxStrike, strike);
        strike = 0;
      }
    }
    maxStrike = Math.max(maxStrike, strike);
    strike = 0;
    //По вертикали
    for (let j = 0; j < boardSize; ++j) {
      if (statusBoard[j * boardSize + i] == currentPlayer) {
        strike++;
      } else {
        maxStrike = Math.max(maxStrike, strike);
        strike = 0;
      }
    }
    maxStrike = Math.max(maxStrike, strike);
  }

  //Проверка диагоналей
  for (let i = 0; i < boardSize - winLength + 1; ++i) {
    for (let j = 0; j < boardSize - winLength + 1; ++j) {
      let strike = 0;
      //Главная диагональ
      for (let k = 0; k < winLength; ++k) {
        if (statusBoard[(i + k) * boardSize + j + k] == currentPlayer) {
          strike++;
        } else {
          maxStrike = Math.max(maxStrike, strike);
          strike = 0;
        }
      }
      maxStrike = Math.max(maxStrike, strike);
      strike = 0;
      //Побочная диагональ
      for (let k = 0; k < winLength; ++k) {
        if (
          statusBoard[(i + k) * boardSize + (boardSize - j - k - 1)] ==
          currentPlayer
        ) {
          strike++;
        } else {
          maxStrike = Math.max(maxStrike, strike);
          strike = 0;
        }
      }
      maxStrike = Math.max(maxStrike, strike);
    }
  }

  //Выводим победителя и завершаем игру(если есть)
  if (maxStrike >= winLength) {
    statusText.textContent = `${currentPlayer} выйграл!`;
    gameActive = false;
    return;
  }

  //Проверка на ничью
  if (!statusBoard.includes("")) {
    statusText.textContent = "Ничья!";
    gameActive = false;
    return;
  }
}

//Функция, обрабатывающая клик по ячейке
function clickHandlerForCell(event) {
  const cell = event.target;
  const index = parseInt(cell.dataset.index);

  //Проверка попадания клика по игровому полю
  if (statusBoard[index] !== "" || !gameActive) {
    return;
  }
  //Пометка поля фигурой игрока
  statusBoard[index] = currentPlayer;
  cell.textContent = currentPlayer;

  checkWinner(); //Проверка на выигрыш

  //Смена игрока
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  if (gameActive) {
    statusText.textContent = `Ходит ${currentPlayer}`;
  }
}

//Обработчик событий
createButton.addEventListener("click", () => {
  boardSize = parseInt(size.value);
  winLength = parseInt(len.value);
  if (boardSize < 3) {
    alert("Размер доски не может быть меньше 3");
  } else if (boardSize > 9) {
    alert("Размер доски не может быть больше 9");
  } else if (winLength < 3) {
    alert("Длина выйгрышной комбинации не может быть меньше 3");
  } else if (winLength > boardSize) {
    alert("Длина выйгрышной комбинации не может быть больше размера доски");
  } else {
    newGame(); //Если всё ок, создаём поле
  }
});

resetButton.addEventListener("click", newGame);

themeButton.addEventListener("click", function () {
  // Переключаем класс .light-theme для body
  document.body.classList.toggle("light-theme");
});

newGame(); //При загрузке страницы начинаем новую игру
