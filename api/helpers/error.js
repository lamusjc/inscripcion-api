"use strict";

module.exports.user = {
  U0001: {
    code: "U0001",
    message: "Correo o Clave incorrecto",
  },
  U0002: {
    code: "U0002",
    message: "Usuario o Cédula ya existe",
  },
  U0003: {
    code: "U0003",
    message: "Rol no existe",
  },
  U9999: {
    code: "U9999",
    message: "Unknown Error",
  },
};

module.exports.student = {
  ST0001: {
    code: "ST0001",
    message: "Usuario no encontrado",
  },
  ST0002: {
    code: "ST0002",
    message: "Usuario se encuentra inscrito, no puedes volverte a inscribir",
  },
  ST0003: {
    code: "ST0003",
    message: "Uno de tus hospitales/BP se ha quedado sin cupo, escoge otra opción",
  },
  ST0004: {
    code: "ST0004",
    message: "No puedes inscribir la misma materia para ambas secciones, escoge otra opción"
  },
  ST0005: {
    code: "ST0005",
    message: "No puedes inscribir la misma materia, sección, hospital/bq 2 veces"
  },
  ST0006: {
    code: "ST0006",
    message: "Estas intentando inscribir mas de un cupo en la misma sección, escoge un cupo por sección"
  },
  ST0007: {
    code: "ST0007",
    message: "Ese cupo no existe"
  },
  ST9999: {
    code: "ST9999",
    message: "Unknown Error",
  },
};

module.exports.session = {
  S0001: {
    code: "S0001",
    message: "Invalid auth token",
  },
  S0002: {
    code: "S0002",
    message: "Not authorized for this action",
  },
  S0003: {
    code: "S0003",
    message: "Code not valid",
  },
  S0004: {
    code: "S0004",
    message: "Code expired",
  },
  S0005: {
    code: "S0005",
    message: "Token not valid",
  },
  S0006: {
    code: "S0006",
    message:
      "You are not subscribed to the service. Go to Settings and then Plan and Billing",
  },
  S9000: {
    code: "S9000",
    message: "Unknown Error",
  },
  S9999: {
    code: "S9999",
    message: "Session error",
  },
};
