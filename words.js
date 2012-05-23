var _ = require('underscore');
var words = {};

function generatePosition() {
  return {
    top : Math.floor(Math.random() * 600),
    left : Math.floor(Math.random() * 900)
  };
}

exports.words = function() {
  return words;
}

exports.updatePosition = function(word) {
  words[word.word].position = word.position;
}

exports.addWord = function(word) {
  var newWord = {
    'word' : word,
    'position' : generatePosition()
  };
  words[word] = newWord;
  return newWord;
}