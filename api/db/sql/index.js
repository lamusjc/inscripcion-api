"use strict";

var QueryFile = require("pg-promise").QueryFile;
var path = require("path");

// Helper for linking to external query files;
function sql(file) {
  let qPath = path.join(__dirname, "/../sql/", file);

  let options = {
    minify: true,
    params: {
      schema: "public", // 'public' is the default schema
    },
  };

  return new QueryFile(qPath, options);
}

module.exports = {
  user: {
    authenticate: sql("./user/authenticate.sql"),
    getUserId: sql("./user/get-user-id.sql"),
    register: sql("./user/register.sql"),
  },

  student: {
    // Materias
    getMaterias: sql("./student/get-materias.sql"),

    // Cupos
    getCupos: sql("./student/get-cupos.sql"),

    // Inscripcion
    addInscripcion: sql("./student/add-inscripcion.sql"),
    getInscripcion: sql("./student/get-inscripcion.sql"),
  },
};
