'use strict';

/**
 * Lista los scripts que deben aplicarse.
 * Cada nuevo script debe agregarse al final de la lista en el arreglo "patches".
 * Cada entrada debe tener el siguiente formato.
 * {
 *   patch: 'nombre-archivo-sql',
 *   dependencies: ['nombre-archivo-sql', ...],
 *   dependenciesSoft: ['nombre-archivo-sql', ...],
 *   dependents: ['nombre-archivo-sql', ...]
 * }
 * donde,
 * - patch: Nombre del archivo script sql que va a aplicarse.
 * - dependencies: OPCIONAL. Arreglo de archivos scripts sql. Utilizado para validaciones.
 *     El parche "patch" se aplicará si y solo si los parches aca listados han sido aplicados.
 *     Si alguno de los parches no ha sido aplicado entonces se detiene el proceso.
 * - dependenciesSoft: OPCIONAL. Arreglo de archivos scripts sql. Utilizado para validaciones.
 *     El parche "patch" se aplicará si y solo si los parches aca listados han sido aplicados.
 *     Si alguno de los parches no ha sido aplicado entonces NO se detiene el proceso y continua con el siguiente parche.
 * - dependents: OPCIONAL. Arreglo de archivos scripts sql. Utilizado para validaciones.
 *     El parche "patch" NO se aplicará si alguno de los parches aca listados ha sido aplicado.
 *     Si alguno de los parches ha sido aplicado entonces NO se detiene el proceso y continua con el siguiente parche.
 *
 */

//Uncomment to add patch files
module.exports.patches =  [
  {
    patch: 'patch_9b32669d9c3fdf8b7c702b7d9abfe5d5.sql'
  }
];
