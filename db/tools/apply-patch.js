#!/usr/bin/env node

'use strict';

var config = require('./config');
var patchList = require([config.patchListDir, 'patch-list'].join('')).patches;
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var pgp = require('pg-promise')({});
var db = pgp(config.database);
var tableSchema = 'public'; // Esquema donde se encuentra la tabla tableName
var tableName = 'db_version'; // Nombre de la tabla con la informacion de los parches
var currPatch = ''; // Mantiene el parche que esta siendo procesado
var iCurrPatch = 0; // Mantiene el indice del parche que esta siendo procesado

/**
 * Aplica el parche
 * @param  {function}  cb Callback
 * @return {void} void
 */
var applyPatch = function(cb) {
  var patch = currPatch;
  var patchListDir = config.patchListDir;
  var patchFile = [patchListDir, patch.patch].join('');
  var sql = '';

  // Existe el directorio y se tiene acceso?
  try {
    fs.accessSync(patchListDir, fs.F_OK);
  } catch (e) {
    console.error('No se tiene acceso al directorio %s', patchListDir);
    cb(e, null);
    return;
  }

  // Existe el parche?
  try {
    fs.accessSync(patchFile, fs.F_OK);
  } catch (e) {
    console.error('No existe el parche %s', patchFile);
    cb(e, null);
    return;
  }

  // Obtener el contenido del parche
  try {
    sql = fs.readFileSync(patchFile, 'utf8');
  } catch (e) {
    console.error('No se pudo leer el contenido del %s', patch.patch);
    cb(e, null);
    return;
  }

  db.tx(function(t) {
    var q1 = this.any(sql);
    var q2 = this.any(['insert into $(schema:raw).$(table:raw) (parche, aplicado, fecha, nversion) ',
      'values ($(patch), 1, now(), null)'].join(''),
      {
        schema: tableSchema,
        table: tableName,
        patch: patch.patch
      });
    return this.batch([q1, q2]);
  })
    .then(function(data) {
      // Aplicado, se continua con el siguiente parche
      console.log('Aplicado!');
      cb(null, true);
    })
    .catch(function(error) {
      // Error
      cb(error, null);
    });
};

/**
 * Valida si los scripts han sido aplicados en la base de datos.
 * El parche "patch" se aplicara si y solo si los parches aca listados han sido aplicados.
 * Si alguno de los parches no ha sido aplicado entonces NO se detiene el proceso y se continua con el siguiente parche.
 *
 * @param  {function} cb Callback
 */
var validateDependenciesSoft = function(cb) {
  var patch = currPatch;
  var patchName = [];
  // console.log('FN validateDependenciesSoft %s', patch.patch);

  if (patch.dependenciesSoft) {
    _.map(patch.dependenciesSoft, function(val) {
      var _patch = _.trim(val);
      if (_patch !== '') {
        patchName.push(["'", _patch, "'"].join(''));
      }
    });
    db.any('select parche from $(schema:raw).$(table:raw) where parche in ( $(patch:raw) ) and aplicado = 1',
      {
        schema: tableSchema,
        table: tableName,
        patch: patchName.join(' ,')
      })
      .then(function(data) {
        var items = [];
        var arrDiff = [];
        if (data.length > 0) {
          // Se tiene la lista de los parches aplicados
          // Si falta alguno de la lista de dependencia entonces se NO detiene la aplicacion de parches
          _.map(data, function(item) {
            items.push(item.parche);
          });
          arrDiff = _.difference(patch.dependenciesSoft, items);
          if (arrDiff.length > 0) {
            console.log('El parche no sera aplicado. Los siguientes "DependenciesSoft" no han sido aplicados: %s',
              arrDiff.join(', '));
            cb(null, true);
          } else {
            applyPatch(cb);
          }
        } else {
          // No aparece ningun parche como aplicado, NO se detiene la aplicacion de parches
          console.log('El parche no sera aplicado. Los siguientes "DependenciesSoft" no han sido aplicados: %s',
            patch.dependenciesSoft.join(', '));
          cb(null, true);
        }
      })
      .catch(function(error) {
        // Error
        cb(error, null);
      });
  } else {
    // No hay dependencias para el parche, se aplica el parche
    applyPatch(cb);
  }
};

/**
 * Valida si los scripts han sido aplicados en la base de datos.
 * El parche "patch" se aplicara si y solo si los parches aca listados NO han sido aplicados.
 * Si alguno de los parches ha sido aplicado entonces NO se detiene el proceso y se continua con el siguiente parche.
 *
 * @param  {function} cb Callback
 */
var validateDependents = function(cb) {
  var patch = currPatch;
  var patchName = [];
  // console.log('FN validateDependents %s', patch.patch);

  if (patch.dependents) {
    _.map(patch.dependents, function(val) {
      var _patch = _.trim(val);
      if (_patch !== '') {
        patchName.push(["'", _patch, "'"].join(''));
      }
    });
    db.any('select parche from $(schema:raw).$(table:raw) where parche in ( $(patch:raw) ) and aplicado = 1',
      {
        schema: tableSchema,
        table: tableName,
        patch: patchName.join(' ,')
      })
      .then(function(data) {
        var items = [];
        if (data.length > 0) {
          // Hay parches que han sido aplicados, se detiene la aplicacion de parches
          _.map(data, function(item) {
            items.push(item.parche);
          });
          console.log('El parche no sera aplicado. Los siguientes "Dependents" han sido aplicados: %s',
            items.join(', '));
          cb(null, true);
        } else {
          // No hay dependencias sin aplicar, se valida las siguientes dependencias
          validateDependenciesSoft(cb);
        }
      })
      .catch(function(error) {
        // Error
        cb(error, null);
      });
  } else {
    // No hay dependencias para el parche, se validan las siguientes dependencias
    validateDependenciesSoft(cb);
  }
};

/**
 * Valida si los scripts han sido aplicados en la base de datos.
 * El parche "patch" se aplicara si y solo si los parches aca listados han sido aplicados.
 * Si alguno de los parches no ha sido aplicado entonces se detiene el proceso.
 *
 * @param  {function} cb Callback
 */
var validateDependencies = function(cb) {
  var patch = currPatch;
  var patchName = [];
  // console.log('FN validateDependencies %s', patch.patch);

  if (patch.dependencies) {
    _.map(patch.dependencies, function(val) {
      var _patch = _.trim(val);
      if (_patch !== '') {
        patchName.push(["'", _patch, "'"].join(''));
      }
    });
    db.any('select parche from $(schema:raw).$(table:raw) where parche in ( $(patch:raw) ) and aplicado = 1',
      {
        schema: tableSchema,
        table: tableName,
        patch: patchName.join(' ,')
      })
      .then(function(data) {
        var items = [];
        var arrDiff = [];
        if (data.length > 0) {
          // Se tiene la lista de los parches aplicados
          // Si falta alguno de la lista de dependencia entonces se detiene la aplicacion de parches
          _.map(data, function(item) {
            items.push(item.parche);
          });
          arrDiff = _.difference(patch.dependencies, items);
          if (arrDiff.length > 0) {
            console.log('El parche no sera aplicado. Los siguientes "Dependencies" no han sido aplicados: %s',
              arrDiff.join(', '));
            console.log('Se detendra la aplicacion de parches!');
            cb(null, false);
          } else {
            validateDependents(cb);
          }
        } else {
          // No aparece ningun parche como aplicado, se detiene la aplicacion de parches
          console.log('El parche no sera aplicado. Los siguientes "Dependencies" no han sido aplicados: %s',
            patch.dependencies.join(', '));
          console.log('Se detendra la aplicacion de parches!');
          cb(null, false);
        }
      })
      .catch(function(error) {
        // Error
        cb(error, null);
      });
  } else {
    // No hay dependencias para el parche, se validan las siguientes dependencias
    validateDependents(cb);
  }
};

/**
 * Valida si un parche se encuentra aplicado o no
 *
 * @param {function} cb Callback
 */
var isApplied = function(cb) {
  var patch = currPatch;
  // console.log('Fn: %s, Patch: %j', 'isApplied', patch.patch);
  db.any('select 1 as cnt from $(schema:raw).$(table:raw) where parche = $(patch) and aplicado = 1',
    {
      schema: tableSchema,
      table: tableName,
      patch: patch.patch
    })
      .then(function(data) {
        if (data.length > 0) {
          // El parche ya esta aplicado, se pasa el siguiente
          console.log('%s se encuentra aplicado.', patch.patch);
          cb(null, true);
        } else {
          // El parche no ha sido aplicado, se valida las dependencias
          validateDependencies(cb);
        }
      })
      .catch(function(error) {
        cb(error, null);
      });
};

var crearDbVersion = function(cb) {
  db.any(["select 1 as cnt from information_schema.tables ",
    " where upper(trim(table_schema)) = upper($(schema)) and upper(trim(table_name)) = upper($(table))"].join(''),
    {
      schema: tableSchema,
      table: tableName
    })
    .then(function(data) {
      if (data.length < 1) {
        // Crear la tabla
        console.log('crear tabla %s.%s ...', tableSchema, tableName);
        db.any(["create table $(schema:raw).$(table:raw) (",
          "parche varchar(255) not null,",
          "aplicado int not null,",
          "fecha timestamp not null default now(),",
          "nversion varchar(50) null,",
          "constraint pk_$(table:raw) primary key (parche)",
        ");"].join(' '),
          {
            schema: tableSchema,
            table: tableName
          })
            .then(function(data) {
              isApplied(cb);
            })
            .catch(function(error) {
              cb(error, null);
            });
      } else {
        // Continuar con la aplicacion de parches
        isApplied(cb);
      }
    })
    .catch(function(error) {
      cb(error, null);
    });
};

async.mapSeries(patchList, function(data, cb) {
  iCurrPatch++;
  currPatch = data;
  console.log('- parche #%d: %s ...', iCurrPatch, currPatch.patch);
  // Por cada parche se va validando si fue aplicado o no, se chequean las dependencias, y por ultimo se aplica
  async.waterfall([crearDbVersion],
    function(err, results) {
      // console.log('waterfall Error %j', err);
      // console.log('waterfall results %j', results);
      if (!err) {
        if (results) {
          // se continua con la aplicacion del proximo parche
          cb(null, 'Aplicado ...');
        } else {
          // Se detiene la aplicacion de los parches
          cb('No Aplicado', null);
        }
      }else{
        console.log(err);
      }
    }
  );
}, function(err, results) {
  // console.log('mapSeries Error %j', err);
  // console.log('mapSeries results %j', results);
  if (err) {
    process.exit(1);
  }
  process.exit(0);
});
