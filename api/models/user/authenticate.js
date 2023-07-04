const sql = require("../../db/sql").user;
const db = require("../../db").db;
const userError = require("../../helpers/error").user;

const authenticate = function authenticate(values, fn) {
  db.one(sql.authenticate, values)
    .then(function (data) {
      if (data.error === "") {
        var response = {
          user: data.user,
          email: data.email,
          password: data.password,
          role: data.role,
        };
        fn(null, response);
      } else {
        var error = userError[data.error];
        var response = {
          code: error.code,
          message: error.message,
        };
        fn(response);
      }
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

module.exports = authenticate;
