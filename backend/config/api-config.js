var express = require("express");
var app = express();
var path = require('path');
var jwt = require('jsonwebtoken');
var httpServer = require('http').createServer(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorCode = require('../common/error-code');
var errorMessage = require('../common/error-methods');
var morgan = require('morgan');
var configResolve = require("../common/configResolver");
var winston = require('../config/winston');
var logger = require('../config/winston')(__filename);
const mongoose = require('./database');
const passport = require('passport');
//var redis = require('./redis');
var httpContext = require('express-http-context');
var cors = require('./cors');
const bearerToken = require('express-bearer-token');
const expressSwagger = require('express-swagger-generator')(app);
const socketIO = require("socket.io")(httpServer);

app.use('/public/stripe-webhooks', bodyParser.raw({type: 'application/json'}))

app.use(bodyParser.json({limit: "20mb"}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(morgan('combined', {
  stream: winston.stream
}));
app.use(cors.permission);
app.use(bearerToken());

// Passport middleware
app.use(passport.initialize());
app.use(httpContext.middleware);

//swagger
let options = {
  swaggerDefinition: {
      info: {
          description: 'This is a sample server',
          title: 'Swagger',
          version: '1.0.0',
      },
      host: 'localhost:9010',
      basePath: '/api',
      produces: [
          "application/json",
          "application/xml"
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
          JWT: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: "",
          }
      }
  },
  basedir: __dirname, //app absolute path
  files: ['../api/routes/*.js'] //Path to the API handle folder
};
expressSwagger(options)

var ApiConfig = {
  app: app,
  httpServer: httpServer,
  socketIO:socketIO
}

module.exports = ApiConfig;