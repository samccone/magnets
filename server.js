var port      = process.env.PORT || 9999;
var dbString  = process.env.NODE_ENV == "production" ? process.env.DB : null
var express   = require('express');
var words     = require('./words')
var socket    = require('./sockets/sockets');
var webServer = express.createServer();
var models;

var DB        = require('./db/db_interface.js').connect(dbString, function(_models){
  models = _models;
  setUpServer();
});


function setUpServer() {
  webServer.set("view engine", "jade");
  webServer.use(express.static(__dirname + '/public'));
  webServer.get('/', function(req, res){
    res.render('index', { locals : { 'words' : words.words() } });
  });

  webServer.listen(port);
  socket.init(webServer, words, models);
  socket.loadWords();
  console.log("-- server started on "+ port);
}