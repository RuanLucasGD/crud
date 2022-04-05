var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('list');
});

router.get('/add', function(req, res, next) {
  res.render('add');
});

module.exports = router;
