const sql = require("../../db/sql").student;
const db = require("../../db").db;
const studentError = require("../../helpers/error").student;

const getInscripcion = function getInscripcion(values, fn) {
  db.any(sql.getInscripcion, values)
    .then(function (data) {
      var auxData = [];
      data.forEach((element) => {
        auxData.push({
          cupos_id: element.cupos_id,
          seccion_id: element.seccion_id,
          seccion_nombre: element.seccion_nombre,
          materias_id: element.materias_id,
          materias_nombre: element.materias_nombre,
          hospital_id: element.hospital_id,
          hospital_nombre: element.hospital_nombre,
          seccion_materias_id: element.seccion_materias_id,
          hospitales: [],
        });
      });
      // Esta funcion permite eliminar elementos duplicados como el id de la seccion
      var auxJson = {};
      var unicSeccion = auxData.filter(function (e) {
        return auxJson[e.seccion_id] ? false : (auxJson[e.seccion_id] = true);
      });
      // Esta funcion permite eliminar elementos duplicados como el id de la seccion

      unicSeccion.forEach((element, index) => {
        data.forEach((element2) => {
          if (element.seccion_id === element2.seccion_id) {
            unicSeccion[index].hospitales.push({
              hospital_id: element2.hospital_id,
              hospital_nombre: element2.hospital_nombre,
            });
          }
        });
      });

      fn(null, unicSeccion);
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

module.exports = getInscripcion;
