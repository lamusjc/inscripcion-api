"use strict";

const Student = require("../../models/student");
const QueryFilterSort = require("../../helpers/query-filter-sort");

module.exports = function (req, res) {
  var response = {};
  var user = req.session.user;

  // //Valida los datos de la sesion
  // if (req.session) {
  //     user = req.session.user;
  // }
  // if (!req.session || user === undefined) {
  //     response = {
  //         data: {message: sessionError.S9999.message, code: sessionError.S9999.code},
  //         status: "ERROR",
  //         statusCode: 500,

  //     };
  //     res.status(response.statusCode);
  //     return res.json(response);
  // }

  Student.getInscripcion(
    {
      users_id: user,
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
};
