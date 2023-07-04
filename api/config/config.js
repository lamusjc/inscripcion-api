module.exports = {
  port: 3000, //Server's port
  database: "postgresql://postgres:masterkey@localhost:5432/inscripciondb",
  mock: {
    enabled: false,
    mode: "stub", // stub, json-server
    host: "http://127.0.0.1:59969",
  },
  jwtSecret: "SECRET-PARA-JWT",
  sessionSecret: "SECRET-PARA-REDIS",
  redisHost: "localhost",
  redisPort: 6379,
  redisTtl: 86400,
  mailer: {
    host: "",
    port: 465,
    auth: {
      user: "",
      pass: "",
    },
  },
  /* Url para los correos en el front-end*/
  // Local
  // url: "http://localhost:4200/#/",

  //Produccion
  url: ""
};
