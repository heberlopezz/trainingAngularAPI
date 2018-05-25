'use strict';

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir:'./uploads/users'});

api.get('/test_of_controller', mdAuth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
api.post('/update-image-user/:id', [mdAuth.ensureAuth, mdUpload], UserController.uploadImage);
api.get('/get-image-file/:imageFile', UserController.getImageFile);
api.get('/keepers', UserController.getKeepers);

module.exports = api;
