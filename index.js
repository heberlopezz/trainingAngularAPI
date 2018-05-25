'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

// mongoose.Promise = global.Promise;
/*
mongoose.connect('mongodb://localhost:27017/zoo', {useMongoClient:true})
        .then(()=>{
            console.log('Conection successfuly');
        })
        .catch(err=>console.log(err));
*/
mongoose.connect('mongodb://localhost:27017/zoo', (err, res)=>{
    if(err){
        throw err;
    } else {
        console.log('Conection successfuly');
        app.listen(port, ()=>{
            console.log('Localhost server is running with node and exprress correctly');
        });
    }
});
