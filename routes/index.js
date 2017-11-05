var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/garden', function(req, res) {
  res.render('garden', { title: 'Express' });
});

/* GET home page. */
router.get('/elements', function(req, res) {
  res.render('elements', { title: 'Express' });
});

module.exports = router;
