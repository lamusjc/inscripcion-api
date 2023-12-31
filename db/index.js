'use strict';

// Cargar nuestro archivo de configuracion
var config = require('./config');

// Bluebird is the best promise library available today,
// and is the one recommended here:
var promise = require('bluebird');
/*
// Loading all the database repositories separately,
// because event 'extend' is called multiple times:
var repos = {
  usuarios: require('./repos/usuarios'),
  representantes: require('./repos/representantes')
};

// pg-promise initialization options:
var options = {
  // Use a custom promise library, instead of the default ES6 Promise:
  promiseLib: promise,

  // Extending the database protocol with our custom repositories:
  extend: function(obj) {
    // Do not use 'require()' here, because this event occurs for every task
    // and transaction being executed, which should be as fast as possible.
    obj.usuarios = repos.usuarios(obj);
    obj.representantes = repos.representantes(obj);
  }
};
*/

// pg-promise initialization options:
var options = {
  // Use a custom promise library, instead of the default ES6 Promise:
  promiseLib: promise
};

// Load and initialize pg-promise:
var pgp = require('pg-promise')(options);

// Create the database instance:
var db = pgp(config.database);

// Load and initialize all the diagnostics:
var diag = require('./diagnostics');
diag.init(options);

// If you ever need to change the default pool size, here's an example:
// pgp.pg.defaults.poolSize = 20;

module.exports = {
  // Library instance is often necessary to access all the useful
  // types and namespaces available within the library's root:
  pgp,
  // Database instance. Only one instance per database is needed
  // within any application.
  db
};
