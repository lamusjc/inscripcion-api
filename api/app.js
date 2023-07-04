//modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');
// const errorHandler = require('./middlewares/error-handler');
// const serveIndex = require('serve-index');
var session = require("./middlewares/session");
var cors = require("cors");

require("./helpers/config-loader")();

//setting express
const app = express();
app.set("port", process.env.PORT);
app.use(cors({ origin: true, credentials: true }));
const server = require("http").createServer(app);

app.use(
  session({
    sessionSecret: process.env.SESSION_SECRET,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisTtl: process.env.REDIS_TTL,
  })
);

//The use of the bodyParser constructor (app.use(bodyParser());) has been deprecated
//Now is a middleware, so you have to call the methods separately:
// app.use(errorHandler());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true,  parameterLimit: 1000000 }));
// app.use(express.static(path.join(__dirname, 'uploads')), serveIndex('uploads', {'icons': true}));
app.use(express.static(path.join(__dirname, "uploads")));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

//giving express access to routes
app.use("/api", require("./controllers"));

//start the server
server.listen(app.get("port"), function () {
  console.log("Express server listening on localhost:" + app.get("port"));
});
