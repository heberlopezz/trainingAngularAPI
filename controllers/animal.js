'use strict';
// modules
var fs = require('fs');
var path = require('path');

// models 
var User = require('../models/user');
var Animal = require('../models/animal');

//actions

function test(req, res) {
    res.status(200).send({
        message: 'Testing the user controller and the action test',
        user: req.user
    });
}

function saveAnimal(req, res) {
    var animal = new Animal();
    var params = req.body;

    if(params.name){
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;

        animal.save((err, animalStored)=>{
            if(err) {
                res.status(500).send({
                    message: 'Error in server'
                });
            } else {
                if(!animalStored){
                    res.status(404).send({
                        message: 'Dont save the animal'
                    });
                } else {
                    res.status(200).send({
                        animal: animalStored,
                        message: 'Method save animal'
                    });
                }
            }
        });
    } else {
        res.status(200).send({
            message: 'The name of animal is obligatory'
        });
    }
}

function getAnimals(req, res) {
    Animal.find({}).populate({path: 'user'}).exec((err, animals)=>{
        if(err){
            res.status(500).send({
                message: 'Error in fetch'
            });
        } else {
            if(!animals){
                res.status(404).send({
                    message: 'There arent any animals'
                });
            } else {
                res.status(200).send({
                    animals
                });
            }
        }
    });
}

function getAnimal(req, res) {
    var animalId = req.params.id;
    Animal.findById(animalId).populate({path: 'user'}).exec((err, animal)=>{
        if(err){
            res.status(500).send({
                message: 'Error in fetch'
            });
        } else {
            if(!animal){
                res.status(404).send({
                    message: 'The animal dont exist'
                });
            } else {
                res.status(200).send({
                    animal
                });
            }
        }
    });
}

function updateAnimal(req, res) {
    var animalId = req.params.id;
    var params = req.body;
    Animal.findByIdAndUpdate(animalId, params, {new:true}, (err, animalUpdated)=>{
        if(err){
            res.status(500).send({
                message: 'Error in fetch'
            });
        } else {
            if(!animalUpdated){
                res.status(500).send({
                    message: 'Dont update the animal'
                });
            } else {
                res.status(200).send({
                    animal: animalUpdated,
                    message: 'Animal updated successfuly'
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var animalId = req.params.id;
    var fileName = 'Dont updload';
    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        fileName = fileSplit[2];

        var extensionSplit = fileName.split('.');
        var fileExt = extensionSplit[1];

        if(fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif' ){
        
            Animal.findByIdAndUpdate(animalId, {image:fileName}, {new:true}, (err, animalUpdated)=>{
                if(err){
                    req.status(500).send({
                        message: 'Error while update animal'
                    });
                } else {
                    if(!animalUpdated){
                        res.status(404).send({
                            message: 'Error while update animal'
                        });
                    } else {
                        res.status(200).send({
                            animal: animalUpdated,
                            image: fileName,
                            message: 'Updated animal successfuly'
                        });
                    }
                }
            });
        } else {
            fs.unlink(filePath, (err)=>{
                if(err) {
                    res.status(200).send({message:"Extension invalid and file dont delete"});
                } else {
                    res.status(200).send({message:"Extension invalid"});
                }
            });
        }
    } else {
        res.status(200).send({message:"Dont upload file"});
    }
    
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var filePath = './uploads/animals/'+imageFile;
    fs.exists(filePath, function(exist){
        if(exist){
            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).send({message:'Image doesnt exist'});
        }
    });
}

function deleteAnimal(req, res) {
    var animalId = req.params.id;
    Animal.findByIdAndRemove(animalId, (err, animalRemoved)=>{
        if(err){
            res.status(500).send({message:'Error in fetch'});
        } else {
            if(!animalRemoved){
                res.status(500).send({message:'Dont remove the animal'});
            } else {
                res.status(500).send({animal:animalRemoved, message:'Delete animal successfuly'});
            }
        }
    })
}

module.exports = {
    test,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImage,
    getImageFile,
    deleteAnimal
}