"use strict";

const express = require("express");
var router = express.Router();

//Endpoints que no requieren autenticacion
router.use("/user", require("./user/_user"));
router.use("/sessions", require("./sessions/_sessions"));

//Endpoints que requieren autenticacion
router.use(
  "/student",
  require("../middlewares/token/authToken"),
  require("../middlewares/roles/student"),
  require("./student/_student")
);

module.exports = router;
