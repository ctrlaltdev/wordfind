<a name="wordFind"></a>

## wordFind
**Kind**: global class

* [wordFind](#wordFind)
    * [new wordFind()](#new_wordFind_new)
    * _instance_
        * [.wordList](#wordFind+wordList)
        * [.placeWordInPuzzle(puzzle, opts, word)](#wordFind+placeWordInPuzzle) ⇒ <code>boolean</code>
        * [.newPuzzle([wordList], [options])](#wordFind+newPuzzle) ⇒ <code>Array.&lt;Array&gt;</code>
        * [.newPuzzleLax(opts)](#wordFind+newPuzzleLax)
        * [.solve(puzzle, words)](#wordFind+solve) ⇒ <code>Array.&lt;{x: number, y: number, orientation: string, word: string, overlap: number}&gt;</code>
        * [.print(puzzle)](#wordFind+print) ⇒ <code>string</code>
        * [.drawPuzzle([domElem], [puzzle])](#wordFind+drawPuzzle)
        * [.setEventHandlers([domElem])](#wordFind+setEventHandlers)
    * _static_
        * [.wordFind](#wordFind.wordFind)
            * [new wordFind(words, domElem, [opts])](#new_wordFind.wordFind_new)

<a name="new_wordFind_new"></a>

### new wordFind()
Create a words puzzle game

<a name="wordFind+wordList"></a>

### wordFind.wordList
**Kind**: instance property of [<code>wordFind</code>](#wordFind)

| Param | Type | Description |
| --- | --- | --- |
| wordList | <code>Array.&lt;string&gt;</code> | copy and sort the words by length, inserting words into the puzzle from longest to shortest works out the best |

<a name="wordFind+placeWordInPuzzle"></a>

### wordFind.placeWordInPuzzle(puzzle, opts, word) ⇒ <code>boolean</code>
Adds the specified word to the puzzle by finding all of the possible locations where the word will fit and then randomly selecting one

**Kind**: instance method of [<code>wordFind</code>](#wordFind)
**Returns**: <code>boolean</code> - true if the word was successfully placed, false otherwise

| Param | Type | Description |
| --- | --- | --- |
| puzzle | <code>Array.&lt;Array&gt;</code> | current state of the puzzle |
| opts | <code>Object</code> | controls whether or not word overlap should be maximized |
| word | <code>string</code> | word to fit into the puzzle |

<a name="wordFind+newPuzzle"></a>

### wordFind.newPuzzle([wordList], [options]) ⇒ <code>Array.&lt;Array&gt;</code>
**Kind**: instance method of [<code>wordFind</code>](#wordFind)

| Param | Type | Default |
| --- | --- | --- |
| [wordList] | <code>Array.&lt;string&gt;</code> | <code>this.wordList</code> |
| [options] | <code>Object</code> | <code>this.opts</code> |

<a name="wordFind+newPuzzleLax"></a>

### wordFind.newPuzzleLax(opts)
Wrapper around `newPuzzle` allowing to find a solution without some words

**Kind**: instance method of [<code>wordFind</code>](#wordFind)

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | options to use for this puzzle |

<a name="wordFind+solve"></a>

### wordFind.solve(puzzle, words) ⇒ <code>Array.&lt;{x: number, y: number, orientation: string, word: string, overlap: number}&gt;</code>
Returns the starting location and orientation of the specified words within the puzzle. Any words that are not found are returned in the notFound array

**Kind**: instance method of [<code>wordFind</code>](#wordFind)
**Access**: public

| Param | Type |
| --- | --- |
| puzzle | <code>Array.&lt;Array&gt;</code> |
| words | <code>Array.&lt;string&gt;</code> |

<a name="wordFind+print"></a>

### wordFind.print(puzzle) ⇒ <code>string</code>
Outputs a puzzle to the console, useful for debugging

**Kind**: instance method of [<code>wordFind</code>](#wordFind)
**Returns**: <code>string</code> - formatted string representing the puzzle

| Param | Type | Description |
| --- | --- | --- |
| puzzle | <code>Array.&lt;Array&gt;</code> | current state of the puzzle |

<a name="wordFind+drawPuzzle"></a>

### wordFind.drawPuzzle([domElem], [puzzle])
Draws the puzzle by inserting rows of buttons into the DOM Element

**Kind**: instance method of [<code>wordFind</code>](#wordFind)

| Param | Type | Default |
| --- | --- | --- |
| [domElem] | <code>HTMLElement</code> | <code>this.domElem</code> |
| [puzzle] | <code>Array.&lt;Array&gt;</code> | <code>this.finalPuzzle</code> |

<a name="wordFind+setEventHandlers"></a>

### wordFind.setEventHandlers([domElem])
Set the event handlers that will trigger the recognition of the words

**Kind**: instance method of [<code>wordFind</code>](#wordFind)

| Param | Type | Default |
| --- | --- | --- |
| [domElem] | <code>HTMLElement</code> | <code>this.domElem</code> |

<a name="wordFind.wordFind"></a>

### wordFind.wordFind
**Kind**: static class of [<code>wordFind</code>](#wordFind)
<a name="new_wordFind.wordFind_new"></a>

#### new wordFind(words, domElem, [opts])
Creates an instance of wordFind.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| words | <code>Array.&lt;string&gt;</code> |  | list of words to include in the puzzle |
| domElem | <code>HTMLElement</code> |  | HTML DOM Element that will contain the game |
| [opts] | <code>Object</code> | <code>{}</code> | game options |
| [opts.lang] | <code>string</code> |  | define the letters set to use, depending on the words language, must be the ISO 639-1 language code, default: EN |
| [opts.heigth] | <code>number</code> |  | desired height of the puzzle, default: smallest possible |
| [opts.width] | <code>number</code> |  | desired width of the puzzle, default: smallest possible |
| [opts.orientations] | <code>Array.&lt;string&gt;</code> | <code>allOrientations</code> | list the authorized orientations in which the words can be formed, default: allOrientations |
| [opts.fillBlanks] | <code>boolean</code> | <code>true</code> | do the game must fill the spaces not used to form a word with random letters, default: true |
| [opts.allowExtraBlanks] | <code>boolean</code> | <code>true</code> | can the game add additional blanks, default: true |
| [opts.maxAttempts] | <code>number</code> | <code>3</code> | number of tries before increasing puzzle size, default: 3 |
| [opts.maxGridGrowth] | <code>number</code> | <code>10</code> | number of puzzle grid increases, default: 10 |
| [opts.preferOverlap] | <code>boolean</code> | <code>true</code> | maximize word overlap or not, default: true |
| [opts.debug] | <code>boolean</code> | <code>false</code> | wether or not to print the puzzle to the console, default: false |