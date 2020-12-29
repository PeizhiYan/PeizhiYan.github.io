"use strict";

var STARTUP_FEN = [
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKAB1R w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/R1BAKAB1R w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/9/1C5C1/9/RN2K2NR w",
];

function createOption(text, value, ie8) {
  var opt = document.createElement("option");
  opt.selected = true;
  opt.value = value;
  if (ie8) {
    opt.text = text;
  } else {
    opt.innerHTML = text.replace(/ /g, "&nbsp;");
  }
  return opt;
}

console.log("creating board")
var board = new Board(container, "images/", "sounds/");
board.setSearch(16);
board.millis = 10;
board.millis = 2000;
console.log("board created")
console.log(board.millis);

// Hide the board and undo button
$("#game_board").hide();
$("#undo_button").hide();
$("#board_selector").hide();

board.computer = 1;
board.onAddMove = function() {
  var counter = (board.pos.mvList.length >> 1);
  var space = (counter > 99 ? "    " : "   ");
  counter = (counter > 9 ? "" : " ") + counter + ".";
  var text = (board.pos.sdPlayer == 0 ? space : counter) + move2Iccs(board.mvLast);
  var value = "" + board.mvLast;
  try {
    selMoveList.add(createOption(text, value, false));
  } catch (e) {
    selMoveList.add(createOption(text, value, true));
  }
  selMoveList.scrollTop = selMoveList.scrollHeight;
};

function level_change() {
    let tt = document.getElementById("selLevel")
    board.millis = tt.options[tt.selectedIndex].value;
    console.log (board.millis );
}


function start_click() {
  selMoveList.options.length = 1;
  selMoveList.selectedIndex = 0;
  board.computer = 1 - selMoveMode.selectedIndex;
  //board.restart(STARTUP_FEN[selHandicap.selectedIndex]);
  $("#game_board").show();
  $("#undo_button").show();
  $("#type_selector").hide();
  $("#level_selector").hide();
  $("#start_button").hide();
  console.log("mode: ", selMoveMode.selectedIndex)
  if(selMoveMode.selectedIndex == 1){
    // Computer First
    console.log('Computer First')
    retract_click();
  }
  if(selTheme.selectedIndex == 1){
    board.images='images_international/';
  }
  $("#theme_selector").hide();
  $("#board_selector").show();
  board.flushBoard();

  // game board width is 521 pixels
  var scale_ = (window.innerWidth-20)/521
  document.body.style.transform = 'scale(' + scale_ + ')';
  console.log(window.innerWidth)
  document.body.style['-o-transform'] = 'scale(' + scale_ + ')';
  document.body.style['-webkit-transform'] = 'scale(' + scale_ + ')';
  document.body.style['-moz-transform'] = 'scale(' + scale_ + ')';
}

function retract_click() {
  for (var i = board.pos.mvList.length; i < selMoveList.options.length; i ++) {
    board.pos.makeMove(parseInt(selMoveList.options[i].value));
  }
  board.retract();
  selMoveList.options.length = board.pos.mvList.length;
  selMoveList.selectedIndex = selMoveList.options.length - 1;
}

function moveList_change() {
  if (board.result == RESULT_UNKNOWN) {
    selMoveList.selectedIndex = selMoveList.options.length - 1;
    return;
  }
  var from = board.pos.mvList.length;
  var to = selMoveList.selectedIndex;
  if (from == to + 1) {
    return;
  }
  if (from > to + 1) {
    for (var i = to + 1; i < from; i ++) {
      board.pos.undoMakeMove();
    }
  } else {
    for (var i = from; i <= to; i ++) {
      board.pos.makeMove(parseInt(selMoveList.options[i].value));
    }
  }
  board.flushBoard();
}
