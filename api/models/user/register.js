const sql = require('../../db/sql').user;
const db = require('../../db').db;
const userError = require('../../helpers/error').user;

const register = function register(values, fn){
  db.one(sql.register, values).then(function(data) {
    if(data.error === ''){
      var response = {
        usuario: data.usuario,
        rol: data.rol,
      };
      fn(null, response);
    }else {
      var error = userError[data.error];
      var response = {
        code: error.code,
        message: error.message
      };
      fn(response);
    }
  }).catch(function(ex) {
    var error = userError.U9999;
    var response = {
        code: error.code,
        message: error.message
        // ex: ex
      };
      fn(response);
  });
  
}

module.exports = register;