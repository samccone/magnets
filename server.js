var express   = require('express');
var webServer = express.createServer();
var socket    = require('socket.io').listen(webServer, { log : false });
var words     = require('./words.js');

webServer.set("view engine", "jade");
webServer.use(express.static(__dirname + '/public'));
webServer.get('/', function(req, res){
  res.render('index', { locals : { 'words' : words.words(), 'connections' : Object.keys(sockets).length } });
});

socket.configure(function () {
  socket.set("transports", ["xhr-polling"]);
  socket.set("polling duration", 10);
});

var port = process.env.PORT || 3000;

webServer.listen(port);

var sockets = {};
socket.sockets.on('connection', function(socket){
  sockets[socket.id] = socket;
  sendAll(null, Object.keys(sockets).length, "peopleOnline");
  var _id = socket.id;
  sockets[_id] = socket;

  socket.on('update',function(data){
    words.updatePosition(data);
    sendAll(_id, data, "pieceMoved");
  });

  socket.on('newWord', function(data){
    sendAll(null, words.addWord(data.word), "newWord");;
  });

  socket.on('disconnect', function(data){
    delete sockets[_id];
    sendAll(null, Object.keys(sockets).length, "peopleOnline");
  });
});


function sendAll(id, data, key){
  for( socket in sockets) {
    socket != id && sockets[socket].emit(key, data);
  }
}