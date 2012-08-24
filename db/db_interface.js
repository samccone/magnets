var mongoose  = require('mongoose');
var db;
var wordSchema    = mongoose.Schema({
  word: String,
  position: mongoose.Schema.Types.Mixed
});

function connect(db_string, cb) {
  connection = 'mongodb://nodejitsu:dd25f3486d233357f32cee7a6861ad60@alex.mongohq.com:10019/nodejitsudb739436832732';
  db = mongoose.createConnection(connection);
  db.on('open', function() {
    console.log("DB connectied to "+connection);
    buildSchemas(cb, db);
  });
  db.on('error', function(e) {
    console.log('error connecting to DB '+ e);
  });
}

function buildSchemas(cb, db) {
  cb({
    Word: db.model('Word', wordSchema)
  })
}

exports.connect = connect