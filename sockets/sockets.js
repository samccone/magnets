var words;
var socket;
var models;
var sockets = {};

function init(webServer, _words, _models) {
  models = _models;
  words = _words;
  socket = require('socket.io').listen(webServer, {
    log: false
  });
  bindEvents();
}

function loadWords() {
  models.Word.find(function(err, _words) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < _words.length; ++i) {
        var newWord = words.addWord(_words[i].word, _words[i].position);
        sendAll(null, {
          word: newWord,
          count: _words.length
        }, "newWord");
      }
    }
  });
}

function bindEvents() {
  socket.sockets.on('connection', function(socket) {
    var _id             = socket.id;
    sockets[_id]        = socket;
    sockets[_id].canAdd = true

    sendAll(null, Object.keys(sockets).length, "peopleOnline");

    socket.on('update', function(data) {
      words.updatePosition(data);
      sendAll(_id, data, "pieceMoved");
    });

    socket.on('remove_word', function(data) {
      models.Word.find({
        word: data.word
      }, function(err, d) {
        d[0].remove();
        words.removeWord(data.word);
        sendAll(_id, data, "pieceRemoved");
      });
    });

    socket.on('stop_update', function(data) {
      words.updatePosition(data);
      models.Word.find({
        word: data.word
      }, function(err, d) {
        d[0].position = data.position;
        d[0].save();
      });
      sendAll(_id, data, "pieceMoved");
    });

    socket.on('newWord', function(data) {
      if (sockets[_id].canAdd) {
        var newWord = words.addWord(data.word);
        sockets[_id].canAdd = false;
        setTimeout(function rateLimit(){
          sockets[_id].canAdd = true;
        }, 5000);

        instance = new models.Word({
          word: newWord.word,
          position: newWord.position
        });

        instance.save();
        sendAll(null, {
          word: newWord,
          count: Object.keys(words.words()).length
        }, "newWord");
      }
    });

    socket.on('disconnect', function(data) {
      delete sockets[_id];
      sendAll(null, Object.keys(sockets).length, "peopleOnline");
    });
  });
}

function sendAll(id, data, key) {
  for (socket in sockets) {
    socket != id && sockets[socket].emit(key, data);
  }
}

exports.init = init;
exports.loadWords = loadWords;