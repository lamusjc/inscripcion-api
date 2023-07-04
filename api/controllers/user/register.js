"use strict";

const bcrypt = require("bcryptjs");
const userError = require("../../helpers/error").user;
const User = require("../../models/user");
const Validator = require("fastest-validator");
const _validator = new Validator();
const config = require("../../config/config");
const fs = require("fs");
const handlebars = require("handlebars");

module.exports = function (req, res) {
  var response = {};

  const schema = {
    nombre: { type: "string", max: 100, optional: false },
    apellido: { type: "string", max: 100, optional: false },
    cedula: { type: "string", max: 100, optional: false },
    correo: {
      type: "string",
      pattern: new RegExp(
        "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$"
      ),
      optional: false,
      max: 100,
    },
    telefono: { type: "string", max: 100, optional: false },
    clave: {
      type: "string",
      //   pattern: new RegExp(
      //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_-])(?=.{8,})"
      //   ),
      min: 6,
      max: 100,
      optional: false,
    },
  };

  let check = _validator.compile(schema);

  if (
    check({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      cedula: req.body.cedula,
      correo: req.body.correo.toLowerCase(),
      telefono: req.body.telefono,
      clave: req.body.clave,
    }) !== true
  ) {
    response = {
      data: check({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        cedula: req.body.cedula,
        correo: req.body.correo.toLowerCase(),
        telefono: req.body.telefono,
        clave: req.body.clave,
      }),
      status: "ERROR",
      statusCode: 400,
    };
    res.status(response.statusCode);
    return res.json(response);
  } else {
    //Register User
    User.register(
      {
        usuario_nombre: req.body.nombre.trim(),
        usuario_apellido: req.body.apellido.trim(),
        usuario_cedula: req.body.cedula.trim(),
        usuario_correo: req.body.correo.toLowerCase().trim(),
        usuario_telefono: req.body.telefono.trim(),
        usuario_clave: bcrypt.hashSync(req.body.clave, bcrypt.genSaltSync(10)),
      },
      function (err, data) {
        if (data) {
          response = {
            data: data,
            status: "OK",
            statusCode: 200,
          };

          res.status(response.statusCode);
          return res.json(response);
        } else if (err) {
          switch (err.code) {
            case userError.U0002.code:
              response = {
                data: err,
                status: "ERROR",
                statusCode: 409,
              };
              break;

            case userError.U0003.code:
              response = {
                data: err,
                status: "ERROR",
                statusCode: 404,
              };
              break;

            default:
              response = {
                data: err,
                status: "ERROR",
                statusCode: 500,
              };
              break;
          }
          res.status(response.statusCode);
          return res.json(response);
        }
      }
    );
  }
};
