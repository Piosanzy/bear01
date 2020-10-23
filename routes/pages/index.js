var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index');
});

router.get('/boardPage', async function(req, res, next) {
  res.render('pages/boardPage');
});
module.exports = router;
