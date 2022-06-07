var express = require('express');
var router = express.Router();

console.log("fsdfsfsdfds")

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });


  res.send("hello")
});

router.get('/add', function (req, res, next) {
  res.send("add");
});

module.exports = router;
