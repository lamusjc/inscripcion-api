const sql = require("../../db/sql").student;
const db = require("../../db").db;
const studentError = require("../../helpers/error").student;

const addInscripcion = function addInscripcion(values, fn) {
  db.one(sql.addInscripcion, values)
    .then(function (data) {
      if (data.error === "") {
        var response = {
          code: "",
          message: "success",
          cupos_id: "",
        };
        fn(null, response);
      } else {
        var error = studentError[data.error];
        var response = {
          code: error.code,
          message: error.message,
          cupos_id: data.cupos_id,
        };
        fn(response);
      }
    })
    .catch(function (ex) {
      var error = studentError.ST9999;
      var response = {
        code: error.code,
        message: error.message,
        // ex: ex
      };
      fn(response);
    });
};

module.exports = addInscripcion;
