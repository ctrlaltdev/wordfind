/* Example words setup */
[
  'sensible',
  'sincere',
  'complice',
  'creative',
  'elegante',
  'farceuse'
].map(word => WordFindGame.insertWordBefore(document.getElementById('add-word').parentNode, word));
document.getElementById('secret-word').value = '';

/* Init */
function recreate() {
  document.getElementById('result-message').className = '';
  var fillBlanks, game;
  try {
      game = new WordFindGame('#puzzle', {
          fillBlanks: true,
          orientations: ['horizontal', 'vertical']
      });
  } catch (error) {
      document.getElementById('result-message').innerText = `😞  ${error}`;
      console.warn(error);
      document.getElementById('result-message').style.color = 'red';
      return;
  }
  wordfind.print(game);
  if (window.game) {
      var emptySquaresCount = WordFindGame.emptySquaresCount();
      document.getElementById('result-message').innerText = `😃 ${emptySquaresCount ? 'but there are empty squares' : ''}`;
      document.getElementById('result-message').style.color = '';
  }
  window.game = game;
}
recreate();

/* Event listeners */
document.querySelector('#extra-letters').addEventListener('change', (evt) => {
  document.querySelector('#secret-word').setAttribute('disabled', !evt.target.value.startsWith('secret-word'));
});

document.getElementById('add-word').addEventListener('click', () => WordFindGame.insertWordBefore(document.getElementById('add-word').parentNode));

document.getElementById('create-grid').addEventListener('click', recreate);

document.getElementById('solve').addEventListener('click', () => game.solve());