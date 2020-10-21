var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Test' });
});
router.get('/boardPage', function(req, res, next) {
  res.render('pages/boardPage', { title: 'Test' });
});
module.exports = router;
