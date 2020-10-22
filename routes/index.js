var express = require('express');
var router = express.Router();

const Controllers = require('../Controllers/ApiController/mainApi');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const apiCall = await Controllers.apiCall();
  console.log('apiCall',apiCall)
  res.render('index', apiCall);
});
router.get('/boardPage', async function(req, res, next) {
  const apiCall = await Controllers.apiCall('서울');
  res.render('pages/boardPage', apiCall);
});
module.exports = router;
