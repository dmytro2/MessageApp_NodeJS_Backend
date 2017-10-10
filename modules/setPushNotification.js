var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var Account = require('./models/user.js');
var AccountModel = Account.modelName;


/**
 * set Push Notification setting in user profile
 * Request Param: {user_id, is_push_notification}
 * POST: /setPushNotification
**/
exports.setPushNotification = function(req, res) {

  	AccountModel.update (
  		{_id: req.body.user_id},
  		{push_notification: req.body.push_notification},
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