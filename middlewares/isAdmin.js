'use strict'

exports.isAdmin = function(req, res, next){
    if(req.user.role !== 'ROLE_ADMIN'){
        return res.status(200).send({message:'Dont have permission for this section of the api'})
    }

    next();
};
