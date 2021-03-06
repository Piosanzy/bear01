var express = require('express');
var router = express.Router();

const apiControllers = require('../../Controllers/ApiController/mainApi');

router.get('/boardPage', async function(req, res, next) {
  const apiCall = await apiControllers.apiCall('서울');
  res.json(apiCall)
});

module.exports = router;
