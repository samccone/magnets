var express   = require('express');
var webServer = express.createServer();
var socket    = require('socket.io').listen(webServer, { log : false });
var words     = require('./words.js').words();

webServer.set("view engine", "jade");
webServer.use(express.static(__dirname + '/public'));
webServer.get('/', function(req, res){
  res.render('index', { locals : { 'words' : words } });
});

webServer.listen(9999);

var sockets = {};
socket.sockets.on('connection', function(socket){
  sockets[socket.id] = socket;
  var _id = socket.id;
  sockets[_id] = socket;

  socket.on('update',function(data){
    words[data.word].position = data.position;
    sendAll(_id, data);
  });

  socket.on('disconnect', function(data){
    delete sockets[_id];
  });
});


function sendAll(id, data){
  for( socket in sockets) {
    socket != id && sockets[socket].emit('pieceMoved', data);
  }
}