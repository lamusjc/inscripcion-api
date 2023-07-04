/**
 * Filtrado y Orden
 *
 * Los parametros del query que estan disponibles para filtrar la data, aordenarla, y limitar la
 * cantidad de registros son los siguientes:
 *
 * query parameters:
 * ================
 * offset: Paginar la busqueda, inicio
 * limit: Cantidad de de registros a mostrar
 * from: Fecha desde la que busca. Aplica para el campo fecha principal de la entidad
 * to: Fecha final o fecha hasta. Aplica para el campo fecha principal de la entidad
 * sort: Ordenacion
 * filter: Filtrado adicional
 *
 * Los campos a utilizar para aplicar el filtrado o la ordenacion son los mismos que se esperan como
 * resultado de la operacion, especificamente en la propiedad "data".
 *
 * Ejemplo, en un listado con la siguiente estructura
 * data: [{
 *   id: "fc0bcc8e-376e-11e6-b95b-e353e62d27e6",
 *   pNombre: "Fulanito",
 *   pApellido: "Detal",
 *   nacimiento: {
 *     fecha: "1985-05-27",
 *  ciudad: "Caracas"
 *   }
 * }
 * ]
 *
 * Para usar el campo de la fecha de nacimiento se hace referencia por la propiedad, es decir,
 * "nacimiento.fecha", y para filtrar por el nombre se usa "pNombre".
 *
 * Para poder aplicar de forma correcta el filtrado y ordenacion, del lado del controlador, el
 * desarrollador debe especificar la metadata especifica segun la estructura del listado en el
 * response.
 * Para seguir con el ejemplo,
 * esquema = {
 *   id: {type: "uuid", src: "id"},
 *   pNombre: {type: "string", src: "nombre", sort: 1},
 *   pApellido: {type: "string", src: "apellido"},
 *   nacimiento: {
 *     fecha: {type: "date", src: "fechanac", fromto: true},
 *  ciudad: {type: "string", src: "ciudad_desc"}
 *   }
 * };
 *
 * En la metadata se especifica lo siguiente:
 * - type: string, number, integer, boolean, uuid, date y date-time
 * - src: Nombre del campo en el query sql
 * - fromto: Para el campo tipo fecha/fecha-hora principal usado para el filtrado "from" y "to".
 * - sort: Indica el campo principal por donde se ordena el registro. Su valor indica (1) ASC,
 * (0) DESC.
 *
 * Importante: a cada parametro del query debe aplicarse el "encode".
 *
 * Ordenacion:
 * ===========
 * query param: sort
 * separador de campo: |
 * se indica el nombre del campo o campos por los que se va a ordenar, seguido por el orden a aplicar
 * (1: ASC, 0: DESC)
 * Si se va a ordenar por varios campos se separan por "|"
 *
 * Ejemplo:
 * GET /persons?sort=campo1:1|campo2:0
 *
 * Filtrado:
 * =========
 * query param: filter
 * separador de campo: |
 * El filtrado tiene la forma <campo> <operador> <valor o valores> [| <campo> <operador>
 * <valor o valores> ... ]
 *
 * Los operadores se delimitan por el caracter ":", al comienzo y final del mismo.
 *
 * Operador eq:
 * ------------
 * :eq:, Igual. Equivale al operador ===
 * Ejemplo:
 * - Listar las personas que se llaman Jose
 * GET /persons?filter=nombre:eq:jose
 * se traduce a,
 * nombre = 'jose'
 *
 * Consideraciones:
 * - Para buscar campos vacios solo se deja el valor "vacio"
 * GET /persons?filter=nombre:eq:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!eq:, Distinto. Equivale al operador !==
 *
 * Operador gt:
 * ------------
 * :gt:, Mayor que. Equivale al operador >
 * Ejemplo:
 * - Listar las personas mayores a 18 años
 * GET /persons?filter=edad:gt:18
 * se traduce a,
 * edad > 18
 * - Listar las personas que nacieron despues de 18-Feb-1985
 * GET /persons?filter=fechanac:gt:1985-02-18
 * se traduce a,
 * fechanac > '1985-02-18'
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!gt:, No Mayor que. Equivale al operador :lte:
 *
 * Operador gte:
 * ------------
 * :gte:, Mayor o igual que. Equivale al operador >=
 * Ejemplo:
 * - Listar las personas con edad de 18 años en adelante
 * GET /persons?filter=edad:gte:18
 * se traduce a,
 * edad >= 18
 * - Listar las personas que nacieron a partor de 18-Feb-1985
 * GET /persons?filter=fechanac:gte:1985-02-18
 * se traduce a,
 * fechanac >= '1985-02-18'
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!gte:, No Mayor o igual que. Equivale al operador :lt:
 *
 *
 * Operador lt:
 * ------------
 * :lt:, Menor que. Equivale al operador <
 * Ejemplo:
 * - Listar las personas menores a 18 años
 * GET /persons?filter=edad:lt:18
 * se traduce a,
 * edad < 18
 * - Listar las personas que nacieron antes de 18-Feb-1985
 * GET /persons?filter=fechanac:lt:1985-02-18
 * se traduce a,
 * fechanac < '1985-02-18'
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!lt:, No Menor que. Equivale al operador :gte:
 *
 * Operador lte:
 * ------------
 * :lte:, Menor o igual que. Equivale al operador <=
 * Ejemplo:
 * - Listar las personas con edad maxima de 18 años
 * GET /persons?filter=edad:lte:18
 * se traduce a,
 * edad <= 18
 * - Listar las personas que nacieron hasta la fecha 18-Feb-1985
 * GET /persons?filter=fechanac:lte:1985-02-18
 * se traduce a,
 * fechanac <= '1985-02-18'
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!lte:, No Menor o igual que. Equivale al operador :gt:
 *
 * Operador like:
 * --------------
 * :like:, Contiene. Equivale al operador like '%valor%'
 * Utilizado sobre cadenas de caracteres
 * Ejemplo:
 * - Listar las personas cuyo nombre contenga "jose"
 * GET /persons?filter=nombre:like:jose
 * se traduce a,
 * nombre like '%jose%'
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!like:, No Contiene. Equivale al operador NOT like '%valor%'
 *
 * Operador rlike:
 * --------------
 * :rlike:, Comienza con. Equivale al operador like 'valor%'
 * Utilizado sobre cadenas de caracteres
 * Ejemplo:
 * - Listar las personas cuyo nombre comienze con "jos"
 * GET /persons?filter=nombre:rlike:jos
 * se traduce a,
 * nombre like 'jose%'
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!rlike:, No Contiene. Equivale al operador NOT like 'valor%'
 *
 * Operador llike:
 * --------------
 * :llike:, Termina en. Equivale al operador like '%valor'
 * Utilizado sobre cadenas de caracteres
 * Ejemplo:
 * - Listar las personas cuyo nombre termine en "jose"
 * GET /persons?filter=nombre:llike:jose
 * se traduce a,
 * nombre like '%jose'
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!llike:, No Contiene. Equivale al operador NOT like '%valor'
 *
 * Operador r:
 * -----------
 * :r:, Rango. Establece un rango de comparacion.
 * campo:r:DESDE:HASTA
 * Se puede indicar solo uno de los valores de busqueda.
 * Para omitir el valor DESDE, campo:r::HASTA
 * Para omitir el valor HASTA, campo:r:DESDE
 *
 * Ejemplo:
 * - Listar las peronas con edades entre 18 y 25 años
 * GET /persons?filter=edad:r:18:25
 * se traduce a,
 * edad >= 18 and edad <= 25
 * - Listar las personas nacidas entre 18-Feb-1985 y 01-Ene-2000
 * GET /persons?filter=fechanac:r:1985-02-18:2000-01-01
 * se traduce a,
 * fechanac >= '1985-02-18' and fechanac <= '2000-01-01'
 * - Listar los articulos con codigos desde A0001 y C1012
 * GET /items?filter=code:r:A0001:C1012
 * se traduce a,
 * code >= 'A0001' and code <= 'C1012'
 *
 * Operador in:
 * ------------
 * :in:, Para especificar que un valor este incluido en un conjunto de valores.
 * Los valores son una lista separadas por coma
 * campo:in:v1,v2,v3
 *
 * Ejemplo:
 * - Listar las personas que viven en los estados 'CA' y 'TE'
 * GET /persons?filter=state:in:CA,TE
 * se traduce a,
 * campo in ('CA', 'TE')
 *
 * Consideraciones:
 * - Para negar la condicion se usa "!" como parte del operador
 * :!in:, No esta contenido en. Equivale al operador NOT in (V1, V2)
 *
 * Ejemplo:
 * - Listar las personas que no viven en los estados 'CA' y 'TE'
 * GET /persons?filter=state:!in:CA,TE
 * se traduce a,
 * campo not in ('CA', 'TE')
 *
 *
 * Tipo de dato Date y DateTime:
 * =============================
 * Formatos de fecha validas que sirven para JS y base de datos: ISO 8601
 * (https://www.w3.org/TR/NOTE-datetime)
 * - YYYY-MM-DDThh:mm:ss.sTZD
 * - YYYY-MM-DDThh:mm:ss.s
 * - YYYY-MM-DDThh:mm:ss
 * - YYYY-MM-DDThh:mm
 * - YYYY-MM-DD
 * where:
 *      YYYY = four-digit year
 *      MM   = two-digit month (01=January, etc.)
 *      DD   = two-digit day of month (01 through 31)
 *      hh   = two digits of hour (00 through 23) (am/pm NOT allowed)
 *      mm   = two digits of minute (00 through 59)
 *      ss   = two digits of second (00 through 59)
 *      s    = one or more digits representing a decimal fraction of a second
 *      TZD  = time zone designator (Z or +hh:mm or -hh:mm)
 * Ejemplo:
 * - '2016-07-02T11:59:56.175-04:30'
 * - '2016-07-02T11:59:56.175Z'
 *
 *
 * Ejemplo de uso:
 * ===============
 *
 * -- archivo controller.js
 *
 * // Definicion de la metadata segun el response
 * var dataSchema = {
 *   id: {type: "uuid", src: "id"},
 *   pNombre: {type: "string", src: "nombre", sort: 1},
 *   pApellido: {type: "string", src: "apellido"},
 *   nacimiento: {
 *     fecha: {type: "date", src: "fechanac", fromto: true},
 *   ciudad: {type: "string", src: "ciudad_desc"}
 *   }
 * };
 *
 * // Inicializar la clase
 * var queryFilterSort = new QueryFilterSort(req.query, dataSchema);
 * // Obtener Offset
 * var qOffset = queryFilterSort.getOffset();
 * // Obtener Limit
 * var qLimit = queryFilterSort.getLimit();
 * // Obtener Sort
 * var sort = queryFilterSort.getSort();
 * // Para un sort or defecto que incluye varios campos
 * var sort = queryFilterSort.getSort('campo1 asc, campo 2 desc');
 * // Obtener la fecha From
 * var from = queryFilterSort.getFrom();
 * // Obtener la fecha To
 * var to: queryFilterSort.getTo();
 * // Obtener los filtros
 * var filter: queryFilterSort.getFilter()
 *
 * Personas.listar({
 *   offset: qOffset,
 *   limit: qLimit,
 *   from: from,
 *   to: to,
 *   sort: sort,
 *   filter: filter
 * })...
 *
 * -- archivo listar.sql
 * select id, nombre, apellido, fechanac, ciudad_desc
 * from persona
 * where 1 = 1
 * ${from:raw}
 * ${to:raw}
 * ${filter:raw}
 * order by ${sort:raw}
 * offset ${offset} limit ${limit}
 *
 */
'use strict';

var ono = require('ono');
var _ = require('lodash');
var util = require('util');
var filtersortError = require('./error').filtersort;

// Valores para generar el query param
var _queryParam = {
  offset: 0,
  limit: 0,
  from: '',
  to: '',
  q: '',
  sort: [],
  filter: []
};

// Supported data types
// var dataTypes = ['string', 'number', 'integer', 'boolean', 'uuid', 'date', 'date-time'];

// Valid patterns for each data type
/* eslint-disable quote-props */
var dataTypePatterns = {
  integer: /^[+-]?(\d+|0x[\dA-F]+)$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
  "date-time": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/i,
  "date-time2": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/i,
  "date-time3": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/i,
  "date-time4": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/i,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};
/* eslint-enable quote-props */

/*
// Operadores para los filter
var filterOpFlags = {
  eq: 1, // =
  neq: 2, // <>
  gt: 4, // >
  gte: 8, // >=
  lt: 16, // <
  lte: 32, // <=
  like: 64, // like %valor%
  nlike: 128, // not like %valor%
  rlike: 256, // like valor%
  nrlike: 512, // not like valor%
  llike: 1024, // like %valor
  nllike: 2048, // not like %valor
  r: 4096, // between valor1 and valor 2
  in: 8192, // in (valor1, valor2)
  nin: 16384 // not in (valor1, valor2)
};
*/

/*
// Operadores para los filter
var filterOpSql = {
  eq: '=', // =
  neq: '<>', // <>
  gt: '>', // >
  gte: '>=', // >=
  lt: '<', // <
  lte: '<=', // <=
  like: 'like', // like %valor%
  nlike: 'not like', // not like %valor%
  rlike: 'like', // like valor%
  nrlike: 'not like', // not like valor%
  llike: 'like', // like %valor
  nllike: 'not like', // not like %valor
  r: 'between', // between valor1 and valor 2
  in: 'in', // in (valor1, valor2)
  nin: 'nin' // not in (valor1, valor2)
};
*/

/*
// Mapa de operadores para los filter
var filterOperatorMap = {
  ':eq:': filterOpFlags.eq,
  ':!eq:': filterOpFlags.neq,
  ':gt:': filterOpFlags.gt,
  ':!gt:': filterOpFlags.lte,
  ':gte:': filterOpFlags.gte,
  ':!gte:': filterOpFlags.lt,
  ':lt:': filterOpFlags.lt,
  ':!lt:': filterOpFlags.gte,
  ':lte:': filterOpFlags.lte,
  ':!lte:': filterOpFlags.gt,
  ':like:': filterOpFlags.like,
  ':!like:': filterOpFlags.nlike,
  ':rlike:': filterOpFlags.rlike,
  ':!rlike:': filterOpFlags.nrlike,
  ':llike:': filterOpFlags.llike,
  ':!llike:': filterOpFlags.nllike,
  ':r:': filterOpFlags.r,
  ':in:': filterOpFlags.in,
  ':!in:': filterOpFlags.nin
};
*/

// Mapa de operadores para los filter
function filterSqlOperatorMap(op) {
  switch (op) {
    case ':eq:':
      return '=';
    case ':!eq:':
      return '<>';
    case ':gt:':
      return '>';
    case ':!gt:':
      return '<=';
    case ':gte:':
      return '>=';
    case ':!gte:':
      return '<';
    case ':lt:':
      return '<';
    case ':!lt:':
      return '>=';
    case ':lte:':
      return '<=';
    case ':!lte:':
      return '>';
    case ':like:': case ':rlike:': case ':llike:':
      return 'like';
    case ':!like:': case ':!rlike:': case ':!llike:':
      return 'not like';
    case ':r:':
      return 'between';
    case ':in:':
      return 'in';
    case ':!in:':
      return 'not in';
    default:
      throw ono({code: filtersortError.FS016.code, message: filtersortError.FS016.message},
        'Operador "%s" no soportado', op);
  }
}

// Some older versions of Node don't define these constants
// var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;
// var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
// var MAX_VALUE = Number.MAX_VALUE || 1.7976931348623157e+308;
// var MIN_VALUE = -MAX_VALUE;
// var EPSILON = Number.EPSILON || 2.220446049250313e-16;

/*
// Numeric type ranges
var ranges = {
  int32: {
    min: -2147483648,
    max: 2147483647
  },
  int64: {
    min: MIN_SAFE_INTEGER,
    max: MAX_SAFE_INTEGER
  },
  byte: {
    min: 0,
    max: 255
  },
  float: {
    min: -3.402823e38,
    max: 3.402823e38
  },
  double: {
    min: MIN_VALUE,
    max: MAX_VALUE
  }
};
*/

/*
// Para getFrom y getTo debe retornar lote.unomas.tipo1.tipo2.tipo3
// Para getSort debe retornar lote.fechaApertura
var sampledata = {
  puntoVenta: {
    puntoVenta: {type: "uuid", src: ""},
    codigo: {type: "string", src: ""},
    descripcion: {type: "string", src: ""}
  },
  lote: {
    lote: {type: "uuid", src: ""},
    abierto: {type: "boolean", src: ""},
    fechaApertura: {type: "date", src: "", sort: 1},
    usuarioApertura: {type: "string", src: ""},
    fechaCierre: {type: "date", src: "fcierre", fromto2: true},
    unomas: {
      tipo1: {
        tipo2: {
          tipo3: {type: "date", src: "fcierre", fromto: true}
        }
      }
    },
    usuarioCierre: {type: "string", src: ""},
    ip: {type: "string", src: ""},
    montoLote: {type: "number", src: ""},
    montoComision: {type: "number", src: ""},
    total: {type: "number", src: ""}
  }
};
*/

function getPropertyByName(oObj, oProp) {
  var obj = oObj;
  var objUndefined;
  _.map(_.split(oProp, '.'), function(val) {
    if (typeof obj === 'undefined') {
      return;
    }
    if (obj[val]) {
      obj = obj[val];
    } else {
      obj = objUndefined;
    }
  });
  return obj;
}

/**
 * Obtiene la propiedad que esta marcada como "property"
 * @param {String} propertyName propiedad que se pretende evaluar
 * @param {String} propertyType Tipo de objeto que se pretende encontrar
 * @param  {Object} o          propiedad/objeto que se evalua
 * @param  {String} parentName Nombre de la propiedad que se esta evaluando
 * @return {String}            Propiedad del objeto que esta marcada como "property"
 */
var getPropertyField = function getPropertyField(propertyName, propertyType, o, parentName) {
  if (typeof parentName === 'undefined') {
    parentName = '';
  }
  var pname = '';
  var path = '';
  for (var p in o) {
    if ({}.hasOwnProperty.call(o, p)) {
      var t = typeof o[p];
      if (p === propertyName && t === propertyType) {
        return parentName;
      }
      if (t === 'object') {
        pname = getPropertyField(propertyName, propertyType, o[p], p);
        if (pname !== '') {
          path = path + parentName + ((parentName.length > 0) ? '.' : '') + pname;
          return path;
        }
      }
    }
  }
  return path;
};

function toText(text) {
  return ["'", text, "'"].join('');
}

function safeText(text) {
  return text.replace(/'/g, "''").replace(/"/g, '""');
}

function serializeUUID(schema, value) {
  if (typeof value !== 'undefined') {
    return safeText(_(value).toString());
  }
}

function parseUUID(schema, value) {
  // Make sure it's a properly-formatted number
  if (typeof value === 'undefined' || value === '') {
    return '';
  }

  value = _.trim(value);
  if (!dataTypePatterns.uuid.test(value)) {
    throw ono({code: filtersortError.FS013.code, message: filtersortError.FS013.message});
  }
  var parsedValue = value;

  return parsedValue;
}

function serializeString(schema, value) {
  if (typeof value !== 'undefined') {
    return safeText(_(value).toString());
  }
}

function parseString(schema, value) {
  if (typeof value === 'undefined') {
    value = '';
  }

  return value;
}

function serializeBoolean(schema, value) {
  if (typeof value !== 'undefined') {
    return Boolean(value).toString().toUpperCase();
  }
}

function parseBoolean(schema, value) {
  if (typeof value === 'undefined' || value === '') {
    value = 'false';
  }

  // "Parse" the value
  var parsedValue = value;
  var stringValue = _(value).toString().toLowerCase();
  if (stringValue === 'true' || stringValue === 't' || stringValue === '1' ||
    stringValue === 'si' || stringValue === 's' || stringValue === 'yes' || stringValue === 'y') {
    parsedValue = true;
  } else if (stringValue === 'false' || stringValue === 'f' || stringValue === '0' ||
    stringValue === 'no' || stringValue === 'n') {
    parsedValue = false;
  } else {
    throw ono({code: filtersortError.FS011.code, message: filtersortError.FS011.message});
  }

  return Boolean(parsedValue);
}

function serializeNumber(schema, value) {
  if (typeof value !== 'undefined') {
    return _(value).toString();
  }
}

function parseNumber(schema, value) {
  // Make sure it's a properly-formatted number
  if (typeof value === 'undefined' || value === '') {
    value = '0';
  }
  var parsedValue = parseFloat(value);
  if (_.isNaN(parsedValue) || !_.isFinite(parsedValue)) {
    throw ono({code: filtersortError.FS007.code, message: filtersortError.FS007.message});
  }

  return parsedValue;
}

function serializeInteger(schema, value) {
  if (typeof value !== 'undefined') {
    return _(value).toString();
  }
}

function parseInteger(schema, value) {
  // Make sure it's a properly-formatted integer
  if (typeof value === 'undefined' || value === '') {
    value = '0';
  }
  var parsedValue = parseInt(value, 10);
  if (_.isNaN(parsedValue) || !_.isFinite(parsedValue) || !dataTypePatterns.integer.test(value)) {
    throw ono({code: filtersortError.FS009.code, message: filtersortError.FS009.message});
  }

  return parsedValue;
}

function serializeDate(schema, value) {
  if (schema.type === 'date' && value) {
    // This works regardless of whether the value is a Date or an ISO8601 string
    return safeText(JSON.stringify(value).substring(1, 11));
  } else if (_.isDate(value)) {
    return safeText(value.toJSON());
  } else if (value) {
    return safeText(_(value).toString());
  }
}

function parseDate(schema, value) {
  var parsedValue;
  var validatedPattern = 'date-time';

  // If the value is already a Date, then we can skip some validation
  if (_.isDate(value)) {
    parsedValue = value;
  } else {
    // Validar el formato contra el tipo date-time
    var formatPattern = dataTypePatterns[validatedPattern];
    if (!formatPattern.test(value)) {
      // Validar el formato contra el tipo date-time2
      validatedPattern = 'date-time2';
      formatPattern = dataTypePatterns[validatedPattern];
      if (!formatPattern.test(value)) {
        // Validar el formato contra el tipo date-time3
        validatedPattern = 'date-time3';
        formatPattern = dataTypePatterns[validatedPattern];
        if (!formatPattern.test(value)) {
          // Validar el formato contra el tipo date-time4
          validatedPattern = 'date-time4';
          formatPattern = dataTypePatterns[validatedPattern];
          if (!formatPattern.test(value)) {
            // Validar el formato contra el tipo date
            validatedPattern = 'date';
            formatPattern = dataTypePatterns[validatedPattern];
            if (!formatPattern.test(value)) {
              throw ono({code: filtersortError.FS003.code, message: filtersortError.FS003.message});
            }
          }
        }
      }
    }

    // Parse the date
    parsedValue = new Date(value);
    if (!parsedValue || isNaN(parsedValue.getTime())) {
      throw ono({code: filtersortError.FS004.code, message: filtersortError.FS004.message});
    }
  }

  return parsedValue;
}

function transformFilterValue(schema, op, value) {
  switch (op) {
    case ':like:': case ':!like:':
      return ['%', value, '%'].join('');
    case ':rlike:': case ':!rlike:':
      return [value, '%'].join('');
    case ':llike:': case ':!llike:':
      return ['%', value].join('');
    default:
      return value;
  }
}

function setFilterValue(schema, field, op, value) {
  var parsedValue;
  var serializedValue;

  // Operadores validos por tipo de dato
  /* eslint-disable default-case */
  switch (schema.type) {
    case 'number': case 'integer':
      if (_.indexOf([':eq:', ':!eq:', ':gt:', ':!gt:', ':gte:', ':!gte:', ':lt:', ':!lt:', ':lte:',
        ':!lte:', ':r:', ':in:', ':!in:'], op) < 0) {
        throw ono({code: filtersortError.FS017.code, message: filtersortError.FS017.message,
          vendor: {
            code: filtersortError.FS017.code,
            message: util.format('Operador "%s" no valido para tipo de dato "%s"', op, schema.type)
          }
        });
      }
      break;
    case 'boolean':
      if (_.indexOf([':eq:', ':!eq:'], op) < 0) {
        throw ono({code: filtersortError.FS017.code, message: filtersortError.FS017.message,
          vendor: {
            code: filtersortError.FS017.code,
            message: util.format('Operador "%s" no valido para tipo de dato "%s"', op, schema.type)
          }
        });
      }
      break;
    case 'uuid':
      if (_.indexOf([':eq:', ':!eq:', ':r:', ':in:', ':!in:'], op) < 0) {
        throw ono({code: filtersortError.FS017.code, message: filtersortError.FS017.message,
          vendor: {
            code: filtersortError.FS017.code,
            message: util.format('Operador "%s" no valido para tipo de dato "%s"', op, schema.type)
          }
        });
      }
      break;
    case 'date': case 'date-time':
      if (_.indexOf([':eq:', ':!eq:', ':gt:', ':!gt:', ':gte:', ':!gte:', ':lt:', ':!lt:', ':lte:',
        ':!lte:', ':r:', ':in:', ':!in:'], op) < 0) {
        throw ono({code: filtersortError.FS017.code, message: filtersortError.FS017.message,
          vendor: {
            code: filtersortError.FS017.code,
            message: util.format('Operador "%s" no valido para tipo de dato "%s"', op, schema.type)
          }
        });
      }
      break;
  }
  /* eslint-enable default-case */

  // Caso especial para los operadores ':in:', ':!in:' y ':r:'
  // donde los valores pueden estar separados por coma
  // Dependiendo del tipo de dato, el operador ':in:' y ':!in:' puede agregar campos vacios en caso de no haver valores

  // Operador ':r:'
  // Tiene la forma ':r:VALOR1:VALOR2', ':r::VALOR2' o ':r:VALOR1'
  var arrOpR = [];
  if (op === ':r:' || op === ':in:' || op === ':!in:') {
    value = _.trim(value);
    if (op === ':r:') {
      if (value === '') {
        return '';
      }
      _.map(_.split(value, ':'), function(val) {
        arrOpR.push(_.trim(val));
      });

      // Hay valores para trabajar?
      if (arrOpR.length === 0) {
        return '';
      }
      if (arrOpR.length === 1 && arrOpR[0] === '') {
        return '';
      }
      if (arrOpR.length > 1 && arrOpR[0] === '' && arrOpR[1] === '') {
        return '';
      }

      if ((arrOpR.length === 1 && arrOpR[0] !== '') || (arrOpR.length > 1 && arrOpR[0] === '' && arrOpR[1] !== '')) {
        if (arrOpR.length === 1 && arrOpR[0] !== '') {
          op = ':gte:';
          value = arrOpR[0];
        } else {
          op = ':lte:';
          value = arrOpR[1];
        }
        // Solo hay un valor DESDE o HASTA
        try {
          parsedValue = parseValue(schema, value);
        } catch (e) {
          throw ono(e, {
            vendor: {
              code: e.code,
              message: util.format('filter "%s" No esta debidamente formateado "%s"', field, value)
            }
          });
        }
        serializedValue = serializeValue(schema, parsedValue);
        // Generar el sql
        switch (schema.type) {
          case 'string':
            return util.format(' and upper(%s) %s upper(%s) ', schema.src, filterSqlOperatorMap(op),
              filterSqlOperatorMap(op), toText(transformFilterValue(schema, op, serializedValue)));
          case 'number': case 'integer':
            return util.format(' and %s %s %s ', schema.src, filterSqlOperatorMap(op), serializedValue);
          case 'uuid': case 'date': case 'date-time':
            return util.format(' and %s %s %s ', schema.src, filterSqlOperatorMap(op), toText(serializedValue));
          default:
            throw ono({code: filtersortError.FS015.code, message: filtersortError.FS015.message},
              '[setFilterValue] Tipo de dato "%s" no soportado - %s: "%s"', schema.type, schema, value);
        }
      } else {
        // Se tiene dos valores
        parsedValue = [];
        serializedValue = [];
        try {
          _.map(arrOpR, function(val) {
            var parsedVal = parseValue(schema, val);
            var serializedVal = serializeValue(schema, parsedVal);
            parsedValue.push(parsedVal);
            serializedValue.push(serializedVal);
          });
        } catch (e) {
          throw ono(e, {
            vendor: {
              code: e.code,
              message: util.format('filter "%s" No esta debidamente formateado "%s"', field, value)
            }
          });
        }
        // Generar el sql
        switch (schema.type) {
          case 'string':
            return util.format(' and upper(%s) %s upper(%s) and upper(%s) ', schema.src, filterSqlOperatorMap(op),
              toText(transformFilterValue(schema, op, serializedValue[0])),
              toText(transformFilterValue(schema, op, serializedValue[1])));
          case 'number': case 'integer':
            return util.format(' and %s %s %s and %s ', schema.src, filterSqlOperatorMap(op),
              serializedValue[0], serializedValue[1]);
          case 'uuid': case 'date': case 'date-time':
            return util.format(' and %s %s %s and %s ', schema.src, filterSqlOperatorMap(op),
              toText(serializedValue[0]), toText(serializedValue[1]));
          default:
            throw ono({code: filtersortError.FS015.code, message: filtersortError.FS015.message},
              '[setFilterValue] Tipo de dato "%s" no soportado - %s: "%s"', schema.type, schema, value);
        }
      }
    } else {
      // Operadores ':in:' y ':!in:'
      // Tiene la forma ':in:VALOR1,VALOR2,...', ':in:'
      if (value === '') {
        if (schema.type === 'string') {
          return util.format(' and %s %s (\'\') ', schema.src, filterSqlOperatorMap(op));
        }
        return '';
      }
      // Separar la lista de valores
      _.map(_.split(value, ','), function(val) {
        arrOpR.push(_.trim(val));
      });

      parsedValue = [];
      serializedValue = [];
      try {
        _.map(arrOpR, function(val) {
          var parsedVal = parseValue(schema, val);
          var serializedVal = serializeValue(schema, parsedVal);
          parsedValue.push(parsedVal);
          serializedValue.push(serializedVal);
        });
      } catch (e) {
        throw ono(e, {
          vendor: {
            code: e.code,
            message: util.format('filter "%s" No esta debidamente formateado "%s"', field, value)
          }
        });
      }

      // Generar el sql
      arrOpR = [];
      switch (schema.type) {
        case 'string':
          _.map(serializedValue, function(val) {
            var lValue = util.format('upper(%s)', toText(val));
            arrOpR.push(lValue);
          });
          return util.format(' and upper(%s) %s (%s) ', schema.src, filterSqlOperatorMap(op), arrOpR.join(', '));
        case 'number': case 'integer':
          _.map(serializedValue, function(val) {
            var lValue = util.format('upper(%s)', toText(val));
            if (val !== '') {
              arrOpR.push(lValue);
            }
          });
          if (arrOpR.length === 0) {
            return '';
          }
          return util.format(' and %s %s (%s) ', schema.src, filterSqlOperatorMap(op), arrOpR.join(', '));
        case 'uuid': case 'date': case 'date-time':
          _.map(serializedValue, function(val) {
            var lValue = util.format('%s', toText(val));
            if (val !== '') {
              arrOpR.push(lValue);
            }
          });
          if (arrOpR.length === 0) {
            return '';
          }
          return util.format(' and %s %s (%s) ', schema.src, filterSqlOperatorMap(op), arrOpR.join(', '));
        default:
          throw ono({code: filtersortError.FS015.code, message: filtersortError.FS015.message},
            '[setFilterValue] Tipo de dato "%s" no soportado - %s: "%s"', schema.type, schema, value);
      }
    }
  } else {
    // Se trata de valores individuales
    try {
      parsedValue = parseValue(schema, value);
    } catch (e) {
      throw ono(e, {
        vendor: {
          code: e.code,
          message: util.format('filter "%s" No esta debidamente formateado "%s"', field, value)
        }
      });
    }
    serializedValue = serializeValue(schema, parsedValue);

    // Generar el sql
    switch (schema.type) {
      case 'string':
        return util.format(' and upper(%s) %s upper(%s) ', schema.src, filterSqlOperatorMap(op),
          toText(transformFilterValue(schema, op, serializedValue)));
      case 'number': case 'integer': case 'boolean':
        return util.format(' and %s %s %s ', schema.src, filterSqlOperatorMap(op), serializedValue);
      case 'uuid': case 'date': case 'date-time':
        return util.format(' and %s %s %s ', schema.src, filterSqlOperatorMap(op), toText(serializedValue));
      default:
        throw ono({code: filtersortError.FS015.code, message: filtersortError.FS015.message},
          '[setFilterValue] Tipo de dato "%s" no soportado - %s: "%s"', schema.type, schema, value);
    }
  }
}

function serializeValue(schema, value) {
  switch (schema.type) {
    case 'string':
      return serializeString(schema, value);
    case 'number':
      return serializeNumber(schema, value);
    case 'integer':
      return serializeInteger(schema, value);
    case 'boolean':
      return serializeBoolean(schema, value);
    case 'uuid':
      return serializeUUID(schema, value);
    case 'date': case 'date-time':
      return serializeDate(schema, value);
    default:
      throw ono({code: filtersortError.FS015.code, message: filtersortError.FS015.message},
        'Tipo de dato "%s" no soportado - %s: "%s"', schema.type, schema, value);
  }
}

function parseValue(schema, value) {
  switch (schema.type) {
    case 'string':
      return parseString(schema, value);
    case 'number':
      return parseNumber(schema, value);
    case 'integer':
      return parseInteger(schema, value);
    case 'boolean':
      return parseBoolean(schema, value);
    case 'uuid':
      return parseUUID(schema, value);
    case 'date': case 'date-time':
      return parseDate(schema, value);
    default:
      throw ono({code: filtersortError.FS015.code, message: filtersortError.FS015.message},
        'Tipo de dato "%s" no soportado - %s: "%s"', schema.type, schema, value);
  }
}

/**
 * Obtiene
 * @param {Object} query  Objeto "query" del request
 * @param {Object} schema Objeto "data" que se envia como parte del response
 * @param {Object} defaults  Objeto "query" del request con valores por defecto
 *
 * @constructor
 */
function QueryFilterSort(query, schema, defaults) {
  if (!query) {
    throw ono({code: filtersortError.FS001.code, message: filtersortError.FS001.message},
      'No se ha indicado query del Request');
  }
  if (!schema) {
    throw ono({code: filtersortError.FS002.code, message: filtersortError.FS002.message},
      'No se ha indicado el esquema JSON');
  }

  this.schema = schema;
  this.defaults = (defaults) ? defaults : {};
  this.query = _.assign(this.defaults, query);
  this.getOffset();
  this.getLimit();
}

/**
 * Obtiene el query param "offset"
 * @return {integer} offset
 */
QueryFilterSort.prototype.getOffset = function() {
  var offset = parseInt(this.query.offset || 0, 10);
  _queryParam.offset = offset;
  return offset;
};

/**
 * Obtiene el query param "limit"
 * @return {integer} limit
 */
QueryFilterSort.prototype.getLimit = function() {
  var limit = parseInt(this.query.limit || 20, 10);
  _queryParam.limit = limit;
  return limit;
};

/**
 * Obtiene el query param "from"
 * @return {string} expresion sql
 */
QueryFilterSort.prototype.getFrom = function() {
  var from = this.query.from || '';
  var schemaField;
  from = from.trim();
  if (from === '') {
    return '';
  }

  // Obtener el campo que filtra por la fecha
  var field = getPropertyField('fromto', 'boolean', this.schema);
  if (field === '') {
    return '';
  }
  schemaField = getPropertyByName(this.schema, field);

  // Validar el formato
  var parsedValue;
  try {
    parsedValue = parseDate(schemaField, from);
  } catch (e) {
    throw ono(e, {
      vendor: {
        code: e.code,
        message: util.format('from "%s" No esta debidamente formateado "%s"', field, from)
      }
    });
  }
  var serializedValue = serializeDate(schemaField, parsedValue);

  _queryParam.from = from; // Agregar a la lista de "from" validados

  // Generar el sql
  return util.format(' and %s >= %s ', schemaField.src, toText(serializedValue));
};

/**
 * Obtiene el query param "to"
 * @return {string} expresion sql
 */
QueryFilterSort.prototype.getTo = function() {
  var to = this.query.to || '';
  var schemaField;
  to = to.trim();
  if (to === '') {
    return '';
  }

  // Obtener el campo que filtra por la fecha
  var field = getPropertyField('fromto', 'boolean', this.schema);
  if (field === '') {
    return '';
  }
  schemaField = getPropertyByName(this.schema, field);

  // Validar el formato
  var parsedValue;
  try {
    parsedValue = parseDate(schemaField, to);
  } catch (e) {
    throw ono(e, {
      vendor: {
        code: e.code,
        message: util.format('to "%s" No esta debidamente formateado "%s"', field, to)
      }
    });
  }
  var serializedValue = serializeDate(schemaField, parsedValue);

  _queryParam.to = to; // Agregar a la lista de "to" validados

  // Generar el sql
  return util.format(' and %s <= %s ', schemaField.src, toText(serializedValue));
};

/**
 * Obtiene el query param "q"
 * @return {string} valor del parametro q
 */
QueryFilterSort.prototype.getQ = function() {
  var q = this.query.q || '';
  q = q.trim();
  if (q === '') {
    return '';
  }
  _queryParam.q = q;
  return q;
};

function getDefaultSort(schema, defaultSort) {
  var field;
  var sortDir;
  var schemaField;
  // Se busca un orden por defecto
  if (typeof defaultSort !== 'undefined') {
    return defaultSort;
  }
  // No hay un defaultSort, se busca en el esquema si hay algun campo para ordenar
  field = getPropertyField('sort', 'number', schema);
  if (field !== '') {
    schemaField = getPropertyByName(schema, field);
    sortDir = parseInt(schemaField.sort, 10) === 0 ? 'desc' : 'asc';
    return util.format('%s %s', schemaField.src, sortDir);
  }

  // Por defecto se ordena por el primer campo
  return '1 asc';
}

/**
 * Obtiene el query param "sort"
 * El parametro sort puede tener una de las siguientes formas:
 * - string:numero
 * - string
 * y para tener varios campos para ordenar se utiliza el separador "|"
 * @param {string} defaultSort Order by especificado por defecto por el programador
 * @return {string} expresion sql
 * @example
 *
 * campo1:1
 * campo1
 * campo1:1|campo2:0
 */
QueryFilterSort.prototype.getSort = function(defaultSort) {
  var sort = this.query.sort || '';
  _queryParam.sort = [];
  sort = sort.trim();
  if (sort === '') {
    return getDefaultSort(this.schema, defaultSort);
  }

  // Obtener la lista de campos sort, estan separados por "|"
  // Cada campo tiene la forma: string:numero o string
  var arrSortField = [];
  var _schema = this.schema;
  _.map(_.split(sort, '|'), function(val) {
    var lField = val.trim();
    var arrFld = [];
    var schemaField;
    if (lField !== '') {
      arrFld = _.split(lField, ':');
      schemaField = getPropertyByName(_schema, _.trim(arrFld[0]));
      if (arrFld.length > 1) {
        if (schemaField) {
          _queryParam.sort.push(lField); // Agregar a la lista de sort validados
          arrSortField.push([schemaField.src,
            (_.trim(arrFld[1]) === '1') ? 'asc' : 'desc'].join(' '));
        }
      } else if (schemaField) {
        _queryParam.sort.push(lField); // Agregar a la lista de sort validados
        arrSortField.push([schemaField.src, 'asc'].join(' '));
      }
    }
  });
  if (arrSortField.length === 0) {
    return getDefaultSort(this.schema, defaultSort);
  }
  return arrSortField.join(', ');
};

/**
 * Obtiene el query param "filter"
 *
 * @return {string} expresion sql
 *
 */
QueryFilterSort.prototype.getFilter = function() {
  var filter = this.query.filter || '';
  _queryParam.filter = [];
  filter = filter.trim();
  if (filter === '') {
    return '';
  }

  // Obtener la lista de campos filter, estan separados por "|"
  // Cada campo tiene la forma: <campo> <operador> <valor o valores> [| <campo> <operador> <valor o valores> ... ]
  var arrFilterField = [];
  var _schema = this.schema;
  _.map(_.split(filter, '|'), function(val) {
    /* eslint-disable max-len */
    /* eslint-disable no-useless-escape */
    var re = /([a-zA-Z0-9\._]+)(:eq:|:!eq:|:gt:|:!gt:|:gte:|:!gte:|:lt:|:!lt:|:lte:|:!lte:|:like:|:!like:|:rlike:|:!rlike:|:llike:|:!llike:|:r:|:in:|:!in:)(.*)/;
    /* eslint-enable no-useless-escape */
    /* eslint-enable max-len */
    var lField = val.trim();
    var arrFld = [];
    var campo;
    var operador;
    var valor;
    var procVal;
    if (lField === '') {
      // No hay nada
      return;
    }
    arrFld = re.exec(lField);
    if (!arrFld) {
      // No hay un match
      return;
    }
    if (arrFld.length < 3) {
      // el formato de la asignacion de variable esta incompleto, se necesita almenos 3
      return;
    }
    // arrFld[1]: campo, arrFld[2]: operador, arrFld[3]: valor (puede estar vacio)
    // Validar si existe el campo arrFld[1]
    campo = _.trim(arrFld[1]);
    if (!getPropertyByName(_schema, campo)) {
      // No existe el campo dentro del esquema
      return;
    }
    operador = _.toLower(arrFld[2]); // Operador
    valor = (arrFld.length > 3) ? _.trim(arrFld[3]) : ''; // Valor, puede ser vacio
    procVal = setFilterValue(getPropertyByName(_schema, campo), campo, operador, valor);
    if (procVal !== '') {
      // Se agrega a la lista de los parametros validados
      _queryParam.filter.push([campo, operador, valor].join(''));
    }
    arrFilterField.push(procVal);
  });
  if (arrFilterField.length === 0) {
    return '';
  }
  return arrFilterField.join(' ');
};

/**
 * Genera los queryparam limit, offset, filter, sort, from, to, q
 * @return {string} queryparam
 */
QueryFilterSort.prototype.getQueryParamAll = function() {
  var limit = '';
  var offset = '';
  var filter = '';
  var sort = '';
  var from = '';
  var to = '';
  var q = '';
  var ret = [];

  // limit
  limit = ['limit', _queryParam.limit].join('=');
  // offset
  offset = ['offset', _queryParam.offset].join('=');
  // from
  if (_queryParam.from !== '') {
    from = ['from', _queryParam.from].join('=');
  }
  // to
  if (_queryParam.to !== '') {
    to = ['to', _queryParam.to].join('=');
  }
  // sort
  if (_queryParam.sort.length > 0) {
    sort = ['sort', encodeURIComponent(_queryParam.sort.join('|'))].join('=');
  }
  // filter
  if (_queryParam.filter.length > 0) {
    filter = ['filter', encodeURIComponent(_queryParam.filter.join('|'))].join('=');
  }
  // q
  if (_queryParam.q !== '') {
    q = ['q', encodeURIComponent(_queryParam.q)].join('=');
  }
  _.map([limit, offset, from, to, sort, q, filter], function(val) {
    if (val !== '') {
      ret.push(val);
    }
  });
  return ret.join('&');
};

/**
 * Genera los queryparam filter, sort, from, to
 * @return {string} queryparam
 */
QueryFilterSort.prototype.getQueryParam = function() {
  var filter = '';
  var sort = '';
  var from = '';
  var to = '';
  var q = '';
  var ret = [];

  // from
  if (_queryParam.from !== '') {
    from = ['from', _queryParam.from].join('=');
  }
  // to
  if (_queryParam.to !== '') {
    to = ['to', _queryParam.to].join('=');
  }
  // sort
  if (_queryParam.sort.length > 0) {
    sort = ['sort', encodeURIComponent(_queryParam.sort.join('|'))].join('=');
  }
  // filter
  if (_queryParam.filter.length > 0) {
    filter = ['filter', encodeURIComponent(_queryParam.filter.join('|'))].join('=');
  }
  // q
  if (_queryParam.q !== '') {
    q = ['q', encodeURIComponent(_queryParam.q)].join('=');
  }
  _.map([from, to, sort, q, filter], function(val) {
    if (val !== '') {
      ret.push(val);
    }
  });
  return ret.join('&');
};

/**
 * Genera los links first, next, previous y last
 * usando limit, offset, filter, sort, from, to
 *
 * @param {integer} recordsCount Cantidad de registros encontrados
 * @param {string} url URL Base para construir el url definitivo
 * @return {array} links
 */
QueryFilterSort.prototype.getDefaultLinks = function(recordsCount, url) {
  var limit = '';
  var offset = '';
  var filter = '';
  var sort = '';
  var from = '';
  var to = '';
  var q = '';
  var pageSize = _queryParam.limit;
  var pageOffset = _queryParam.offset;
  var totalPages = 0;
  var currentPage = 0;
  var ret = [];
  var links = {
    offset: 0,
    limit: 0,
    recordsCount: 0,
    pageSize: 0,
    totalPages: 0,
    currentPage: 0,
    url: '',
    param: '',
    links: []
  };

  url = url.replace(/\/+$/, '');

  recordsCount = parseInt(recordsCount, 10);

  // from
  if (_queryParam.from !== '') {
    from = ['from', _queryParam.from].join('=');
  }
  // to
  if (_queryParam.to !== '') {
    to = ['to', _queryParam.to].join('=');
  }
  // sort
  if (_queryParam.sort.length > 0) {
    sort = ['sort', encodeURIComponent(_queryParam.sort.join('|'))].join('=');
  }
  // filter
  if (_queryParam.filter.length > 0) {
    filter = ['filter', encodeURIComponent(_queryParam.filter.join('|'))].join('=');
  }
  // q
  if (_queryParam.q !== '') {
    q = ['q', encodeURIComponent(_queryParam.q)].join('=');
  }

  // total de paginas
  if (recordsCount <= 0) {
    totalPages = 0;
    currentPage = 1;
  } else {
    totalPages = parseInt(recordsCount / pageSize, 10) + ((parseInt(recordsCount % pageSize, 10) > 0) ? 1 : 0);
    currentPage = parseInt(1, 10) + parseInt(pageOffset / pageSize, 10) +
      (parseInt(pageOffset % pageSize, 10) > 0 ? 1 : 0);
  }

  links.offset = _queryParam.offset;
  links.limit = _queryParam.limit;
  links.recordsCount = recordsCount;
  links.pageSize = pageSize;
  links.totalPages = totalPages;
  links.currentPage = currentPage;
  ret = [];
  _.map([from, to, sort, q, filter], function(val) {
    if (val !== '') {
      ret.push(val);
    }
  });
  links.url = url;
  links.param = ret.join('&');

  // Generar "first"
  // Solo se genera si no estamos en ella
  if (currentPage > 1) {
    ret = [];
    offset = ['offset', '0'].join('=');
    limit = ['limit', _queryParam.limit].join('=');
    _.map([limit, offset, from, to, sort, q, filter], function(val) {
      if (val !== '') {
        ret.push(val);
      }
    });
    links.links.push({rel: "first", href: [url, ret.join('&')].join('?')});
  }

  // Generar "previous"
  // Solo se genera mientras "previous" no sea la primera pagina
  if (currentPage - 1 > 1) {
    ret = [];
    offset = ['offset', parseInt((parseInt(currentPage, 10) - parseInt(2, 10)) *
      parseInt(_queryParam.limit, 10), 10)].join('=');
    limit = ['limit', _queryParam.limit].join('=');
    _.map([limit, offset, from, to, sort, q, filter], function(val) {
      if (val !== '') {
        ret.push(val);
      }
    });
    links.links.push({rel: "previous", href: [url, ret.join('&')].join('?')});
  }

  // Generar "next"
  // Solo se genera mientras "next" no sea la ultima pagina
  if (currentPage < totalPages - 1) {
    ret = [];
    offset = ['offset', parseInt(_queryParam.offset, 10) + parseInt(_queryParam.limit, 10)].join('=');
    limit = ['limit', _queryParam.limit].join('=');
    _.map([limit, offset, from, to, sort, q, filter], function(val) {
      if (val !== '') {
        ret.push(val);
      }
    });
    links.links.push({rel: "next", href: [url, ret.join('&')].join('?')});
  }

  // Generar "last"
  // Solo se genera si no estamos en la ultima pagina
  if (currentPage < totalPages) {
    ret = [];
    offset = ['offset', parseInt((parseInt(totalPages, 10) - parseInt(1, 10)) *
      parseInt(_queryParam.limit, 10), 10)].join('=');
    limit = ['limit', _queryParam.limit].join('=');
    _.map([limit, offset, from, to, sort, q, filter], function(val) {
      if (val !== '') {
        ret.push(val);
      }
    });
    links.links.push({rel: "last", href: [url, ret.join('&')].join('?')});
  }

  return links;
};

module.exports = QueryFilterSort;
