'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// load routers
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');

// middlewares of body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// config headers and cors

// base route
app.use('/api',user_routes);
app.use('/api',animal_routes);

module.exports = app;
