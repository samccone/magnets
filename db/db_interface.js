var mongoose  = require('mongoose');
var db;
var wordSchema    = mongoose.Schema({
  word: String,
  position: mongoose.Schema.Types.Mixed
});

function connect(db_string, cb) {
  db_string = db_string || 'mongodb://localhost/words'
  db = mongoose.connect(db_string);
  buildSchemas(cb, db);
}

function buildSchemas(cb, db) {
  cb({
    Word: db.model('Word', wordSchema)
  })
}

exports.connect = connect