const sql = require("../../db/sql").student;
const db = require("../../db").db;
const studentError = require("../../helpers/error").student;

const getCupos = function getCupos(values, fn) {
  db.any(sql.getCupos, values)
    .then(function (data) {
      var auxData = [];
      data.forEach((element) => {
        auxData.push({
          cupos_id: element.cupos_id,
          hospital_id: element.hospital_id,
          hospital_nombre: element.hospital_nombre,
          seccion_materias_id: element.seccion_materias_id,
          materias_id: element.materias_id,
          materias_nombre: element.materias_nombre,
          seccion_id: element.seccion_id,
          seccion_nombre: element.seccion_nombre,
          cupos_cantidad: element.cupos_cantidad,
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

module.exports = getCupos;
