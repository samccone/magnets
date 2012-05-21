var express = require('express');

var webServer = express.createServer();
var socket    = require('socket.io').listen(webServer);

webServer.set("view engine", "jade");
webServer.use(express.static(__dirname + '/public'));
webServer.get('/', function(req, res){
  res.render('index');
});

webServer.listen(3000);

var sockets = {};
socket.sockets.on('connection', function(socket){
  sockets[socket.id] = socket;
  var _id = socket.id;
  sockets[_id] = socket;
  socket.on('update',function(data){
    sendAll(_id, data);
  });
});


function sendAll(id, data){
  // for( socket in sockets) {

  // }
  console.log(id);
  console.log(data);
}