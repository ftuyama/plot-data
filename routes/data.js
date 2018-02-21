var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS data (v1 REAL, v2 REAL, v3 REAL, v4 REAL, time DATETIME, t DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

/* Add new data */
router.post('/', function(req, res) {
  //console.log(req.body);
  data = req.body.rows;
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO data (v1, v2, v3, v4, time) VALUES (?, ?, ?, ?, ?)");
    data.forEach(function(row, i, arr) {
      stmt.run([row.v1, row.v2, row.v3, row.v4, row.time]);
    });
    stmt.finalize();
  });
  res.send('ok');
});

/* Get old data */
router.get('/', function(req, res) {
  data = [];
  db.serialize(function() {
    db.each("SELECT * FROM data ORDER BY t DESC LIMIT 50", function(err, row) {
      //console.log(row);
      data.push({
        'time': row.time,
        'v1': row.v1,
        'v2': row.v2,
        'v3': row.v3,
        'v4': row.v4,
      });
    }, function() {
      res.send(data);
    });
  });
});

router.get('/reset', function(req, res) {
  db.run("DROP TABLE data");
  db.run("CREATE TABLE IF NOT EXISTS data (v1 REAL, v2 REAL, v3 REAL, v4 REAL, time DATETIME, t DATETIME DEFAULT CURRENT_TIMESTAMP)");
  res.send('ok');
});

module.exports = router;
