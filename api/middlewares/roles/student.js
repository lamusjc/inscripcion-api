'use strict';

var sessionError = require('../../helpers/error').session;

module.exports = function(req, res, next) {
  // Datos del user autenticado
  var user = '';
  var response = {};
  
  // Tomar los valores de la sesion
  if (req.session) {
    user = req.session.user;
  }
  if (!req.session || user === undefined) {
    // Ha ocurrido un error
    response = {
      data: {message: sessionError.S9999.message, code: sessionError.S9999.code},
      status: "ERROR",
      statusCode: 403
      
    };
    res.status(response.statusCode).json(response).end();
    return false;
  }

  if (req.session.role !== 'STUDENT') {
    response = {
      data: {message: sessionError.S0002.message, code: sessionError.S0002.code},
      status: "ERROR",
      statusCode: 409
      
    };
    res.status(response.statusCode).json(response).end();
    return false;
  }
  next();
};
