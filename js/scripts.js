//Global variables.
var EMPTY = "Empty";
var X = "X";
var O = "O";

//Constructor the Space box.
function Space (xCoordinate, yCoordinate) {
  this.X = xCoordinate,
  this.Y = yCoordinate,
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
    return false;
  }
  this.value = value;
  return true;
}

// //
// Space.prototype.markedBy = function() {
//   if (this.value === X) {
//     return X;
//   } else if (this.value === O) {
//     return O
//   }
//   return EMPTY;
// }

//Constructor for Board (full game board). This board contains spaces (Space). Empty array.
function Board() {
  this.spaces = []
}

//Method - it's called when the user clicks starts (newGame).
Board.prototype.initializeBoard = function() {
  var space;
  for (var x=0; x<3; x++) {
    for (var y=0; y<3; y++) {
      space = new Space(x, y);
      this.spaces.push(space);
    }
  }
}

//Method - if isEmpty is false, it pushes 'It's a tie' below with JQuery.
Board.prototype.checkIfFull = function() {
  for (var i=0; i<this.spaces.length; i++) {
    if (this.spaces[i].isEmpty()) {
      return false
    }
  }
  return true
}


//Function - track is an Array. It could be (see next Method) row, colum or diagonal. Returns value if the spaces value in a row, colum or diagonal match or returns false or they don't.
function valueTracker (track) {
  if (track[0].value === track[1].value && track[0].value === track[2].value && track[1].value === track[2].value && track[0].value !== EMPTY) {
    return track[0].value;
  }
  return false
}

//Method - determines if a result on a row, colum or diagonal is the winning one. After row1, the following variables will take the row1 result and compare it with the current valueTracker.
Board.prototype.hasWon = function() {

//Rows
  var row1 = this.spaces.slice(0, 3);
  var result = valueTracker(row1);

  var row2 = this.spaces.slice(3, 6);
  result = result || valueTracker(row2);

  var row3 = this.spaces.slice(6, 9);
  result = result || valueTracker(row3);

//Columns
  var column1 = [this.spaces[0], this.spaces[3], this.spaces[6]];
  result = result || valueTracker(column1);

  var column2 = [this.spaces[1], this.spaces[4], this.spaces[7]];
  result = result || valueTracker(column2);

  var column3 = [this.spaces[2], this.spaces[5], this.spaces[8]];
  result = result || valueTracker(column3);

//Diagonals
  var diagonal1 = [this.spaces[0], this.spaces[4], this.spaces[8]];
  result = result || valueTracker(diagonal1);

  var diagonal2 = [this.spaces[2], this.spaces[4], this.spaces[6]];
  result = result || valueTracker(diagonal2);

//This determines if the board is full and there is no winner.
  if (this.checkIfFull()) {
    if (result) {
      return result
    } else {
      return "Tie"
    }
  }
  return result;
}

//Function - creates a new empty game object/board (no spaces, just an empty array).
function Game() {
  this.board = new Board(),
  this.turn = X
}

//Method - creates the spaces with EMPTY value.
Game.prototype.newGame = function() {
  this.board.initializeBoard()
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

$(document).ready(function() {
  var game;
  $("#startButton").click(function () {
    $("#gameDisplay").fadeIn();
    $("#start").hide();
    $("#player").text(X);
    game = new Game();
    game.newGame();
  });

  $(".grid-item").click(function (event) {
    // console.log(event.target.id);
    var id = event.target.id;
    var result = game.move(id);
      if (result) {
        $("#" + id).text(result);
        if (result === X) {
            $("#player").text(O);
        } else {
          $("#player").text(X);
        }

    var resultCondition = game.board.hasWon();
      if (resultCondition) {
        $("#gameDisplay").hide();
        $("#result").fadeIn();
        if (resultCondition === "Tie") {
          $("#winner").text("It is a tie!");
        } else {
          $("#winner").text("The winner is player " + resultCondition + "!");
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
