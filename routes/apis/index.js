var express = require('express');
var router = express.Router();

const apiControllers = require('../../Controllers/ApiController/mainApi');
const classControllers = require('../../Controllers/ClassController/mainClass');

router.get('/boardPage', async function(req, res, next) {
  const apiCall = await apiControllers.apiCall('경기');
  res.json(apiCall)
});

module.exports = router;
