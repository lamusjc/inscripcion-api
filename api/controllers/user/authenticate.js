"use strict";

var redis = require("redis");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var registerError = require("../../helpers/error").user;
var User = require("../../models/user");
var sessionError = require("../../helpers/error").session;
let Validator = require("fastest-validator");
let _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  var token;
  var client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });
  const schema = {
    email: {
      type: "string",
      pattern: new RegExp(
        "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$"
      ),
      optional: false,
      max: 100,
    },
    password: { type: "string", min: 6, max: 60, optional: false },
  };

  let check = _validator.compile(schema);

  if (
    check({
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    }) !== true
  ) {
    response = {
      data: check({
        email: req.body.email.toLowerCase(),
        password: req.body.password,
      }),
      status: "ERROR",
      statusCode: 400,
    };
    res.status(response.statusCode);
    return res.json(response);
  } else {
    //Autenticacion
    User.authenticate(
      {
        usuario_correo: req.body.email.toLowerCase().trim(),
      },
      function (err, data) {
        if (err) {
          switch (err.code) {
            case registerError.U0001.code:
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
        if (data) {
          if (!bcrypt.compareSync(req.body.password, data.password)) {
            response = {
              data: {
                message: registerError.U0001.message,
                code: registerError.U0001.code,
              },
              status: "ERROR",
              statusCode: 404,
            };
            res.status(response.statusCode);
            return res.json(response);
          }

          if (
            req.session &&
            req.session.token &&
            req.session.user === data.user
          ) {
            token = req.session.token;

            client.set(data.user, token, function (err, reply) {
              if (!err) {
                client.set(token, "Ok", function (err, reply) {});
              }
            });
          } else {
            token = jwt.sign(
              {
                user: data.user,
                email: data.email,
              },
              process.env.JWT_SECRET,
              {
                algorithm: "HS256",
                expiresIn: "365 days",
                issuer: "mDigital",
                audience: data.user,
                jwtid: data.user,
              }
            );

            client.set(data.user, token);
            client.set(token, "Ok");

            try {
              req.session.user = data.user;
              req.session.email = data.email;
              req.session.token = token;
              req.session.role = data.role;
              req.session.save();
            } catch (ex) {
              response = {
                data: {
                  message: sessionError.S9999.message,
                  code: sessionError.S9999.code,
                },
                status: "ERROR",
                statusCode: 500,
              };
            }
            if (response.statusCode >= 400) {
              res.status(response.statusCode);
              return res.json(response);
            }
          }

          response = {
            data: {
              token: token,
              firstname: data.firstname,
              lastname: data.lastname,
              role: data.role,
            },
            statusCode: 200,
            status: "OK",
          };

          // res.setHeader("Authorization", response.data.token);
          res.status(response.statusCode);
          return res.json(response);
        }
      }
    );
  }
};
