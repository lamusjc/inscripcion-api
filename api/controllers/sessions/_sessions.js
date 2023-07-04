'use strict';

var express = require('express');
var router = express.Router();

router.get('/info', require('./info'));
router.get('/destroy', require('./destroy'));

module.exports = router;