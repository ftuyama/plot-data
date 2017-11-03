var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS data (info real)");
});

/* Add new data */
router.get('/', function(req, res) {
  console.log(req.query.data);
  data = JSON.parse(req.query.value);
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO data VALUES (?)");
    data.forEach(function(value, i, arr) {
      stmt.run(value);
    });
    stmt.finalize();
  });
  res.send('ok');
});

/* Get old data */
router.get('/get', function(req, res) {
  data = [];
  db.serialize(function() {
    db.each("SELECT rowid AS id, info FROM data", function(err, row) {
      console.log(row.id + ": " + row.info);
      data.push(row.info);
    }, function() {
      res.send(data);
    });
  });
});

module.exports = router;
