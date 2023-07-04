'use strict';

/**
 * Module dependencies.
 * @private
 */

var redis = require("redis");
var Session = require('express-session');
var RedisStore = require('connect-redis')(Session);
var redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
var sessionError = require('../helpers/error').session;

/**
 * Expose the middleware.
 */
module.exports = session;

/**
 * Configura la sesion con las opciones dadas
 * @param {Object} [options] Opciones
 * @param {String} [options.sessionSecret] Secret para la sesion
 * @param {Boolean} [options.sessionSaveUninitialized] Save uninitialized sessions to the store
 * @param {Boolean} [options.sessionResave] Resave unmodified sessions back to the store
 * @param {String} [options.redisHost] Servicio Redis, Host
 * @param {Integer} [options.redisPort] Servicio Redis, Port
 * @param {Integer} [options.redisTtl] Servicio Redis, ttl
 * @return {Function} middleware
 */
function session(options) {
  var lOptions = options || {};
  var sessionSecret = lOptions.sessionSecret || 'shhhhSecret';
  var sessionSaveUninitialized = lOptions.sessionSaveUninitialized || false;
  var sessionResave = lOptions.sessionResave || false;
  var redisHost = lOptions.redisHost || 'localhost';
  var redisPort = lOptions.redisPort || 6379;
  var redisTtl = lOptions.redisTtl || 86400;

  // Inicializar la sesion, se tiene 3 intentos para recuperarse
  /* eslint-disable new-cap */
  var sessionMiddleware = Session({
  /* eslint-disable new-cap */
    cookie: {
      maxAge: 86400 * 1000
    },
    secret: sessionSecret,
    store: new RedisStore({host: redisHost, port: redisPort, client: redisClient, ttl: redisTtl}),
    saveUninitialized: sessionSaveUninitialized,
    resave: sessionResave
  });

  return function session(req, res, next) {
    var tries = 3;
    function lookupSession(error) {
      if (error) {
        return next(error);
      }
      tries -= 1;
      if (req.session !== undefined) {
        return next();
      }
      if (tries < 0) {
        // Ha ocurrido un error
        var response = {
            data: {message: sessionError.S9999.message, code: sessionError.S9999.code},
            status: "ERROR",
            statusCode: 500
        };
        res.status(response.statusCode);
        return res.json(response);
      }
      sessionMiddleware(req, res, lookupSession);
    }
    lookupSession();
  };
}
