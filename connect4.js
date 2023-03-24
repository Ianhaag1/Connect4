/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; 


//this function creates the board and loops through the values until it hits the HEIGHT and WIDTH that is set as the CONST.
function makeBoard() {
    for (let y = 0; y < HEIGHT; y++) {
      board.push(Array.from({ length: WIDTH }));
    }
  }

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');
  
  // this creates the top of board in the HTML document. the TR element is the top of the board. The handleclick function is an event listener that calculates the click of a mouse in order to play a turn.
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // this loops through the element and creates a table cell.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

// this loops through the function cell in the collom x. it checks each cell is empty. if none of the cells are empty then it will return null.
function findSpotForCol(x) {
  for(let y = HEIGHT; y >= 0; y--){
    if(!board[y][x]){
      return y;
    }
  }
  return null;
}


function placeInTable(y, x) {
 const piece = document.createElement('div'); //this creates the piece elemt in HTML
 piece.classList.add('piece') // This adds the class to the element 
 piece.style.backgroundColor = currPlayer === 1 ? 'red' : 'blue'; // this add colors to the pieces depending on the different players.
 const cell = document.getElementById(`${y}-${x}`);
 cell.append(piece); // this retrieves the elementId with the template literal, and then appends it to the piece in the cell.
}

function endGame(msg) {
// this function happens at the end of the game and when the game is finished removes the ability for the player to continue to use the event listener. 
  const columnTopCells = document.querySelectorAll('#column-top td');
  for(let cell of columnTopCells){
    cell.removeEventListener('click',handleClick);
  }
  // this just makes a on screen pop up to let the player know the game is over, the message displayed depends on who wins or if its a tie.
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // the code below checks for the win depending on if 4 tiles of the same player are in a row. Basically this calculates the endgame for connect 4. It checks for the win in 3 directions too, horizantal, vertical, and diagonal.

// if there are 4 pieces in a row then the win will return true

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
