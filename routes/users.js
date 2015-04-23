var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// GET info about a defined user
router.get('/:net_id', function(req, res, next) {
  res.send(200);
  // TODO - for anyone
});


// POST updates to a defined user
router.post('/:net_id', function(req, res, next) {
  res.send(200);
  // TODO - teachers and TAs can get info about any one
  // TODO - students can get only their own and only a subset for others
});

module.exports = router;
