var _       = require('underscore');
var fs      = require('fs');
var words   = loadWords();
var canSave = true;


function loadWords() {
  fs.readFile('savedWords.txt', function(err, data){
    if(err) {
      console.log("Error loading words -- " + err);
      words = {}
    } else {
      words = JSON.parse(data)
    }
  });
  return {};
}

function generatePosition() {
  return {
    top : Math.floor(Math.random() * 600),
    left : Math.floor(Math.random() * 900)
  };
}

function saveWords(force) {
  if(canSave || force) {
    canSave = false;
    setTimeout(function(){ canSave = true }, 1000);
    fs.writeFile('savedWords.txt', JSON.stringify(words), function(err){
      if(err){
        console.log("Error Saving Words");
      }
    });
  }
}

exports.words = function() {
  return words;
}

exports.updatePosition = function(word) {
  saveWords();
  words[word.word].position = word.position;
}

exports.addWord = function(word) {
  var newWord = {
    'word' : word,
    'position' : generatePosition()
  };
  words[word] = newWord;
  saveWords(true);
  return newWord;
}