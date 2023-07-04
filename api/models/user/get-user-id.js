const sql = require("../../db/sql").user;
const db = require("../../db").db;
const userError = require("../../helpers/error").user;

const getUserId = function getUserId(values, fn) {
  db.one(sql.getUserId, values)
    .then(function (data) {
      var response = {
        user: data.users_id,
        email: data.users_email,
        role: data.role_name,
        role_id: data.role_id,
        status: data.users_status,
        fullname: data.users_name + ' ' + data.users_lastname,
        cedula: data.usuario_cedula
      };
      fn(null, response);
    })
    .catch(function (ex) {
      var error = userError.U9999;
      var response = {
        code: error.code,
        message: error.message,
        // ex: ex
      };
      fn(response);
    });
};

module.exports = getUserId;
