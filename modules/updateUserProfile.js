var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var Account = require('./models/user.js');
const bcrypt  = require('bcrypt');
var AccountModel = Account.modelName;


/**
 * update user profile info in user profile
 * Request Param: {user_id, name, email, password}
 * POST: /updateUserProfile
**/
exports.updateUserProfile = function(req, res) {
    var salt = bcrypt.genSaltSync();
    var password_hash = bcrypt.hashSync(req.body.password, salt);

  	AccountModel.update (
  		{_id: req.body.user_id},
  		{
        name: req.body.name,
        email: req.body.email,
        password: password_hash
      },
  		function(err,obj){
  			if(err){
  				console.log(err);
  				res.json({message: "error", Status:"No user with id : " + req.body.user_id});
  			}
  			else{
          if(!obj.n){ // if the message to be updated is not in database
            res.json({message: "failed. no user updated!", Status:"No user with id : " + req.body.user_id});
          }
          else{ // if the message is updated
          	res.json({message: "success", items: obj});
          }
  			}

  		});
}