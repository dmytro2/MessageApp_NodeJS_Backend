var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var Message = require('./models/message.js');
var MessageModel = Message.modelName;
var Users = require('./models/user.js');

var user_fields = '_id name lastname';

/**
 * Send new message
 * Request body: {
    user_id_from: user id in db who sends message
    user_id_to: user id in db who receives message
    text: message text
    }
**/
exports.add = function(req, res) {
  var created_at = new Date();
  Users.getByID(req.body.user_id_to).then(function(account) {
    var message = {
      user_id_from: req.body.user_id_from,
      user_id_to: req.body.user_id_to,
      user_name_to : account.name,
      text: req.body.message,
      is_delete:  0,
      timestamp: created_at
    };
    //console.log(req);
    var newMessage = new MessageModel(message);
    newMessage.save(function(err, response) {
      if(err) {
        res.json({Status: false, Message: "Error while adding new message"});
        return;
      }
      try {
        res.json({Status: true, Data: response});
      } catch (err) {
        console.log(err);
        res.json({Status: false, Message: 'Error while creating response'});
      }
    });
  }, function(err) {
    console.log("can't find user with this user id...");
    res.json({Status: false, Message: "can't find user with this user id"});
  });
  
}