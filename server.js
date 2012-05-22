var express   = require('express');
var webServer = express.createServer();
var socket    = require('socket.io').listen(webServer);

webServer.set("view engine", "jade");
webServer.use(express.static(__dirname + '/public'));
webServer.get('/', function(req, res){
  res.render('index');
});

webServer.listen(9999);

var sockets = {};
socket.sockets.on('connection', function(socket){
  console.log("new connection");
  sockets[socket.id] = socket;
  var _id = socket.id;
  sockets[_id] = socket;
  socket.on('update',function(data){
    sendAll(_id, data);
  });
});


function sendAll(id, data){
  for( socket in sockets) {
    socket != id && sockets[socket].emit('pieceMoved', data);
  }
}