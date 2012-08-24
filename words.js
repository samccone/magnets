var words   = {};
var canSave = true;

function generatePosition() {
  return {
    top : Math.floor(Math.random() * 600),
    left : Math.floor(Math.random() * 900)
  };
}


exports.removeWord = function(word) {
  delete words[word];
}

exports.words = function() {
  return words;
}

exports.updatePosition = function(word) {
  words[word.word].position = word.position;
}

exports.addWord = function(word, pos) {
  var newWord = {
    'word' : word,
    'position' : pos || generatePosition()
  };
  words[word] = newWord;
  return newWord;
}