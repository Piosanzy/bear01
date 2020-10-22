var express = require('express');
var router = express.Router();

const apiControllers = require('../Controllers/ApiController/mainApi');
const classControllers = require('../Controllers/ClassController/mainClass');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const apiCall = await apiControllers.apiCall();
  console.log('apiCall',apiCall)
  res.render('index', apiCall);
});
router.get('/boardPage', async function(req, res, next) {
  const apiCall = await apiControllers.apiCall('서울');
  const classCall = await classControllers.setClassNameCall();
  res.render('pages/boardPage', {
    apiCall:apiCall,
    classCall:classCall,
  });
});
module.exports = router;
