'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'password_of_training_angular';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'The call dont have the header Authorization'
        })
    }
    var token = req.headers.authorization.replace(/['"]+/, '');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp<=moment.unix()){
            return res.status(401).send({
                message: 'The token was expired'
            });
        }
    } catch(ex){
        return res.status(404).send({
            message: 'Token invalid'
        });
    }

    req.user = payload;
    next();
}
