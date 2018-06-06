/**
* Wordfind.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Wordfind is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/wordfind
*/

(function (document, wordfind) {
  'use strict';

  /**
  * An example game using the puzzles created from wordfind.js. Click and drag
  * to highlight words.
  *
  * WordFindGame requires wordfind.js.
  */

    /**
    * Draws the puzzle by inserting rows of buttons into el.
    *
    * @param {String} el: The element to write the puzzle to
    * @param {[[String]]} puzzle: The puzzle to draw
    */
    var drawPuzzle = function (el, puzzle) {
      while (document.querySelector(el).firstChild) {
        document.querySelector(el).removeChild(document.querySelector(el).firstChild);
      }
      // for each row in the puzzle
      for (var i = 0, height = puzzle.length; i < height; i++) {
        // append a div to represent a row in the puzzle
        let div = document.createElement('div');
        var row = puzzle[i];
        // for each element in that row
        for (var j = 0, width = row.length; j < width; j++) {
            // append our button with the appropriate class
            let btn = document.createElement('button');
            btn.classList.add('puzzleSquare');
            btn.setAttribute('x', j);
            btn.setAttribute('y', i);
            let btnTxt = document.createTextNode(row[j] || '&nbsp;');
            btn.appendChild(btnTxt);
            div.appendChild(btn);
        }
        // close our div that represents a row
        document.querySelector(el).appendChild(div);
      }
    };

    var getWords = function () {
      let words = document.querySelectorAll('input.word');
      let wordlist = [];
      [].forEach.call(words, (wordEl) => {
        wordlist.push(wordEl.value.toLowerCase());
      });
      return wordlist;
    };

    /**
    * Given two points, ensure that they are adjacent and determine what
    * orientation the second point is relative to the first
    *
    * @param {int} x1: The x coordinate of the first point
    * @param {int} y1: The y coordinate of the first point
    * @param {int} x2: The x coordinate of the second point
    * @param {int} y2: The y coordinate of the second point
    */
    var calcOrientation = function (x1, y1, x2, y2) {

      for (var orientation in wordfind.orientations) {
        var nextFn = wordfind.orientations[orientation];
        var nextPos = nextFn(x1, y1, 1);

        if (nextPos.x === x2 && nextPos.y === y2) {
          return orientation;
        }
      }

      return null;
    };


  /**
  * Initializes the WordFindGame object.
  *
  * Creates a new word find game and draws the board and words.
  *
  * Returns the puzzle that was created.
  *
  * @param {String} puzzleEl: Selector to use when inserting the puzzle
  * @param {Options} options: WordFind options to use when creating the puzzle
  */
  var WordFindGame = function (puzzleEl, options) {

    // Class properties, game initial config:
    var wordList, puzzle;

    /**
    * Game play events.
    *
    * The following events handle the turns, word selection, word finding, and
    * game end.
    *
    */

    // Game state
    var startSquare, selectedSquares = [], curOrientation, curWord = '';

    /**
    * Event that handles mouse down on a new square. Initializes the game state
    * to the letter that was selected.
    *
    */
    var startTurn = function () {
      this.classList.add('selected');
      startSquare = this;
      selectedSquares.push(this);
      curWord = this.innerText;
    };
    
    var touchMove = function(e) {
      var xPos = e.originalEvent.touches[0].pageX;
      var yPos = e.originalEvent.touches[0].pageY;
      var targetElement = document.elementFromPoint(xPos, yPos);
      select(targetElement)
    };
    
    var mouseMove = function() { 
      select(this);
    };

    /**
    * Event that handles mouse over on a new square. Ensures that the new square
    * is adjacent to the previous square and the new square is along the path
    * of an actual word.
    *
    */
    var select = function (target) {
      // if the user hasn't started a word yet, just return
      if (!startSquare) {
        return;
      }

      // if the new square is actually the previous square, just return
      var lastSquare = selectedSquares[selectedSquares.length-1];
      if (lastSquare == target) {
        return;
      }

      // see if the user backed up and correct the selectedSquares state if
      // they did
      var backTo;
      for (var i = 0, len = selectedSquares.length; i < len; i++) {
        if (selectedSquares[i] == target) {
          backTo = i+1;
          break;
        }
      }

      while (backTo < selectedSquares.length) {
        document.querySelector(selectedSquares[selectedSquares.length-1]).classList.remove('selected');
        selectedSquares.splice(backTo,1);
        curWord = curWord.substr(0, curWord.length-1);
      }


      // see if this is just a new orientation from the first square
      // this is needed to make selecting diagonal words easier
      var newOrientation = calcOrientation(
        document.querySelector(startSquare).getAttribute('x') - 0,
        document.querySelector(startSquare).getAttribute('y') - 0,
        document.querySelector(target).getAttribute('x') - 0,
        document.querySelector(target).getAttribute('y') - 0
        );

      if (newOrientation) {
        selectedSquares = [startSquare];
        curWord = document.querySelector(startSquare).innerText;
        if (lastSquare !== startSquare) {
          document.querySelector(lastSquare).classList.remove('selected');
          lastSquare = startSquare;
        }
        curOrientation = newOrientation;
      }

      // see if the move is along the same orientation as the last move
      var orientation = calcOrientation(
        document.querySelector(lastSquare).getAttribute('x') - 0,
        document.querySelector(lastSquare).getAttribute('y') - 0,
        document.querySelector(target).getAttribute('x') - 0,
        document.querySelector(target).getAttribute('y') - 0
        );

      // if the new square isn't along a valid orientation, just ignore it.
      // this makes selecting diagonal words less frustrating
      if (!orientation) {
        return;
      }

      // finally, if there was no previous orientation or this move is along
      // the same orientation as the last move then play the move
      if (!curOrientation || curOrientation === orientation) {
        curOrientation = orientation;
        playTurn(target);
      }
    };

    /**
    * Updates the game state when the previous selection was valid.
    *
    * @param {el} square: The element that was played
    */
    var playTurn = function (square) {

      // make sure we are still forming a valid word
      for (var i = 0, len = wordList.length; i < len; i++) {
        if (wordList[i].indexOf(curWord + document.querySelector(square).innerText) === 0) {
          document.querySelector(square).classList.add('selected');
          selectedSquares.push(square);
          curWord += document.querySelector(square).innertext;
          break;
        }
      }
    };

    /**
    * Event that handles mouse up on a square. Checks to see if a valid word
    * was created and updates the class of the letters and word if it was. Then
    * resets the game state to start a new word.
    *
    */
    var endTurn = function () {
      // see if we formed a valid word
      for (var i = 0, len = wordList.length; i < len; i++) {
        
        if (wordList[i] === curWord) {
          let selected = document.querySelectorAll('.selected');
          [].forEach.call(select, (item) => {
            item.classList.add('found');
          });
          wordList.splice(i,1);
          document.querySelector('input.word[value="' + curWord + '"]').classList.add('wordFound');
        }

        if (wordList.length === 0) {
          let completed = document.querySelectorAll('.puzzleSquare');
          [].forEach.call(completed, (item) => {
            item.classList.add('complete');
          });
        }
      }

      // reset the turn
      let selected = document.querySelectorAll('.selected');
      [].forEach.call(selected, (item) => {
        item.classList.remove('selected');
      });
      startSquare = null;
      selectedSquares = [];
      curWord = '';
      curOrientation = null;
    };

    /* Constructor START */
    let founds = document.querySelectorAll('input.word');
      [].forEach.call(founds, (item) => {
        item.classList.remove('wordFound');
      });

    // Class properties, game initial config:
    wordList = getWords().sort();
    puzzle = wordfind.newPuzzleLax(wordList, options);

    // Draw all of the words
    drawPuzzle(puzzleEl, puzzle);

    // attach events to the buttons
    // optimistically add events for windows 8 touch
    if (window.navigator.msPointerEnabled) {
      let puzzleSquare = document.querySelectorAll('.puzzleSquare');
      [].forEach.call(puzzleSquare, (item) => {
        item.addEventListener('MSPointerDown', startTurn);
        item.addEventListener('MSPointerOver', select);
        item.addEventListener('MSPointerUp', endTurn);
      });
    } else {
      let puzzleSquare = document.querySelectorAll('.puzzleSquare');
      [].forEach.call(puzzleSquare, (item) => {
        item.addEventListener('mousedown', startTurn);
        item.addEventListener('mouseenter', mouseMove);
        item.addEventListener('mouseup', endTurn);
        item.addEventListener('touchstart', startTurn);
        item.addEventListener('touchmove', touchMove);
        item.addEventListener('touchend', endTurn);
      });
    }

    /**
    * Solves an existing puzzle.
    *
    * @param {[[String]]} puzzle: The puzzle to solve
    */
    this.solve = function() {
      var solution = wordfind.solve(puzzle, wordList).found;

      for( var i = 0, len = solution.length; i < len; i++) {
        var word = solution[i].word,
            orientation = solution[i].orientation,
            x = solution[i].x,
            y = solution[i].y,
            next = wordfind.orientations[orientation];

        var wordEl = document.querySelector('input.word[value="' + word + '"]');
        if (!wordEl.classList.contains('wordFound')) {
          for (var j = 0, size = word.length; j < size; j++) {
            var nextPos = next(x, y, j);
            document.querySelector('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').classList.add('solved');
          }

          wordEl.classList.add('wordFound');
        }
      }
    };
  };

  WordFindGame.emptySquaresCount = function () {
    var allSquares = [].slice.call(document.querySelectorAll('.puzzleSquare'));
    return allSquares.length - allSquares.filter(b => b.textContent.trim()).length;
  };

  // Static method
  WordFindGame.insertWordBefore = function (el, word) {
    let li = document.createElement('li');
    let input = document.createElement('input');
    input.classList.add('word');
    input.setAttribute('value', (word || ''));
    li.appendChild(input);
    el.parentNode.insertBefore(li, el);
  };


  /**
  * Allow game to be used within the browser
  */
  window.WordFindGame = WordFindGame;

}(document, wordfind));
