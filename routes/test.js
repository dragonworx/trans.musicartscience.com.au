var express = require('express');
var router = express.Router();

/* GET test listing. */
router.get('/', function(req, res, next) {
  res.send('{"a":2}');
});

module.exports = router;
