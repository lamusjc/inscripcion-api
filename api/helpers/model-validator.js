/**
 * Validador de tipo de datos.
 *
 * Permite validar un objeto contra un esquema
 * La definicion del esquema permite hacer validaciones contra los tipos de datos soportados,
 *
 * Ejemplo del esquema de validacion
 * var schema = {
 *   'input': {
 *     type: 'string'|'number'|'integer'|'boolean'|'uuid'|'date'|'date-time' (default string),
 *     required: false|true (default false),
 *     errorMessage: ''
 *   }, ...
 * }
 *
 * Ejemplo:
 * var esquemaVal = {
 *   campo1: {
 *     type: 'string',
 *     required: true,
 *     errorMessage: 'El campo es requerido'
 *   },
 *   campo2: {
 *     type: 'uuid',
 *     required: false,
 *     errorMessage: 'Este campo no valida'
 *   }
 * };
 * var data = {
 *   campo1: '',
 *   campo2: 'hola'
 * };
 * var modelValidator = require('modelValidator');
 * var err = modelValidator(data, esquemaVal);
 *
 * // Salida:
 * // err = [
 * //   {param: 'campo1', msg: 'El campo es requerido', value: ''},
 * //   {param: 'campo2', msg: 'Este campo no valida', value: 'hola'}
 * // ]
 * //
 * // Salida sin error:
 * // err = []
 * //
 */
"use strict";

var _ = require("lodash");
var apiModelError = require("./error").apiModel;

// Supported data types
var dataTypes = [
  "string",
  "number",
  "integer",
  "boolean",
  "uuid",
  "date",
  "date-time",
];

// Valid patterns for each data type
/* eslint-disable quote-props */
var dataTypePatterns = {
  integer: /^[+-]?(\d+|0x[\dA-F]+)$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
  "date-time": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/i,
  "date-time2": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/i,
  "date-time3": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/i,
  "date-time4": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/i,
  "date-time5": /^\d{4}-\d{2}-\d{2}\s{1}\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/i,
  "date-time6": /^\d{4}-\d{2}-\d{2}\s{1}\d{2}:\d{2}:\d{2}(\.\d+)?$/i,
  "date-time7": /^\d{4}-\d{2}-\d{2}\s{1}\d{2}:\d{2}:\d{2}$/i,
  "date-time8": /^\d{4}-\d{2}-\d{2}\s{1}\d{2}:\d{2}$/i,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};
/* eslint-enable quote-props */

function validateUUID(value, required, onlyRequired) {
  // Make sure it's a properly-formatted number
  if (typeof value === "undefined" || value === "") {
    value = "";
    if (required) {
      return false;
    }
  }

  value = _.trim(value);
  if (value === "" && !required) {
    return true;
  }
  if (value === "" && required) {
    return false;
  }

  if (onlyRequired) {
    // Solo se esta validando campos requeridos
    return true;
  }

  // caso especial UUID-Null
  if (value === "00000000-0000-0000-0000-000000000000") {
    return true;
  }

  if (!dataTypePatterns.uuid.test(value)) {
    return false;
  }

  return true;
}

function validateString(value, required, onlyRequired) {
  if (typeof value === "undefined") {
    value = "";
    if (required) {
      return false;
    }
  }
  value = _.trim(value);
  if (value === "" && !required) {
    return true;
  }
  if (value === "" && required) {
    return false;
  }

  if (onlyRequired) {
    // Solo se esta validando campos requeridos
    return true;
  }

  return true;
}

function validateBoolean(value, required, onlyRequired) {
  if (typeof value === "undefined" || value === "") {
    value = "";
    if (required) {
      return false;
    }
  }
  value = _.trim(value);
  if (value === "" && !required) {
    return true;
  }
  if (value === "" && required) {
    return false;
  }

  if (onlyRequired) {
    // Solo se esta validando campos requeridos
    return true;
  }

  var stringValue = _(value).toString().toLowerCase();
  if (stringValue !== "true" && stringValue !== "false") {
    return false;
  }

  return true;
}

function validateNumber(value, required, onlyRequired) {
  // Make sure it's a properly-formatted number
  if (typeof value === "undefined" || value === "") {
    value = "";
    if (required) {
      return false;
    }
  }
  value = _.trim(value);
  if (value === "" && !required) {
    return true;
  }
  if (value === "" && required) {
    return false;
  }

  if (onlyRequired) {
    // Solo se esta validando campos requeridos
    return true;
  }

  var parsedValue = parseFloat(value);
  if (_.isNaN(parsedValue) || !_.isFinite(parsedValue)) {
    return false;
  }

  return true;
}

function validateInteger(value, required, onlyRequired) {
  // Make sure it's a properly-formatted integer
  if (typeof value === "undefined" || value === "") {
    value = "";
    if (required) {
      return false;
    }
  }
  value = _.trim(value);
  if (value === "" && !required) {
    return true;
  }
  if (value === "" && required) {
    return false;
  }

  if (onlyRequired) {
    // Solo se esta validando campos requeridos
    return true;
  }

  var parsedValue = parseInt(value, 10);
  if (
    _.isNaN(parsedValue) ||
    !_.isFinite(parsedValue) ||
    !dataTypePatterns.integer.test(value)
  ) {
    return false;
  }

  return true;
}

function validateDate(value, required, onlyRequired) {
  var parsedValue;
  // var validatedPattern = 'date-time';
  var validatedPatternList = [
    "date-time",
    "date-time2",
    "date-time3",
    "date-time4",
    "date-time5",
    "date-time6",
    "date-time7",
    "date-time8",
    "date",
  ];
  var validado;
  var formatPattern;
  var i;

  if (typeof value === "undefined" || value === "") {
    value = "";
    if (required) {
      return false;
    }
  }
  value = _.trim(value);
  if (value === "" && !required) {
    return true;
  }
  if (value === "" && required) {
    return false;
  }

  if (onlyRequired) {
    // Solo se esta validando campos requeridos
    return true;
  }

  // If the value is already a Date, then we can skip some validation
  if (_.isDate(value)) {
    parsedValue = value;
  } else {
    validado = false;
    for (i = 0; i < validatedPatternList.length && !validado; i++) {
      formatPattern = dataTypePatterns[validatedPatternList[i]];
      // console.log('Pattern: %d, %s, %s', i, validatedPatternList[i], formatPattern);
      validado = formatPattern.test(value);
    }
    if (!validado) {
      return false;
    }

    // Parse the date
    parsedValue = new Date(value);
    if (!parsedValue || isNaN(parsedValue.getTime())) {
      return false;
    }
  }

  return true;
}

function validateValue(value, type, required) {
  switch (type) {
    case "string":
      return validateString(value, required, false);
    case "number":
      return validateNumber(value, required, false);
    case "integer":
      return validateInteger(value, required, false);
    case "boolean":
      return validateBoolean(value, required, false);
    case "uuid":
      return validateUUID(value, required, false);
    case "date":
    case "date-time":
      return validateDate(value, required, false);
    default:
      return validateString(value, required, false);
  }
}

function validateRequired(value, type, required) {
  switch (type) {
    case "string":
      return validateString(value, required, true);
    case "number":
      return validateNumber(value, required, true);
    case "integer":
      return validateInteger(value, required, true);
    case "boolean":
      return validateBoolean(value, required, true);
    case "uuid":
      return validateUUID(value, required, true);
    case "date":
    case "date-time":
      return validateDate(value, required, true);
    default:
      return validateString(value, required, true);
  }
}

function getErrorTypeCode(type) {
  switch (type) {
    case "string":
      return apiModelError.AM003;
    case "number":
      return apiModelError.AM004;
    case "integer":
      return apiModelError.AM005;
    case "boolean":
      return apiModelError.AM006;
    case "uuid":
      return apiModelError.AM007;
    case "date":
    case "date-time":
      return apiModelError.AM002;
    default:
      return apiModelError.AM008;
  }
}

function validateSchema(schemaIn, schemaTpl, options) {
  var validateErrList = []; // Lista de errores de validacion
  var requiredErrList = []; // Lista de errores solo de los requeridos
  var errList = [];
  var currentType = "";
  var currentRequired = false;
  // var currentErrorMessage = '';
  var currentValue;
  var errorCode;
  // Caso especial, el esquema de validacion es un objeto vacio
  // para la validacion se asume que es requerido que sea vacio tambien
  // Para el resto de la validacion no va a iterar porque el esquema de validacion esta vacio
  if (_.isEmpty(schemaTpl) && !_.isEmpty(schemaIn)) {
    requiredErrList.push(
      options.errorFormatter(
        apiModelError.AM010.code,
        "",
        apiModelError.AM010.message,
        ""
      )
    );
  }

  for (var param in schemaTpl) {
    // Verificar si tiene la propiedad "type"
    if (schemaTpl[param].hasOwnProperty("type")) {
      if (dataTypes.indexOf(schemaTpl[param].type) >= 0) {
        currentType = schemaTpl[param].type;
      } else {
        // skip params where defined location is not supported
        requiredErrList.push(
          options.errorFormatter(
            apiModelError.AM008.code,
            param,
            apiModelError.AM008.message,
            schemaTpl[param].type
          )
        );
      }
    } else {
      currentType = "string";
    }

    // Verificar si tiene la peopiedad "required"
    if (schemaTpl[param].hasOwnProperty("required")) {
      currentRequired = schemaTpl[param].required;
    } else {
      currentRequired = false;
    }

    /*
    // Verificar si tiene la peopiedad "errorMessage"
    if (schemaTpl[param].hasOwnProperty('errorMessage')) {
      currentErrorMessage = schemaTpl[param].currentErrorMessage;
    } else {
      currentErrorMessage = 'Parametro no valido';
    }
    */

    // Buscar el campo en el esquema de entrada
    if (_.has(schemaIn, param)) {
      currentValue = _.get(schemaIn, param);
      if (!validateRequired(currentValue, currentType, currentRequired)) {
        // console.log('Validando Requerido: %s, type %s, req %s, val %s', param, currentType, currentRequired, currentValue);
        requiredErrList.push(
          options.errorFormatter(
            apiModelError.AM001.code,
            param,
            apiModelError.AM001.message,
            currentValue
          )
        );
      } else if (!validateValue(currentValue, currentType, currentRequired)) {
        // console.log('Validando valor: %s, type %s, req %s, val %s', param, currentType, currentRequired, currentValue);
        errorCode = getErrorTypeCode(currentType);
        validateErrList.push(
          options.errorFormatter(
            errorCode.code,
            param,
            errorCode.message,
            currentValue
          )
        );
      }
    } else {
      // No se consigue, entonces incluirlo en la lista
      requiredErrList.push(
        options.errorFormatter(
          apiModelError.AM001.code,
          param,
          apiModelError.AM001.code,
          ""
        )
      );
    }
  }
  errList = _.concat(requiredErrList, validateErrList);
  return options.getError(errList);
}

/**
 * Obtiene
 * @param {Object} options  Opciones de validacion
 *
 * @constructor
 */
var modelValidator = function (options) {
  options = options || {};
  var defaults = {
    errorFormatter: function (code, param, msg, value) {
      return {
        code: code,
        param: param,
        msg: msg,
        value: value,
      };
    },
    getError: function (errorList) {
      var error = {
        code: "",
        message: "",
        vendor: {
          code: "",
          message: "",
        },
      };
      var messageList = [];
      var i;
      if (errorList.length > 0) {
        error.code = errorList[0].code;
        error.message = errorList[0].msg;
        for (i = 0; i < errorList.length; i++) {
          messageList.push(
            [errorList[i].param, ": ", errorList[i].msg].join("")
          );
        }
        error.vendor.code = apiModelError.AM009.code;
        error.vendor.message = messageList.join("; ");
        // console.log('Error de validacion %j', error);
      } else {
        error = {};
      }
      return error;
    },
  };
  _.defaults(options, defaults);

  return function (schemaIn, schemaTpl) {
    return validateSchema(schemaIn, schemaTpl, options);
  };
};

module.exports = modelValidator;
