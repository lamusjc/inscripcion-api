"use strict";

var User = require("../../models/user");
var sessionError = require("../../helpers/error").session;
var jwt = require("jsonwebtoken");

module.exports = function (req, res) {
  var response = {};
  var token = req.headers.authorization;

  if (!token) {
    response = {
      statusCode: 403,
      status: "fail",
      message: sessionError.S0001.message,
      code: sessionError.S0001.code,
      errors: [],
    };
    res.status(response.statusCode);
    return res.json(response);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        response = {
          data: {
            message: sessionError.S0001.message,
            code: sessionError.S0001.code,
          },
          status: "ERROR",
          statusCode: 403,
        };
        res.status(response.statusCode);
        return res.json(response);
      }
      if (req.session.token !== token) {
        response = {
          data: {
            message: sessionError.S0001.message,
            code: sessionError.S0001.code,
          },
          status: "ERROR",
          statusCode: 403,
        };
        res.status(response.statusCode);
        return res.json(response);
      } else {
        User.getUserId({ users_id: decoded.user }, function (err, data) {
          var response = {};
          if (err) {
            response = {
              data: err,
              status: "ERROR",
              statusCode: 500,
            };
            return res.status(response.statusCode).json(response).end();
          }

          if (data) {
            response = {
              data: {
                user: data.user,
                email: data.email,
                role: data.role,
                status: data.status,
                fullname: data.fullname,
                cedula: data.cedula
              },
              status: "OK",
              statusCode: 200,
            };
            res.status(response.statusCode);
            return res.json(response);
          }
        });
      }
    });
  }
};
