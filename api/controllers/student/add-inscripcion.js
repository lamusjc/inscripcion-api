"use strict";

const studentError = require("../../helpers/error").student;
const Student = require("../../models/student");
const Validator = require("fastest-validator");
const { student } = require("../../helpers/error");
const _validator = new Validator();

module.exports = function (req, res) {
  var response = {};
  // var user = req.session.user;

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

  const schema = {
    cupos: {
      type: "array",
      items: {
        type: "object",
        props: {
          cupos_id: {
            type: "string",
            unique: "true",
            pattern: new RegExp(
              "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
            ),
            optional: false,
          },
          // hospital_id: {
          //   type: "string",
          //   pattern: new RegExp(
          //     "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          //   ),
          // },
          // materias_id: {
          //   type: "string",
          //   unique: "true",
          //   pattern: new RegExp(
          //     "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          //   ),
          //   optional: false,
          // },
          // seccion_id: {
          //   type: "string",
          //   pattern: new RegExp(
          //     "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          //   ),
          // },
          // seccion_materias_id: {
          //   type: "string",
          //   pattern: new RegExp(
          //     "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
          //   ),
          // },
        },
      },
    },
  };

  let check = _validator.compile(schema);
  if (
    check({
      cupos: req.body,
    }) !== true
  ) {
    response = {
      data: check({
        cupos: req.body,
      }),

      status: "ERROR",
      statusCode: 400,
    };

    res.status(response.statusCode);
    return res.json(response);
  } else {
    // Verificando que no inscriba el mismo cupo del mismo ID
    for (const [index, i] of req.body.entries()) {
      // Guardo en otro arreglo donde el primer indice que se compara no sea igual al indice comparado
      var auxData = req.body.filter((value2, index2) => index !== index2);

      // Se valida que el indice que se compara sea igual al length del arreglo filtrado - 1 debido a que el arreglo no queda el mismo length, para evitar errores
      if (index === auxData.length - 1) {
        if (i.cupos_id === auxData[index].cupos_id) {
          response = {
            data: {
              code: studentError.ST0005.code,
              message: studentError.ST0005.message,
            },
            status: "ERROR",
            statusCode: 409,
          };

          res.status(response.statusCode);
          return res.json(response);
        }
      }
    }

    Student.addInscripcion(
      {
        user: req.session.user,
        cupos: req.body,
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
            case studentError.ST0001.code:
            case studentError.ST0007.code:
              response = {
                data: err,
                status: "ERROR",
                statusCode: 404,
              };
              break;

            case studentError.ST0002.code:
            case studentError.ST0003.code:
            case studentError.ST0004.code:
            case studentError.ST0005.code:
            case studentError.ST0006.code:
              response = {
                data: err,
                status: "ERROR",
                statusCode: 409,
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
