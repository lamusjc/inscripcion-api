const sql = require("../../db/sql").student;
const db = require("../../db").db;
const studentError = require("../../helpers/error").student;

const getMaterias = function getMaterias(values, fn) {
  db.any(sql.getMaterias, values)
    .then(function (data) {
      var auxData = [];
      data.forEach((element) => {
        auxData.push({
          seccion_materias_id: element.seccion_materias_id,
          materias_id: element.materias_id,
          materias_nombre: element.materias_nombre,
          seccion_id: element.seccion_id,
          seccion_nombre: element.seccion_nombre,
        });
      });

      fn(null, auxData);
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

module.exports = getMaterias;
