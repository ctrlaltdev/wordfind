<a name="wordPuzzle"></a>

## wordPuzzle
**Kind**: global class

* [wordPuzzle](#wordPuzzle)
    * [new wordPuzzle()](#new_wordPuzzle_new)
    * _instance_
        * [.wordList](#wordPuzzle+wordList)
        * [.placeWordInPuzzle(puzzle, opts, word)](#wordPuzzle+placeWordInPuzzle) ⇒ <code>boolean</code>
        * [.newPuzzle([wordList], [options])](#wordPuzzle+newPuzzle) ⇒ <code>Array.&lt;Array&gt;</code>
        * [.newPuzzleLax(opts)](#wordPuzzle+newPuzzleLax)
        * [.solve(puzzle, words)](#wordPuzzle+solve) ⇒ <code>Array.&lt;{x: number, y: number, orientation: string, word: string, overlap: number}&gt;</code>
        * [.print(puzzle)](#wordPuzzle+print) ⇒ <code>string</code>
        * [.drawPuzzle([domElem], [puzzle])](#wordPuzzle+drawPuzzle)
        * [.setEventHandlers([domElem])](#wordPuzzle+setEventHandlers)
    * _static_
        * [.wordPuzzle](#wordPuzzle.wordPuzzle)
            * [new wordPuzzle(words, domElem, [opts])](#new_wordPuzzle.wordPuzzle_new)

<a name="new_wordPuzzle_new"></a>

### new wordPuzzle()
Create a words puzzle game

<a name="wordPuzzle+wordList"></a>

### wordPuzzle.wordList
**Kind**: instance property of [<code>wordPuzzle</code>](#wordPuzzle)

| Param | Type | Description |
| --- | --- | --- |
| wordList | <code>Array.&lt;string&gt;</code> | copy and sort the words by length, inserting words into the puzzle from longest to shortest works out the best |

<a name="wordPuzzle+placeWordInPuzzle"></a>

### wordPuzzle.placeWordInPuzzle(puzzle, opts, word) ⇒ <code>boolean</code>
Adds the specified word to the puzzle by finding all of the possible locations where the word will fit and then randomly selecting one

**Kind**: instance method of [<code>wordPuzzle</code>](#wordPuzzle)
**Returns**: <code>boolean</code> - true if the word was successfully placed, false otherwise

| Param | Type | Description |
| --- | --- | --- |
| puzzle | <code>Array.&lt;Array&gt;</code> | current state of the puzzle |
| opts | <code>Object</code> | controls whether or not word overlap should be maximized |
| word | <code>string</code> | word to fit into the puzzle |

<a name="wordPuzzle+newPuzzle"></a>

### wordPuzzle.newPuzzle([wordList], [options]) ⇒ <code>Array.&lt;Array&gt;</code>
**Kind**: instance method of [<code>wordPuzzle</code>](#wordPuzzle)

| Param | Type | Default |
| --- | --- | --- |
| [wordList] | <code>Array.&lt;string&gt;</code> | <code>this.wordList</code> |
| [options] | <code>Object</code> | <code>this.opts</code> |

<a name="wordPuzzle+newPuzzleLax"></a>

### wordPuzzle.newPuzzleLax(opts)
Wrapper around `newPuzzle` allowing to find a solution without some words

**Kind**: instance method of [<code>wordPuzzle</code>](#wordPuzzle)

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | options to use for this puzzle |

<a name="wordPuzzle+solve"></a>

### wordPuzzle.solve(puzzle, words) ⇒ <code>Array.&lt;{x: number, y: number, orientation: string, word: string, overlap: number}&gt;</code>
Returns the starting location and orientation of the specified words within the puzzle. Any words that are not found are returned in the notFound array

**Kind**: instance method of [<code>wordPuzzle</code>](#wordPuzzle)
**Access**: public

| Param | Type |
| --- | --- |
| puzzle | <code>Array.&lt;Array&gt;</code> |
| words | <code>Array.&lt;string&gt;</code> |

<a name="wordPuzzle+print"></a>

### wordPuzzle.print(puzzle) ⇒ <code>string</code>
Outputs a puzzle to the console, useful for debugging

**Kind**: instance method of [<code>wordPuzzle</code>](#wordPuzzle)
**Returns**: <code>string</code> - formatted string representing the puzzle

| Param | Type | Description |
| --- | --- | --- |
| puzzle | <code>Array.&lt;Array&gt;</code> | current state of the puzzle |

<a name="wordPuzzle+drawPuzzle"></a>

### wordPuzzle.drawPuzzle([domElem], [puzzle])
Draws the puzzle by inserting rows of buttons into the DOM Element

**Kind**: instance method of [<code>wordPuzzle</code>](#wordPuzzle)

| Param | Type | Default |
| --- | --- | --- |
| [domElem] | <code>HTMLElement</code> | <code>this.domElem</code> |
| [puzzle] | <code>Array.&lt;Array&gt;</code> | <code>this.finalPuzzle</code> |

<a name="wordPuzzle+setEventHandlers"></a>

### wordPuzzle.setEventHandlers([domElem])
Set the event handlers that will trigger the recognition of the words

**Kind**: instance method of [<code>wordPuzzle</code>](#wordPuzzle)

| Param | Type | Default |
| --- | --- | --- |
| [domElem] | <code>HTMLElement</code> | <code>this.domElem</code> |

<a name="wordPuzzle.wordPuzzle"></a>

### wordPuzzle.wordPuzzle
**Kind**: static class of [<code>wordPuzzle</code>](#wordPuzzle)
<a name="new_wordPuzzle.wordPuzzle_new"></a>

#### new wordPuzzle(words, domElem, [opts])
Creates an instance of wordPuzzle.


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