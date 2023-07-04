"use strict";

const Student = require("../../models/student");
const QueryFilterSort = require("../../helpers/query-filter-sort");

module.exports = function (req, res) {
  var response = {};
  var user = req.session.user;
  var dataSchema = {};
  var queryFilterSort;
  var qLimit = req.query.limit || 10000000000;
  var qOffset = req.query.offset || 0;

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

  // Metadata para efectuar el filter y sort
  dataSchema = {
    seccion_nombre: { type: "string", src: "t_seccion_nombre" }
  };

  queryFilterSort = new QueryFilterSort(req.query, dataSchema);
  // qOffset = queryFilterSort.getOffset();
  // qLimit = queryFilterSort.getLimit();

  Student.getMaterias(
    {
      users_id: user,
      offset: qOffset,
      limit: qLimit,
      from: queryFilterSort.getFrom(),
      to: queryFilterSort.getTo(),
      sort: queryFilterSort.getSort(),
      filter: queryFilterSort.getFilter(),
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
