//Global variables.
var EMPTY = "Empty";
var X = "X";
var O = "O";
var PLAYER = "X";
var COMPUTER= "O";

//Constructor the Space box.
function Space (position) {
  this.position = position,
  this.value = EMPTY
}

//Method for the constructor Space.
Space.prototype.isEmpty = function() {
  if (this.value === EMPTY) {
    return true;
  }
  return false;
}

//Method - assigns the Space value.
Space.prototype.mark = function(value) {
  if (value !== X && value !== O) {
    this.value = EMPTY;
    return false;
  }
  this.value = value;
  return true;
}

//Constructor for Board (full game board). This board contains spaces (Space). Empty array.
function Board() {
  this.spaces = []
}

//Method - it's called when the user clicks starts (newGame).
Board.prototype.initializeBoard = function() {
  var space;
  for (var x=0; x<9; x++) {
      space = new Space(x);
      this.spaces.push(space);
  }
}

//Method - This returns true if there are moves remaining on the board. It returns false if there are no moves left to play. 
Board.prototype.isMovesLeft = function() {
  for (var i=0; i<this.spaces.length; i++) {
    if (this.spaces[i].isEmpty()) {
      return true;
    }
  }
  return false;
}


//Function - track is an Array. It could be (see next Method) row, colum or diagonal. Returns value if the spaces value in a row, colum or diagonal match or returns false or they don't.
function valueTracker (track) {
  if (track[0].value === track[1].value && track[0].value === track[2].value && track[0].value !== EMPTY) {
    return track[0].value;
  }
  return false
}

//Method - determines if a result on a row, colum or diagonal is the winning one. After row1, the following variables will take the row1 result and compare it with the current valueTracker.
Board.prototype.hasWon = function() {

//Checking for Rows for X or O victory. 
  var row1 = this.spaces.slice(0, 3);
  var result = valueTracker(row1);

  var row2 = this.spaces.slice(3, 6);
  result = result || valueTracker(row2);

  var row3 = this.spaces.slice(6, 9);
  result = result || valueTracker(row3);

//Checking for Columns for X or O victory. 
  var column1 = [this.spaces[0], this.spaces[3], this.spaces[6]];
  result = result || valueTracker(column1);

  var column2 = [this.spaces[1], this.spaces[4], this.spaces[7]];
  result = result || valueTracker(column2);

  var column3 = [this.spaces[2], this.spaces[5], this.spaces[8]];
  result = result || valueTracker(column3);

//Checking for Diagonals for X or O victory. 
  var diagonal1 = [this.spaces[0], this.spaces[4], this.spaces[8]];
  result = result || valueTracker(diagonal1);

  var diagonal2 = [this.spaces[2], this.spaces[4], this.spaces[6]];
  result = result || valueTracker(diagonal2);

//This determines if the board is full and there is no winner.
  if (!this.isMovesLeft()) {
    if (result) {
      return result
    } else {
      return "Tie"
    }
  }
  return result;
}

function valueEvaluate (track) {
  if (track[0].value === track[1].value && track[0].value === track[2].value) {
    if (track[0].value === COMPUTER) {
      return 10;
    } else if (track[0].value === PLAYER) {
      return -10;
    }
  }
  return 0;
}

function evaluate(board) {

  //Checking for Rows for X or O victory. 
  var row1 = board.spaces.slice(0, 3);
  if (valueEvaluate(row1)) { return valueEvaluate(row1)}

  var row2 = board.spaces.slice(3, 6);
  if (valueEvaluate(row2)) { return valueEvaluate(row2)}

  var row3 = board.spaces.slice(6, 9);
  if (valueEvaluate(row3)) { return valueEvaluate(row3)}

  //Checking for Columns for X or O victory. 
  var column1 = [board.spaces[0], board.spaces[3], board.spaces[6]];
  if (valueEvaluate(column1)) { return valueEvaluate(column1)}

  var column2 = [board.spaces[1], board.spaces[4], board.spaces[7]];
  if (valueEvaluate(column2)) { return valueEvaluate(column2)}

  var column3 = [board.spaces[2], board.spaces[5], board.spaces[8]];
  if (valueEvaluate(column3)) { return valueEvaluate(column3)}

  //Checking for Diagonals for X or O victory. 
  var diagonal1 = [board.spaces[0], board.spaces[4], board.spaces[8]];
  if (valueEvaluate(diagonal1)) { return valueEvaluate(diagonal1)}

  var diagonal2 = [board.spaces[2], board.spaces[4], board.spaces[6]];
  if (valueEvaluate(diagonal2)) { return valueEvaluate(diagonal2)}

  return 0
  }

//Function - creates a new empty game object/board (no spaces, just an empty array).
function Game() {
  this.board = new Board(),
  this.turn = X
}

//Method - creates the spaces with EMPTY value.
Game.prototype.newGame = function() {
  this.board.initializeBoard();
}

//Method - X turns to O. And then the turn is reversed.
Game.prototype.nextTurn = function () {
  if (this.turn === X) {
    this.turn = O
  } else if (this.turn === O) {
    this.turn = X
  }
}

//Method - takes the parameter id (each space has an if). It assigs the space value if it's not empty. It allows the player to click if it's true.
Game.prototype.move = function(id) {
  var space = this.board.spaces[id-1];
  var player = this.turn;
  if (space.isEmpty()) {
    space.mark(this.turn);
    this.nextTurn();
    return player;
  }
  return false
}

//Method - it allows the program to assign a random selection after the user X plays.
Game.prototype.computerMove = function () {
  //random part
  /*
  var emptySpaces = [];
  for (var i = 0; i < this.board.spaces.length; i++) {
    if (this.board.spaces[i].isEmpty()) {
      emptySpaces.push(this.board.spaces[i]);
    }
  }
  var randomIndex = Math.floor(Math.random() * (emptySpaces.length - 1));
  var randomSpace = emptySpaces[randomIndex]; 
  randomSpace.mark(this.turn);
  this.nextTurn();
  return randomSpace.position;
  */

  //smart part
  var index = findBestMove(this.board);
  var space = this.board.spaces[index];
  space.mark(this.turn);
  this.nextTurn();
  return space.position;
}

// Minimax algorithm for the best move

// This will return the best possible move for the player
function findBestMove(board) {
  var bestMove = -1;
  var bestVal = -1000;

  // Traverse all cells, evaluate minimax function for all empty cells. And return the cell with optimal value. 
  for (var i=0; i<board.spaces.length; i++) {
    // Check if cell is empty 
    if (board.spaces[i].isEmpty()) {
      // Make the move 
      board.spaces[i].mark(COMPUTER); 
  
      // compute evaluation function for this move. 
      var moveVal = minimax(board, 0, false); 
  
      // Undo the move 
      board.spaces[i].mark(EMPTY); 
  
      // If the value of the current move is more than the best value, then update best/ 
      if (moveVal > bestVal) 
      { 
          bestMove = i;
          bestVal = moveVal; 
      } 
    }
  }

  return bestMove;
}


// This is the minimax function. It considers all 
// the possible ways the game can go and returns 
// the value of the board 

function minimax(board, depth, isMax) {

  var score = evaluate(board);

  // If Maximizer or Minimizer has won the game return his/her evaluated score 
  if (score === 10 || score == -10) { return score;}

  // If there are no more moves and no winner then it is a tie 
  if (!board.isMovesLeft()) {return 0;}

  var bestVal;

  // If this maximizer's move 
  if (isMax) {
    bestVal = -1000; 

    // Traverse all cells 
    for (var i=0; i < board.spaces.length; i++) {
      var space = board.spaces[i];
      // Check if cell is empty 
      if (space.isEmpty()) {
        // Make the move 
        space.mark(COMPUTER);
        // Call minimax recursively and choose the maximum value 
        var value = minimax(board, depth+1, !isMax);
        bestVal = Math.max(bestVal, value);
        // Undo the move 
        space.mark(EMPTY);
      } 
    }; 
    return bestVal;
  } 
  // If this minimizer's move
  else {
    bestVal = +1000; 
    // Traverse all cells 
    for (var i=0; i < board.spaces.length; i++) {
      var space = board.spaces[i];
      // Check if cell is empty 
      if (space.isEmpty()) {
        // Make the move 
        space.mark(PLAYER);
        var value = minimax(board, depth+1, !isMax)
        bestVal = Math.min( bestVal, value) 
        // Undo the move 
        space.mark(EMPTY);
      }
    };
      
    return bestVal;
  }
}




$(document).ready(function() {
  var game;
  $("#startButtonX").click(function () {
    $("#gameDisplay").fadeIn();
    $("#start").hide();
    PLAYER = X;
    COMPUTER = O;
    game = new Game();
    game.newGame();
  });

  $("#startButtonO").click(function () {
    $("#gameDisplay").fadeIn();
    $("#start").hide();
    PLAYER = O;
    COMPUTER = X;
    game = new Game();
    game.newGame();
    //Computer is playing first
    var computerSelection = game.computerMove()+1;
    $("#" + computerSelection).text(COMPUTER);
  });

  $(".grid-item").click(function (event) {
    var id = event.target.id;
    var result = game.move(id);
    if (result) {
      $("#" + id).text(result);
      if (result === X) {
          $("#player").text(O);
      } else {
        $("#player").text(X);
      };

    //Shows winner result
    var resultCondition = game.board.hasWon();
       if (resultCondition) {
        displayResultCondition(resultCondition);
      } else {
        var computerSelection = game.computerMove()+1;
        $("#" + computerSelection).text(COMPUTER);
        resultCondition = game.board.hasWon();
        if (resultCondition) {
         displayResultCondition(resultCondition);
        }
      }
    }
  });

  $("#startOver").click(function () {
    $("#start").fadeIn();
    $(".grid-item").text("");
    $("#result").hide();
  })
});

//Result display
function displayResultCondition (resultCondition) {
  $("#gameDisplay").slideUp();
  $("#result").fadeIn();
  if (resultCondition === "Tie") {
    $("#winner").text("It is a tie!");
  } 
  else if (resultCondition === COMPUTER) {
    $("#winner").text("The Computer Won!");
  }
  else {
    $("#winner").text("You won!");
  }
}