function startGame() {
  const board = document.querySelector("#board");
  const levels = document.querySelector("#levels");
  let flagCnt = document.querySelector(".flagCnt");
  const closeBtn = document.querySelector(".close-btn");
  const startBtn = document.querySelector(".start--btn");
  const playground = document.querySelector(".playground");
  const homeContainer = document.querySelector(".home--container");
  const mainContainer = document.querySelector(".main--container");

  let revealCnt = 0;
  let level = "easy";
  let boardSize = 10;
  let mineCount = 5;
  let flagsCount = mineCount;
  let mines = [];
  let gameOver = false;
  let boardArr = [];

  
  const levelMapper = {
    easy: { boardSize: 10, mineCount: 7 },
    medium: { boardSize: 15, mineCount: 15 },
    hard: { boardSize: 20, mineCount: 30 },
  };

  
  levels.addEventListener("change", (event) => {
    level = event.target.value;
    boardSize = levelMapper[level].boardSize;
    mineCount = levelMapper[level].mineCount;
    flagsCount = mineCount;
    flagCnt.innerText = flagsCount;
    resetGame();
  });

  
  startBtn.addEventListener("click", () => {
    homeContainer.style.display = "none";
    mainContainer.style.display = "flex";
    resetGame();
  });

 
  closeBtn.addEventListener("click", () => {
    location.reload();
  });

  
  function resetGame() {
    playground.innerHTML = ""; // Clear previous grid
    boardArr = [];
    mines = [];
    revealCnt = 0;
    gameOver = false;
    generateGrid(boardSize);
    addMines();
  }

  
  function generateGrid(size) {
    const table = document.createElement("table");
    for (let i = 0; i < size; i++) {
      const row = document.createElement("tr");
      let rowArray = [];
      for (let j = 0; j < size; j++) {
        const cell = document.createElement("td");
        cell.id = `${i}-${j}`;
        cell.style.width = `calc(100% / ${size})`;
        cell.style.height = `calc(100% / ${size})`;
        cell.addEventListener("click", revealBox);
        cell.addEventListener("contextmenu", flagBox);
        rowArray.push(cell);
        row.appendChild(cell);
      }
      table.appendChild(row);
      boardArr.push(rowArray);
    }
    playground.appendChild(table);
  }

  
  function addMines() {
    while (mines.length < mineCount) {
      const r = Math.floor(Math.random() * boardSize);
      const c = Math.floor(Math.random() * boardSize);
      const id = `${r}-${c}`;
      if (!mines.includes(id)) mines.push(id);
    }
  }

  
  function revealBox(e) {
    const box = e.currentTarget;
    if (gameOver || box.classList.contains("revealed") || box.classList.contains("flag")) return;

    const [r, c] = box.id.split("-").map(Number);
    if (mines.includes(box.id)) {
      
      box.innerText = "💣";
      box.classList.add("mine");
      revealAllMines();
      gameOver = true;
      showGameOver();
    } else {
      
      revealSafeBoxes(r, c);
      if (revealCnt === boardSize * boardSize - mineCount) {
        gameOver = true;
        revealAllMines();
        showYouWin();
      }
    }
  }

  
  function revealAllMines() {
    for (const mine of mines) {
      const [r, c] = mine.split("-").map(Number);
      const cell = boardArr[r][c];
      cell.innerText = "💣";
      cell.classList.add("mine");
    }
  }

  
  function revealSafeBoxes(r, c) {
    if (r < 0 || c < 0 || r >= boardSize || c >= boardSize) return;
    const cell = boardArr[r][c];
    if (cell.classList.contains("revealed") || cell.classList.contains("flag")) return;

    cell.classList.add("revealed");
    revealCnt++;
    const adjacentMines = countAdjacentMines(r, c);
    if (adjacentMines > 0) {
      cell.innerText = adjacentMines;
    } else {
      for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
          revealSafeBoxes(i, j);
        }
      }
    }
  }

  
  function countAdjacentMines(r, c) {
    let count = 0;
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (i < 0 || j < 0 || i >= boardSize || j >= boardSize) continue;
        if (mines.includes(`${i}-${j}`)) count++;
      }
    }
    return count;
  }

  
  function flagBox(e) {
    e.preventDefault();
    const box = e.currentTarget;
    if (gameOver || box.classList.contains("revealed")) return;

    if (box.classList.contains("flag")) {
      box.classList.remove("flag");
      box.innerText = "";
      flagsCount++;
    } else {
      if (flagsCount > 0) {
        box.classList.add("flag");
        box.innerText = "🚩";
        flagsCount--;
      }
    }
    flagCnt.innerText = flagsCount;
  }

  
  function showGameOver() {
    const div = document.createElement("div");
    div.className = "loser-screen";
    div.innerHTML = `<h2>Game Over</h2><button class="play-again" style="background-color: #4A752C; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Restart</button>`;
    playground.appendChild(div);
    document.querySelector(".play-again").addEventListener("click", () => location.reload());
  }

  
  function showYouWin() {
    const div = document.createElement("div");
    div.className = "winner-screen";
    div.innerHTML = `<h2>🎉 You Won! 🎉</h2><button class="play-again">Play Again</button>`;
    playground.appendChild(div);
    document.querySelector(".play-again").addEventListener("click", () => location.reload());
  }

  resetGame(); 
}

document.addEventListener("DOMContentLoaded", startGame);
