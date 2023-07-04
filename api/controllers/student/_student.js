"use strict";

const express = require("express");
const router = express.Router();

// Materias
router.get("/materias", require("./get-materias"));

// Cupos
router.get("/cupos", require("./get-cupos"));

// Inscripcion
router.post("/inscripcion", require("./add-inscripcion"));
router.get("/inscripcion", require("./get-inscripcion"));

module.exports = router;
