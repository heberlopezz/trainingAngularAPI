'use strict';
// modules
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// models 
var User = require('../models/user');

// jwt service
var jwt = require('../services/jwt');

//actions

function test(req, res){
    res.status(200).send({
        message: 'Testing the user controller and the action test',
        user:req.user
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    console.log(params);
    
    if (params.password && params.name && params.surname && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.image = null;
        user.role = 'ROLE_USER';

        User.findOne({email:user.email.toLowerCase()}, (err, userFind) => {
            if (err) {
                res.status(500).send({
                    message: 'Error to check user'
                });
            } else {
                if(!userFind){
                    bcrypt.hash(params.password, null, null, function(err, hash){
                        user.password = hash;
                        user.save((err, userStored)=>{
                            if (err) {
                                res.status(500).send({
                                    message: 'Error to save user'
                                });
                            } else {
                                if(!userStored){
                                    res.status(404).send({
                                        message: 'Dont register user'
                                    });
                                } else {
                                    res.status(200).send({
                                        user: userStored,
                                        message: 'Save Method'
                                    });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({
                        message: 'The user should not register'
                    });
                }
            }
        })
    } else {
        res.status(200).send({
            message: 'Type data correctly for register user'
        });
    }
}

function login(req, res) {
    var params = req.body;
    var email = params.email;

    User.findOne({email:email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({
                message: 'Error to check user'
            });
        } else {
            if(user){
                bcrypt.compare(params.password, user.password, (err, check)=>{
                    if(check){
                        if(params.getToken) {
                            res.status(200).send({
                                token: jwt.crateToken(user)
                            });
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({
                            message: 'User dont login correctly'
                        });
                    }
                });                
            } else {
                res.status(404).send({
                    message: 'User dont exist'
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var params = req.body;

    if(userId !== req.user.sub){
        return req.status(200).send({message:'You dont have permission for updated user'});
    }

    User.findByIdAndUpdate(userId, params, {new:true}, (err, userUpdated)=>{
        if(err){
            req.status(500).send({
                message: 'Error while update user'
            });
        } else {
            if(!userUpdated){
                res.status(404).send({
                    message: 'Error while update user'
                });
            } else {
                res.status(200).send({
                    user: userUpdated,
                    message: 'Updated user successfuly'
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var fileName = 'Dont updload';
    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        fileName = fileSplit[2];
        var extensionSplit = fileName.split('.');
        var fileExt = extensionSplit[1];
        if(fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif' ){
            if(userId !== req.user.sub){
                return req.status(500).send({message:'You dont have permission for updated user'});
            }
        
            User.findByIdAndUpdate(userId, {image:fileName}, {new:true}, (err, userUpdated)=>{
                if(err){
                    req.status(500).send({
                        message: 'Error while update user'
                    });
                } else {
                    if(!userUpdated){
                        res.status(404).send({
                            message: 'Error while update user'
                        });
                    } else {
                        res.status(200).send({
                            user: userUpdated,
                            image: fileName,
                            message: 'Updated user successfuly'
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
    var filePath = './uploads/users/'+imageFile;
    fs.exists(filePath, function(exist){
        if(exist){
            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).send({message:'Image doesnt exist'});
        }
    });
}

function getKeepers(req, res){
    User.find({role:'ROLE_ADMIN'}).exec((err, users)=>{
        if(err){
            res.status(500).send({message:'Error in fetch'});
        } else {
            if(users){
                res.status(200).send({users:users,message:'Get keepers'});
            } else {
                res.status(404).send({message:'Dont have keepers'});
            }
        }
    });    
}

module.exports = {
    test,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
};
