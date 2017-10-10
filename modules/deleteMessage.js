var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var Message = require('./models/message.js');
var MessageModel = Message.modelName;

/**
 * delete message message ID 
 * Request Param: {message_id}
 * GET: /deleteMessage/:message_id
**/
exports.deleteMessage = function(req, res) {

  	MessageModel.remove (
  		{_id: req.params.message_id},
  		function(err,obj){
  			if(err){
  				console.log(err);
  				res.json({message: "error", Status:"No message with id : " + _id});
  			}
        else{
          console.log(obj);

          if(!obj.result.n){ // if the message to be deleted is not in database
            res.json({message: "failed. no messages deleted!", Status:"No message with id : " + req.params.message_id});
          }
          else{ // if the message is updated
            res.json({message: "success", items: obj});
          }
        }
  		});
}