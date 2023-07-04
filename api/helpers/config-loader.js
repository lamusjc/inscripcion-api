'use strict';

var config = require('../config/config');

module.exports = function() {
  process.env.PORT = process.env.PORT || config.port || 10010;
//   process.env.FORCE_LOCALE = process.env.FORCE_LOCALE || 'en';
//   process.env.SSL_PRIVATE_KEY = process.env.SSL_PRIVATE_KEY ||
//     (config.ssl ? config.ssl.privatekey || '' : '') || '';
//   process.env.SSL_CERTIFICATE = process.env.SSL_CERTIFICATE ||
//     (config.ssl ? config.ssl.certificate || '' : '') || '';
  process.env.JWT_SECRET = process.env.JWT_SECRET || config.jwtSecret;
  process.env.SESSION_SECRET = process.env.SESSION_SECRET || config.sessionSecret;
  process.env.DATABASE = process.env.DATABASE || config.database;
  process.env.REDIS_PORT = process.env.REDIS_PORT || config.redisPort || 6379;
  process.env.REDIS_HOST = process.env.REDIS_HOST || config.redisHost || 'localhost';
  process.env.REDIS_TTL = process.env.REDIS_TTL || config.redisTtl || 86400;
//   process.env.INVITACION_REGISTRO_TIEMPO_EXPIRACION_TOKEN =
//     process.env.INVITACION_REGISTRO_TIEMPO_EXPIRACION_TOKEN ||
//     (config.registro && config.registro.invitacion ?
//       config.registro.invitacion.tiempoExpiracion || 1 : 1) || 1;
  // Is in Mock mode?
  process.env.MOCKENABLED = process.env.MOCKENABLED ||
    (config.mock ? config.mock.enabled || false : false);
  process.env.MOCKMODE = process.env.MOCKMODE ||
    (config.mock ? config.mock.mode || 'stub' : 'stub');
  // Mock server
  process.env.MOCKSERVER = process.env.MOCKSERVER ||
    (config.mock ? config.mock.host || 'http://127.0.0.1:8020' : 'http://127.0.0.1:8020');
};
