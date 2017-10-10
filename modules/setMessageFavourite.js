var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var Message = require('./models/message.js');
var MessageModel = Message.modelName;
var Users = require('./models/user.js');

var user_fields = '_id name lastname';

/**
 * set message as favourite by message ID and boolean value on if message will be favourite
 * Request Param: {message_id, isFavourite}
 * POST: /setMessageFavourite
**/
exports.setMessageFavourite = function(req, res) {

  	MessageModel.update (
  		{_id: req.body.message_id},
  		{isFavourite: req.body.isFavourite},
  		function(err,obj){
  			if(err){
  				console.log(err);
  				res.json({message: "error", Status:"No message with id : " + req.body.message_id});
  			}
  			else{
          if(!obj.n){ // if the message to be updated is not in database
            res.json({message: "failed. no messages updated!", Status:"No message with id : " + req.body.message_id});
          }
          else{ // if the message is updated
          	res.json({message: "success", items: obj});
          }
  			}

  		});
}