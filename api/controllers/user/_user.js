"use strict";

var express = require("express");
var router = express.Router();

router.post("/authenticate", require("./authenticate"));
router.post("/register", require("./register"));

module.exports = router;
