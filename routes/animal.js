'use strict';

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var mdAuth = require('../middlewares/authenticate');
var mdAdmin = require("../middlewares/isAdmin");

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir:'./uploads/animals'});

api.get('/test-animals', mdAuth.ensureAuth, AnimalController.test);
api.post('/animal', [mdAuth.ensureAuth, mdAdmin.isAdmin], AnimalController.saveAnimal);
api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', AnimalController.getAnimal);
api.put('/animal/:id', [mdAuth.ensureAuth ,mdAdmin.isAdmin], AnimalController.updateAnimal);
api.post('/update-image-animal/:id', [mdAuth.ensureAuth, mdAdmin.isAdmin, mdUpload], AnimalController.uploadImage);
api.get('/get-image-animal/:imageFile', AnimalController.getImageFile);
api.delete('/animal/:id',[mdAuth.ensureAuth, mdAdmin.isAdmin], AnimalController.deleteAnimal);

module.exports = api;
