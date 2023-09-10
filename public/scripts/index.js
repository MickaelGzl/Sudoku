const sudokuGrid = document.getElementById("sudoku");
const difficulty = document.getElementById("selection");
const createGridButton = document.getElementById("createGrid");
const verifySolutionButton = document.getElementById("verifySolution");
const displayResult = document.getElementById("result");
const optionCreate = document.getElementById("optionCreate");

function isSudokuCorrect(sudoku) {
  //prepare function to verify the unicity of values in regions, one by one
  function isCorrectRegion(regionRow, regionCol) {
    const regionSet = new Set();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = sudoku[regionRow * 3 + i][regionCol * 3 + j];
        if (regionSet.has(value)) {
          return false;
        }
        regionSet.add(value);
      }
    }
    return true;
  }

  //here i is a row and j a column
  for (let i = 0; i < 9; i++) {
    const rowSet = new Set();
    const columnSet = new Set();
    for (let j = 0; j < 9; j++) {
      const rowValue = sudoku[i][j];
      const columnValue = sudoku[j][i];
      if (
        rowValue == 0 ||
        columnValue == 0 ||
        rowValue > 9 ||
        columnValue > 9
      ) {
        return [false, "Sudoku is not already complete"];
      }
      if (rowSet.has(rowValue)) {
        return [false, `Line ${i} has repeated values.`];
      }
      rowSet.add(rowValue);
      if (columnSet.has(columnValue)) {
        return [false, `Column ${j} has repeated values.`];
      }
      columnSet.add(columnValue);
    }
  }

  //use function to verify region
  for (let regionRow = 0; regionRow < 3; regionRow++) {
    for (let regionCol = 0; regionCol < 3; regionCol++) {
      if (!isCorrectRegion(regionRow, regionCol)) {
        return [
          false,
          `Region ${regionRow * 3 + regionCol + 1} has repeated values.`,
        ];
      }
    }
  }

  return [true, "Congratulation !"];
}

//create an animation loading
function createAnimationLoading() {
  const divLoading = document.createElement("div");
  divLoading.classList.add("loader");
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot-spinner");
    divLoading.append(dot);
  }
  optionCreate.insertAdjacentElement("afterend", divLoading);
}

//and a function to remove loader
function removeAnimationLoading() {
  const loaderToRemove = document.getElementsByClassName("loader")[0];
  loaderToRemove.style.display = "none";
}

//create a sudoku grid
async function createSudoku() {
  createAnimationLoading();
  console.time("createSudoku");
  const res = await fetch(
    `https://sugoku.onrender.com/board?difficulty=${difficulty.value}`
  );
  const data = await res.json();

  console.timeEnd("createSudoku");
  removeAnimationLoading();

  for (let i = 0; i < 9; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      const td = document.createElement("td");
      if (data.board[i][j] !== 0) {
        td.innerHTML = `<strong>${data.board[i][j]}</strong>`;
        td.style.backgroundColor = "#f2f3f4";
      } else {
        td.innerText = "";
        td.contentEditable = true;
        td.addEventListener("input", (e) => {
          if (e.target.innerText.length > 1) {
            e.target.style.color = "#ff0000";
          } else {
            e.target.style.color = "#000";
          }
        });
      }
      td.id = i + "_" + j;
      tr.append(td);
    }
    sudokuGrid.append(tr);
  }

  return data.board;
}

createGridButton.addEventListener("click", () => {
  createSudoku();
  // difficulty.previousElementSibling.hidden = true;
  // difficulty.hidden = true;
  // createGridButton.hidden = true;
  optionCreate.style.display = "none";
  sudokuGrid.hidden = false;
  verifySolutionButton.hidden = false;
});

verifySolutionButton.addEventListener("click", () => {
  const solution = [];
  for (let i = 0; i < 9; i++) {
    const line = [];
    for (let j = 0; j < 9; j++) {
      const elem = document.getElementById(`${i}_${j}`);
      //   console.dir(elem);
      line.push(elem.textContent ? parseInt(elem.textContent) : 0);
    }
    solution.push(line);
  }

  const result = isSudokuCorrect(solution);
  displayResult.innerText = result[1];
});
