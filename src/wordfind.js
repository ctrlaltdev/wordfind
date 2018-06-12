/**
 *Create a words puzzle game
 * @class wordFind
 */
class wordFind {

  /**
   *Creates an instance of wordFind.
   * @param {!Array.<string>} words list of words to include in the puzzle
   * @param {!HTMLElement} domElem HTML DOM Element that will contain the game
   * @param {!Object} [opts={}] game options
   * @param {!string} [opts.lang] define the letters set to use, depending on the words language, must be the ISO 639-1 language code, default: EN
   * @param {!number} [opts.heigth] desired height of the puzzle, default: smallest possible
   * @param {!number} [opts.width] desired width of the puzzle, default: smallest possible
   * @param {!Array.<string>} [opts.orientations=allOrientations] list the authorized orientations in which the words can be formed, default: allOrientations
   * @param {!boolean} [opts.fillBlanks=true] do the game must fill the spaces not used to form a word with random letters, default: true
   * @param {!boolean} [opts.allowExtraBlanks=true] can the game add additional blanks, default: true
   * @param {!number} [opts.maxAttempts=3] number of tries before increasing puzzle size, default: 3
   * @param {!number} [opts.maxGridGrowth=10] number of puzzle grid increases, default: 10
   * @param {!boolean} [opts.preferOverlap=true] maximize word overlap or not, default: true
   * @param {!boolean} [opts.debug=false] wether or not to print the puzzle to the console, default: false
   * @memberof wordFind
   */
  constructor(words, domElem, opts = {}) {

    if (!words.length) {
      throw new Error('No words provided')
    }
    this.attempts = 0
    this.gridGrowths = 0

    this.domElem = domElem
    this.allOrientations = ['horizontal','horizontalBack','vertical','verticalUp','diagonal','diagonalUp','diagonalBack','diagonalUpBack']
    this.orientations = opts.orientations || allOrientations

    /**
     * @param {Array.<string>} wordList copy and sort the words by length, inserting words into the puzzle from longest to shortest works out the best
     */
    this.wordList = words.slice(0).sort()

    // initialize the options
    let maxWordLength = this.wordList[0].length
    this.opts = {
      lang: opts.lang || 'EN',
      height: opts.height || maxWordLength,
      width: opts.width || maxWordLength,
      orientations: this.orientations,
      fillBlanks: opts.fillBlanks !== undefined ? opts.fillBlanks : true,
      allowExtraBlanks: opts.allowExtraBlanks !== undefined ? opts.allowExtraBlanks : true,
      maxAttempts: opts.maxAttempts || 3,
      maxGridGrowth: opts.maxGridGrowth !== undefined ? opts.maxGridGrowth : 10,
      preferOverlap: opts.preferOverlap !== undefined ? opts.preferOverlap : true,
      debug: opts.debug !== undefined ? opts.debug : false
    }

    this.lettersSet = this.setLetters(this.opts.lang)

    this.startSquare = null
    this.lastSquare = null
    this.selectedSquares = []
    this.curWord = ''
    this.curOrientation = null

    this.finalPuzzle = this.newPuzzle()
    this.drawPuzzle()
    this.setEventHandlers()

    // this.startTurn = this.startTurn.bind(this)
    // this.selectSquare = this.selectSquare.bind(this)
    // this.endTurn = this.endTurn.bind(this)
    // this.mouseMove = this.mouseMove.bind(this)
    // this.touchMove = this.touchMove.bind(this)
  }

  /**
   *Compute the next square given a starting square (x, y) and distance (i) from that square
   * @param {!string} orientation
   * @param {!number} x
   * @param {!number} y
   * @param {!number} i
   * @returns {{x: !number, y: !number}} an object {x, y} representing the coordinates of the next square
   * @private
   * @memberof wordFind
   */
  compOrientations(orientation, x, y, i) {
    switch(orientation) {
      case 'horizontal':
        return {x: x + i, y: y }

      case 'horizontalBack':
        return {x: x - i, y: y }

      case 'vertical':
        return {x: x,   y: y + i}

      case 'verticalUp':
        return {x: x,   y: y - i}

      case 'diagonal':
        return {x: x + i, y: y + i}

      case 'diagonalBack':
        return {x: x - i, y: y + i}

      case 'diagonalUp':
        return {x: x + i, y: y - i}

      case 'diagonalUpBack':
        return {x: x - i, y: y - i}

    }
  }

  /**
   *Determines if an orientation is possible given the starting square (x, y), the height (h) and width (w) of the puzzle, and the length of the word (l)
   * @param {!string} orientation
   * @param {!number} x
   * @param {!number} y
   * @param {!number} h heigth of the puzzle
   * @param {!number} w width of the puzzle
   * @param {!number} l length of the word
   * @returns {boolean} true if the word will fit starting at the square provided using the specified orientation
   * @private
   * @memberof wordFind
   */
  checkOrientations(orientation, x, y, h, w, l) {
    switch(orientation) {
      case 'horizontal':
        return w >= x + l
        
      case 'horizontalBack':
        return x + 1 >= l

      case 'vertical':
        return h >= y + l

      case 'verticalUp':
        return y + 1 >= l

      case 'diagonal':
        return (w >= x + l) && (h >= y + l)

      case 'diagonalBack':
        return (x + 1 >= l) && (h >= y + l)

      case 'diagonalUp':
        return (w >= x + l) && (y + 1 >= l)

      case 'diagonalUpBack':
        return (x + 1 >= l) && (y + 1 >= l)
    }
  }

  /**
   *Determines the next possible valid square given the square (x, y) and a word lenght of (l). This greatly reduces the number of squares that must be checked. Returning {x: x + 1, y: y} will always work but will not be optimal.
   * @param {!string} orientation
   * @param {!number} x
   * @param {!number} y
   * @param {!number} l length of the word
   * @returns {{x: number, y: number}} an object {x, y} representing the coordinates of the next square
   * @private
   * @memberof wordFind
   */
  skipOrientations(orientation, x, y, l) {
    switch(orientation) {
      case 'horizontal':
        return {x: 0, y: y + 1}

      case 'horizontalBack':
        return {x: l - 1, y: y}

      case 'vertical':
        return {x: 0, y: y + 100}

      case 'verticalUp':
        return {x: 0, y: l - 1}

      case 'diagonal':
        return {x: 0, y: y + 1}

      case 'diagonalBack':
        return {x: l - 1, y: x >= l - 1 ? y + 1 : y}

      case 'diagonalUp':
        return {x: 0, y: y < l - 1 ? l - 1 : y + 1}

      case 'diagonalUpBack':
        return {x: l - 1, y: x >= l - 1 ? y + 1 : y}
    }
  }

  /**
   *Initializes the puzzle and places words in the puzzle one at a time
   * @param {Array.<string>} wordsList The list of words to fit into the puzzle
   * @param {Object} opts The options to use when filling the puzzle
   * @param {number} opts.height Height of the puzzle
   * @param {number} opts.width Width of the puzzle
   * @returns {Array.<Array>} Returns either a valid puzzle with all of the words or null if a valid
   * @private
   * @memberof wordFind
   */
  fillPuzzle(wordsList, opts) {
    let i, j, len
    // initialize the puzzle with blanks
    this.curPuzzle = []
    for (i = 0; i < opts.height; i++) {
      this.curPuzzle.push([])
      for (j = 0; j < opts.width; j++) {
        this.curPuzzle[i].push('')
      }
    }

    // add each word into the puzzle one at a time
    for (i = 0, len = wordsList.length; i < len; i++) {
      if (!this.placeWordInPuzzle(this.curPuzzle, opts, wordsList[i])) {
        // if a word didn't fit in the puzzle, give up
        return null
      }
    }

    // return the puzzle
    return this.curPuzzle
  }

  /**
   *Adds the specified word to the puzzle by finding all of the possible locations where the word will fit and then randomly selecting one
   * @param {Array.<Array>} puzzle current state of the puzzle
   * @param {Object} opts controls whether or not word overlap should be maximized
   * @param {string} word word to fit into the puzzle
   * @returns {boolean} true if the word was successfully placed, false otherwise
   * @memberof wordFind
   */
  placeWordInPuzzle(puzzle, opts, word) {
    // find all of the best locations where this word would fit
    let locations = this.findBestLocations(puzzle, opts, word)

    if (locations.length === 0) {
      return false
    }

    // select a location at random and place the word there
    let sel = locations[Math.floor(Math.random() * locations.length)]
    this.placeWord(puzzle, word, sel.x, sel.y, sel.orientation)

    return true
  }

  /**
   *Iterates through the puzzle and determines all of the locations where the word fit
   * @param {Array.<Array>} puzzle current state of the puzzle
   * @param {Object} options determines if overlap should be maximized or not
   * @param {string} word word to fit into the puzzle
   * @returns {Array.<{locations: Array.<{x: number, y: number}>, orientation: string, overlap: number}>} list of location objects which contain an x, y coordinate indicating the start of the word, the orientation of the word, and the number of letters that overlapped with existing letter
   * @private
   * @memberof wordFind
   */
  findBestLocations(puzzle, options, word) {
    let locations = [],
        height = options.height,
        width = options.width,
        wordLength = word.length,
        maxOverlap = 0

    // loop through all of the possible orientations at this position
    for (let k = 0, len = options.orientations.length; k < len; k++) {
      let orientation = options.orientations[k], x = 0, y = 0

      // loop through every position on the board
      while( y < height ) {

        // see if this orientation is even possible at this location
        if (this.checkOrientations(orientation, x, y, height, width, wordLength)) {
          // determine if the word fits at the current position
          var overlap = this.calcOverlap(word, puzzle, x, y, orientation)

          // if the overlap was bigger than previous overlaps that we've seen
          if (overlap >= maxOverlap || (!options.preferOverlap && overlap > -1)) {
            maxOverlap = overlap
            locations.push({
              x: x, y: y,
              orientation: orientation,
              overlap: overlap})
          }

          x++

          if (x >= width) {
            x = 0
            y++
          }
        } else {
          // if current cell is invalid, then skip to the next cell where this orientation is possible. this greatly reduces the number of checks that we have to do overall
          let nextPossible = this.skipOrientations(orientation, x, y, wordLength)
          x = nextPossible.x
          y = nextPossible.y
        }
      }
    }

    // finally prune down all of the possible locations we found by
    // only using the ones with the maximum overlap that we calculated
    return options.preferOverlap ?
      this.pruneLocations(locations, maxOverlap) :
      locations
  }

  /**
   *Determines whether or not a particular word fits in a particular
  * orientation within the puzzle
  * @param {string} word word to fit into the puzzle.
  * @param {Array.<Array>} puzzle current state of the puzzle
  * @param {number} x
  * @param {number} y
  * @param {string} orientation orientation to use when computing the next square
  * @returns {number} number of letters overlapped with existing words if the word fits in the specified position, -1 if the word does not fit
   * @private
   * @memberof wordFind
   */
  calcOverlap(word, puzzle, x, y, orientation) {
    let overlap = 0

    // traverse the squares to determine if the word fits
    for (let i = 0, len = word.length; i < len; i++) {

      var next = this.compOrientations(orientation, x, y, i),
          square = puzzle[next.y][next.x]

      // if the puzzle square already contains the letter we are looking for, then count it as an overlap square
      if (square === word[i]) {
        overlap++
      }
      // if it contains a different letter, than our word doesn't fit here, return -1
      else if (square !== '' ) {
        return -1
      }
    }

    // if the entire word is overlapping, skip it to ensure words aren't hidden in other words
    return overlap
  }

  /**
   *If overlap maximization is true, this function is used to prune the list of valid locations down to the ones that contain the maximum overlap that was previously calculated
   * @param {Array.<Object>} locations set of locations to prune
   * @param {number} overlap required level of overlap
   * @returns {Array.<Object>} pruned set of locations
   * @private
   * @memberof wordFind
   */
  pruneLocations(locations, overlap) {
    var pruned = []
    for (let i = 0, len = locations.length; i < len; i++) {
      if (locations[i].overlap >= overlap) {
        pruned.push(locations[i])
      }
    }
    return pruned
  }

  /**
   *Places a word in the puzzle given a starting position and orientation
   * @param {Array.<Array>} puzzle current state of the puzzle
   * @param {string} word word to fit into the puzzle
   * @param {number} x
   * @param {number} y
   * @param {string} orientation orientation to use when computing the next squares
   * @private
   * @memberof wordFind
   */
  placeWord(puzzle, word, x, y, orientation) {
    for (let i = 0, len = word.length; i < len; i++) {
      let next = this.compOrientations(orientation, x, y, i)
      puzzle[next.y][next.x] = word[i]
    }
  }

  /**
   *Define the letters set 
   * @param {!string} [lang=this.opts.lang] ISO 639-1 language code
   * @returns {!string} a string including every character in the set
   * @private
   * @memberof wordFind
   */
  setLetters(lang = this.opts.lang) {
    switch(lang) {
      case 'EN':
        return 'abcdefghijklmnoprstuvwy'

          
      case 'ES':
        return 'abcdefghijklmnoprstuvwy'

      
      case 'FR':
        return 'abcdefghijklmnoprstuvwyéàèùâêîôûçëïü'

      
      case 'IT':
        return 'abcdefghijklmnoprstuvwyàèéìòóù'

      
      case 'DE':
        return 'abcdefghijklmnoprstuvwyäöüß'

      
      case 'JA':
        return 'アカサタナイキシチニウクスツヌエケセテネオコソトノハマヤラワヒミリヰフムユルンヘメレヱホモヨロヲガザダバパギジヂビピグズヅブプゲゼデベペゴゾドボポ'

      
      case 'ZH':
        return '安吧爸八百北不大岛的弟地东都对多儿二方港哥个关贵国过海好很会家见叫姐京九可老李零六吗妈么没美妹们明名哪那南你您朋七起千去人认日三上谁什生师识十是四他她台天湾万王我五西息系先香想小谢姓休学也一亿英友月再张这中字'

      
      case 'HI':
        return 'अआएईऍऎऐइओऑऒऊऔउबभचछडढफफ़गघग़हजझकखख़लळऌऴॡमनङञणऩॐपक़रऋॠऱसशषटतठदथधड़ढ़वयय़ज़'

      
      case 'ID':
        return 'abcdefghijklmnoprstuvwy'

      
      case 'NL':
        return 'abcdefghijklmnoprstuvwyáéíóúàèëïöüĳ'

      
      case 'PL':
        return 'abcdefghijklmnoprstuvwyąćęłńóśżź'

      
      case 'PT':
        return 'abcdefghijklmnoprstuvwyàáâãçéêíóôõú'

      
      case 'RU':
        return 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'

      
      case 'KO':
        return 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅓㅗㅜㅡㅣㅑㅕㅛㅠㄲㄸㅃㅆㅉㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄㅐㅒㅔㅖㅢㅘㅙㅚㅝㅞㅟ'

      
      default:
        console.warn('Language not recognized, falling back to English')
        return 'abcdefghijklmnoprstuvwy'

    }
  }

  /**
   *
   * @param {Array.<string>} [wordList=this.wordList]
   * @param {Object} [options=this.opts]
   * @returns {Array.<Array>}
   * @memberof wordFind
   */
  newPuzzle(wordList = this.wordList, options = this.opts) {
    // add the words to the puzzle
    // since puzzles are random, attempt to create a valid one up to maxAttempts and then increase the puzzle size and try again
    while (!this.curPuzzle) {
      while (!this.curPuzzle && this.attempts++ < options.maxAttempts) {
        this.curPuzzle = this.fillPuzzle(wordList, options)
      }

      if (!this.curPuzzle) {
        this.gridGrowths++
        if (this.gridGrowths > options.maxGridGrowth) {
          throw new Error(`No valid ${options.width}x${options.height} grid found and not allowed to grow more`)
        }
        console.log(`No valid ${options.width}x${options.height} grid found after ${this.attempts - 1} attempts, trying with bigger grid`)
        options.height++
        options.width++
        this.attempts = 0
      }
    }

    // fill in empty spaces with random letters
    if (options.fillBlanks) {
      for (let i = 0, k = this.curPuzzle.length ; i < k ; i++) {
        for (let j = 0, l = this.curPuzzle[i].length ; j < l ; j++) {
          if(this.curPuzzle[i][j] == '') {
            this.curPuzzle[i][j] = this.lettersSet[Math.floor(Math.random() * this.lettersSet.length)]
          }
        }
      }
    }

    if(options.debug) {this.print(this.curPuzzle)}
    return this.curPuzzle
  }

  /**
  *Wrapper around `newPuzzle` allowing to find a solution without some words
  * @param {Object} opts options to use for this puzzle
  */
  newPuzzleLax(words, opts) {
    try {
      return this.newPuzzle(words, opts);
    } catch (e) {
      if (!opts.allowedMissingWords) {
        throw e
      }
      var opts = Object.assign({}, opts); // shallow copy
      opts.allowedMissingWords--
      for (var i = 0; i < words.length; i++) {
        var wordList = words.slice(0)
        wordList.splice(i, 1)
        try {
          this.curPuzzle = this.newPuzzleLax(wordList, opts)
          console.log(`Solution found without word "${words[i]}"`)
          return this.curPuzzle
        } catch (e) {}
      }
      throw e
    }
  }

  /**
   *Returns the starting location and orientation of the specified words within the puzzle. Any words that are not found are returned in the notFound array
   * @param {Array.<Array>} puzzle
   * @param {Array.<string>} words
   * @returns {Array.<{x: number, y: number, orientation: string, word: string, overlap: number}>}
   * @public
   * @memberof wordFind
   */
  solve(puzzle, words) {
    var options = {
          height:       puzzle.length,
          width:        puzzle[0].length,
          orientations: this.orientations,
          preferOverlap: true
        },
        found = [],
        notFound = []

    for(var i = 0, len = words.length; i < len; i++) {
      let word = words[i],
          locations = this.findBestLocations(puzzle, options, word)

      if (locations.length > 0 && locations[0].overlap === word.length) {
        locations[0].word = word
        found.push(locations[0])
      } else {
        notFound.push(word)
      }
    }

    return { found: found, notFound: notFound }
  }

  /**
   *Outputs a puzzle to the console, useful for debugging
   * @param {Array.<Array>} puzzle current state of the puzzle
   * @returns {string} formatted string representing the puzzle
   * @memberof wordFind
   */
  print(puzzle) {
    let puzzleString = ''
    for (var i = 0, height = puzzle.length; i < height; i++) {
      var row = puzzle[i]
      for (var j = 0, width = row.length; j < width; j++) {
        puzzleString += (row[j] === '' ? ' ' : row[j]) + ' '
      }
      puzzleString += '\n'
    }

    console.log(puzzleString)
    return puzzleString
  }

  /**
   *Draws the puzzle by inserting rows of buttons into the DOM Element
   * @param {HTMLElement} [domElem=this.domElem]
   * @param {Array.<Array>} [puzzle=this.finalPuzzle]
   * @memberof wordFind
   */
  drawPuzzle(domElem = this.domElem, puzzle = this.finalPuzzle) {
    while (domElem.firstChild) {
      domElem.removeChild(domElem.firstChild);
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
      domElem.appendChild(div);
    }
  }

  /**
   *Given two points, ensure that they are adjacent and determine what orientation the second point is relative to the first
   * @param {number} x1 x coordinate of the first point
   * @param {number} y1 y coordinate of the first point
   * @param {number} x2 x coordinate of the second point
   * @param {number} y2 y coordinate of the second point
   * @returns {string} matching orientation
   * @private
   * @memberof wordFind
   */
  calcOrientation(x1, y1, x2, y2) {
    for (let i = 0 ; i < this.orientations.length ; i++) {
      let nextPos = this.compOrientations(this.orientations[i], x1, y1, 1)

      if (nextPos.x === x2 && nextPos.y === y2) {
        return this.orientations[i]
      }

      return null
    }
  }

  startTurn(e) {
    let elem = e.target
    elem.classList.add('selected')
    this.startSquare = elem
    this.selectedSquares.push(elem)
    this.curWord = elem.innerText
  }

  mouseMove(e) {
    let elem = e.target
    this.selectSquare(elem)
  }

  touchMove(e) {
    let xPos = e.touches[0].pageX
    let yPos = e.touches[0].pageY
    let elem = document.elementFromPoint(xPos, yPos)
    this.selectSquare(elem)
  }

  selectSquare(elem) {
    let lastSquare = this.selectedSquares[this.selectedSquares.length - 1]
    if (this.startSquare && elem !== this.startSquare) {
      let orientation = this.calcOrientation(
        lastSquare.getAttribute('x'),
        lastSquare.getAttribute('y'),
        elem.getAttribute('x'),
        elem.getAttribute('y'),
      )
      if (this.curOrientation == '' || this.curOrientation == orientation) {
        this.playTurn(elem)
      } else {
        this.endTurn()
      }
    }    
  }

  playTurn(elem) {
    for (var i = 0, len = this.wordList.length; i < len; i++) {
      if (this.wordList[i].toUpperCase().indexOf(this.curWord.toUpperCase() + elem.innerText.toUpperCase()) === 0) {
        elem.classList.add('selected')
        this.selectedSquares.push(elem)
        this.curWord += elem.innerText
      }
    }
  }

  endTurn() {
    for (let i = 0 ; i < this. wordList.length ; i++) {
      if (this.wordList[i].toUpperCase() === this.curWord.toUpperCase()) {
        let selected = document.querySelectorAll('.selected');
        [].forEach.call(selected, (item) => {
          item.classList.add('found')
        })
        this.wordList.splice(i, 1)
      }

      if (this.wordList.length === 0) {
        let completed = document.querySelectorAll('.puzzleSquare');
        [].forEach.call(completed, (item) => {
          item.classList.add('complete')
        })
      }
    }

    // reset the turn
    let selected = document.querySelectorAll('.selected');
    [].forEach.call(selected, (item) => {
      item.classList.remove('selected')
    })
    this.startSquare = null
    this.lastSquare = null
    this.selectedSquares = []
    this.curWord = ''
    this.curOrientation = null
  }

  

  /**
   *Set the event handlers that will trigger the recognition of the words
   * @param {HTMLElement} [domElem=this.domElem]
   * @memberof wordFind
   */
  setEventHandlers(domElem = this.domElem) {
    if (window.navigator.msPointerEnabled) {
      let puzzleSquare = domElem.querySelectorAll('.puzzleSquare');
      [].forEach.call(puzzleSquare, (item) => {
        item.addEventListener('MSPointerDown', this.startTurn.bind(this))
        item.addEventListener('MSPointerOver', this.selectSquare.bind(this))
        item.addEventListener('MSPointerUp', this.endTurn.bind(this))
      })
    } else {
      let puzzleSquare = domElem.querySelectorAll('.puzzleSquare');
      [].forEach.call(puzzleSquare, (item) => {
        item.addEventListener('mousedown', this.startTurn.bind(this))
        item.addEventListener('mouseenter', this.mouseMove.bind(this))
        item.addEventListener('mouseup', this.endTurn.bind(this))
        item.addEventListener('touchstart', this.startTurn.bind(this))
        item.addEventListener('touchmove', this.touchMove.bind(this))
        item.addEventListener('touchend', this.endTurn.bind(this))
      })
    }
  }
}

export default wordFind